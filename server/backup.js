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

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

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
                console.error(`Backup error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.warn(`Backup warning: ${stderr}`);
            }

            try {
                // Compress
                const zip = new AdmZip();
                zip.addLocalFile(sqlFile);
                zip.writeZip(zipFile);
                console.log(`Compressed: ${zipFile}`);

                // Check if AWS credentials exist before uploading
                if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET_NAME) {
                    console.log(`Uploading to S3: ${S3_BUCKET}`);
                    const fileStream = fs.createReadStream(zipFile);
                    const uploadParams = {
                        Bucket: S3_BUCKET,
                        Key: `backups/${path.basename(zipFile)}`,
                        Body: fileStream,
                    };
                    await s3Client.send(new PutObjectCommand(uploadParams));
                    console.log('Upload successful!');
                } else {
                    console.warn('AWS credentials not found. Skipping S3 upload. Backup saved locally in temp_backups/');
                }

                // Cleanup
                fs.unlinkSync(sqlFile);
                // We keep the zip locally as well for redundancy, or delete it? 
                // Let's keep the last few zips or delete them? 
                // For now, let's keep it to be safe, but ideally we rotate.
                
                resolve(zipFile);
            } catch (err) {
                console.error(`Post-backup error: ${err.message}`);
                reject(err);
            }
        });
    });
};

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runBackup().catch(console.error);
}
