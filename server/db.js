import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'school_db',
    password: String(process.env.DB_PASSWORD || ''),
    port: parseInt(process.env.DB_PORT || '5433'),
});

export default pool;
