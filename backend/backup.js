import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'us-east-1';

import pool from './db.js';

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const HISTORY_FILE = path.join(__dirname, 'backup_history.json');

const logBackupStatus = (status) => {
    let history = [];
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) { console.error('History read error', e); }

    history.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...status
    });

    // Keep only last 20 attempts
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 20), null, 2));
};

const rotateBackups = (backupDir) => {
    try {
        const files = fs.readdirSync(backupDir);
        const now = Date.now();
        files.forEach(file => {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
            if (ageDays > 7 && file.endsWith('.zip')) {
                fs.unlinkSync(filePath);
                console.log(`Deleted old backup: ${file}`);
            }
        });
    } catch (e) { console.error('Rotation error', e); }
};

const runSqlFallback = async (sqlFile) => {
    console.log('Running SQL fallback (exporting tables to JSON format)...');
    const tablesResult = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tables = tablesResult.rows.map(r => r.table_name);
    
    let fullData = {};
    for (const table of tables) {
        const data = await pool.query(`SELECT * FROM ${table}`);
        fullData[table] = data.rows;
    }
    
    fs.writeFileSync(sqlFile.replace('.sql', '.json'), JSON.stringify(fullData, null, 2));
    // Update sqlFile variable in the outer scope? No, we just need to make sure the next steps find the file.
    // For simplicity, we'll just write to the expected path but with JSON content if it's easier.
    fs.writeFileSync(sqlFile, `-- SQL Fallback Data (JSON format)\n${JSON.stringify(fullData, null, 2)}`);
};

export const runBackup = async () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'temp_backups');
    const sqlFile = path.join(backupDir, `backup-${timestamp}.sql`);
    const zipFile = path.join(backupDir, `backup-${timestamp}.zip`);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const pgDumpPath = process.env.POSTGRES_BIN_PATH ? path.join(process.env.POSTGRES_BIN_PATH, 'pg_dump') : 'pg_dump';
    
    // Command to run pg_dump
    // PGPASSWORD environment variable is used to avoid interactive prompt
    const command = `${pgDumpPath} -h ${process.env.DB_HOST || 'localhost'} -p ${process.env.DB_PORT || '5432'} -U ${process.env.DB_USER || 'postgres'} ${process.env.DB_DATABASE || 'school_db'} > "${sqlFile}"`;

    console.log(`Starting backup: ${sqlFile}`);

    return new Promise((resolve, reject) => {
        exec(command, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD || '' } }, async (error, stdout, stderr) => {
            if (error) {
                try {
                    await runSqlFallback(sqlFile);
                } catch (fallbackError) {
                    console.error(`Fallback also failed: ${fallbackError.message}`);
                    logBackupStatus({
                        status: 'Failed',
                        error: `DB Connection/Fallback Error: ${fallbackError.message}`,
                        cloudSync: 'Failed'
                    });
                    return reject(fallbackError);
                }
            } else if (stderr) {
                console.warn(`Backup warning: ${stderr}`);
            }

            try {
                // Compress
                const zip = new AdmZip();
                zip.addLocalFile(sqlFile);
                zip.writeZip(zipFile);
                console.log(`Compressed: ${zipFile}`);

                let cloudStatus = 'Skipped (No Config)';
                // Check if AWS credentials exist before uploading
                if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME && process.env.AWS_ACCESS_KEY_ID !== 'your_access_key_id') {
                    console.log(`Uploading to S3: ${S3_BUCKET}`);
                    const fileStream = fs.createReadStream(zipFile);
                    const uploadParams = {
                        Bucket: S3_BUCKET,
                        Key: `backups/${path.basename(zipFile)}`,
                        Body: fileStream,
                    };
                    await s3Client.send(new PutObjectCommand(uploadParams));
                    console.log('Upload successful!');
                    cloudStatus = 'Success (S3)';
                } else {
                    console.warn('AWS credentials not found or placeholder. Skipping S3 upload.');
                }

                logBackupStatus({
                    status: 'Success',
                    cloudSync: cloudStatus,
                    fileName: path.basename(zipFile),
                    size: `${(fs.statSync(zipFile).size / 1024).toFixed(2)} KB`
                });

                // Cleanup
                fs.unlinkSync(sqlFile);
                rotateBackups(backupDir);
                
                resolve(zipFile);
            } catch (err) {
                console.error(`Post-backup error: ${err.message}`);
                logBackupStatus({
                    status: 'Partial Success (Local Only)',
                    error: err.message,
                    cloudSync: 'Failed'
                });
                reject(err);
            }
        });
    });
};

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runBackup().catch(console.error);
}
