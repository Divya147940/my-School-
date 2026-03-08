import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  password: String(process.env.DB_PASSWORD || 'admin'),
  port: parseInt(process.env.DB_PORT || '5432'),
};

async function setupDatabase() {
  const client = new Client({ ...config, database: 'postgres' });
  try {
    await client.connect();

    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'school_db'");
    if (res.rowCount === 0) {
      console.log("Creating database 'school_db'...");
      await client.query("CREATE DATABASE school_db");
    } else {
      console.log("Database 'school_db' already exists.");
    }
    await client.end();

    // Connect to school_db to create tables
    const dbClient = new Client({ ...config, database: 'school_db' });
    await dbClient.connect();

    console.log("Creating tables...");
    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255)
      );

      DROP TABLE IF EXISTS admissions;
      CREATE TABLE IF NOT EXISTS admissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(100) NOT NULL,
        father_name VARCHAR(100),
        mother_name VARCHAR(100),
        dob DATE,
        gender VARCHAR(20),
        aadhar VARCHAR(20),
        class_applied VARCHAR(50),
        previous_school TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        category VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert initial faculty data if empty
    const facultyCheck = await dbClient.query("SELECT COUNT(*) FROM faculty");
    if (parseInt(facultyCheck.rows[0].count) === 0) {
      console.log("Inserting initial faculty data...");
      await dbClient.query(`
        INSERT INTO faculty (name, designation, description) VALUES
        ('Husbun Jahan', 'MBA | HR & IT Head', 'Expert in Human Resource Management and Information Technology. Manages institutional operations, staff coordination, and IT infrastructure.'),
        ('Divyanshi Verma', 'AI Engineer', 'Specializing in Advanced Agentic Coding and AI integration for educational growth.'),
        ('Rahul', 'MCA | Computer Science & IT Faculty', 'Master of Computer Applications with strong expertise in programming, database management, and networking.'),
        ('Gayatri', 'MBA | HR & IT Faculty', 'MBA in Human Resource & Information Technology. Skilled in organizational management and HR practices.')
      `);
    }

    console.log("Database setup complete!");
    await dbClient.end();
  } catch (err) {
    console.error("Error setting up database:", err);
  }
}

setupDatabase();
