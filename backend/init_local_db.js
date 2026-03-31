import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateUniqueId } from './utils/idGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function initLocalDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log("Connected to Local PostgreSQL.");

    // Drop and re-create to ensure clean schema for new ID system
    console.log("Resetting database for new ID system...");
    await client.query(`DROP TABLE IF EXISTS payments CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS digital_diary CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS fees CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS timetable CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS marks CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS exams CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS assignments CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS attendance CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS admissions CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS students CASCADE;`);
    await client.query(`DROP TABLE IF EXISTS faculty CASCADE;`);

    // Create Faculty Table with all needed columns for login
    await client.query(`
      CREATE TABLE faculty (
        id SERIAL PRIMARY KEY,
        unique_id VARCHAR(15) UNIQUE,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255),
        face_descriptor TEXT,
        face_image TEXT,
        is_face_enrolled BOOLEAN DEFAULT FALSE,
        password TEXT,
        email VARCHAR(100)
      );
    `);

    // Create Students Table
    await client.query(`
      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        unique_id VARCHAR(15) UNIQUE,
        name VARCHAR(100) NOT NULL,
        roll_no VARCHAR(20) UNIQUE,
        class VARCHAR(50),
        email VARCHAR(100),
        phone VARCHAR(20),
        face_descriptor TEXT,
        face_image TEXT,
        is_face_enrolled BOOLEAN DEFAULT FALSE
      );
    `);

    // Create Admissions Table
    await client.query(`
      CREATE TABLE admissions (
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

    // Create Attendance Table
    await client.query(`
      CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id),
        date DATE,
        status VARCHAR(20),
        marked_by INT REFERENCES faculty(id),
        UNIQUE (student_id, date)
      );
    `);

    // Create Assignments Table
    await client.query(`
      CREATE TABLE assignments (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        file_url VARCHAR(255),
        class VARCHAR(50),
        subject VARCHAR(100),
        teacher_id INT REFERENCES faculty(id),
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create Exams Table
    await client.query(`
      CREATE TABLE exams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(100),
        max_marks INT,
        exam_date DATE
      );
    `);

    // Create Marks Table
    await client.query(`
      CREATE TABLE marks (
        id SERIAL PRIMARY KEY,
        exam_id INT REFERENCES exams(id),
        student_id INT REFERENCES students(id),
        marks_obtained DECIMAL(5,2),
        remarks TEXT,
        UNIQUE (exam_id, student_id)
      );
    `);

    // Create Timetable Table
    await client.query(`
      CREATE TABLE timetable (
        id SERIAL PRIMARY KEY,
        class VARCHAR(50),
        day VARCHAR(20),
        period_no INT,
        start_time TIME,
        end_time TIME,
        subject VARCHAR(100),
        teacher_id INT REFERENCES faculty(id)
      );
    `);

    // Create Fees Table
    await client.query(`
      CREATE TABLE fees (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id),
        month VARCHAR(20),
        year INT,
        amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Unpaid',
        due_date DATE
      );
    `);

    // Create Digital Diary Table
    await client.query(`
      CREATE TABLE digital_diary (
        id SERIAL PRIMARY KEY,
        teacher_id INT REFERENCES faculty(id),
        date DATE,
        lesson_plan TEXT,
        progress_percentage INT DEFAULT 0,
        remarks TEXT
      );
    `);

    // Seed Initial Faculty Data with Unique IDs
    console.log("Seeding faculty...");
    const facultyData = [
      ['Husbun Jahan', 'MBA | HR & IT Head', 'Expert in Human Resource Management.'],
      ['Divyanshi Verma', 'AI Engineer', 'Specializing in Advanced Agentic Coding.'],
      ['Rahul', 'MCA | IT Faculty', 'Master of Computer Applications.'],
      ['Gayatri', 'MBA | IT Faculty', 'MBA in HR & IT.'],
      ['TEA2026-02', 'Test Faculty', 'Legacy test support']
    ];

    for (const [name, desig, desc] of facultyData) {
        const uId = generateUniqueId('FAC');
        await client.query(`
          INSERT INTO faculty (unique_id, name, designation, description) VALUES ($1, $2, $3, $4)
        `, [uId, name, desig, desc]);
    }

    // Seed Initial Students
    console.log("Seeding students...");
    const studentData = [
      ['Aman Gupta', 'S101', 'Class 10'],
      ['Priya Singh', 'S102', 'Class 10']
    ];

    for (const [name, roll, cls] of studentData) {
        const uId = generateUniqueId('STU');
        await client.query(`
          INSERT INTO students (unique_id, name, roll_no, class) VALUES ($1, $2, $3, $4)
        `, [uId, name, roll, cls]);
    }

    console.log("Local Database Reset & Initialized Successfully!");
  } catch (err) {
    console.error("Setup failed:", err.message);
  } finally {
    await client.end();
  }
}

initLocalDB();
