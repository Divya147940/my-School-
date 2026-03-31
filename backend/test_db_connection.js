import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// Fix for Node.js 18+ DNS resolution issues on Windows/macOS
dns.setDefaultResultOrder('verbatim');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const dbUrl = "postgresql://postgres:Divyanshi@123@127.0.0.1:5432/postgres";
console.log("Testing connection to LOCALHOST (Divyanshi@123):", dbUrl);

const pool = new Pool({
    connectionString: dbUrl
});

async function test() {
    try {
        const client = await pool.connect();
        console.log("Connected successfully!");
        
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log("Tables:", res.rows.map(r => r.table_name));

        const cols = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'faculty'
        `);
        console.log("Faculty columns:", cols.rows);

        client.release();
    } catch (err) {
        console.error("Connection error:", err.message);
    } finally {
        await pool.end();
    }
}

test();
