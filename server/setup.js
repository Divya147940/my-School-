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

      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        roll_no VARCHAR(20) UNIQUE,
        class VARCHAR(50),
        email VARCHAR(100),
        phone VARCHAR(20)
      );

      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20), -- 'Present', 'Absent', 'Late'
        marked_by INTEGER REFERENCES faculty(id)
      );

      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        file_url VARCHAR(255),
        class VARCHAR(50),
        subject VARCHAR(100),
        teacher_id INTEGER REFERENCES faculty(id),
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL, -- 'Unit Test 1', 'Half Yearly', etc.
        subject VARCHAR(100),
        max_marks INTEGER,
        exam_date DATE
      );

      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        exam_id INTEGER REFERENCES exams(id),
        student_id INTEGER REFERENCES students(id),
        marks_obtained DECIMAL(5,2),
        remarks TEXT
      );

      CREATE TABLE IF NOT EXISTS timetable (
        id SERIAL PRIMARY KEY,
        class VARCHAR(50),
        day VARCHAR(20),
        period_no INTEGER,
        start_time TIME,
        end_time TIME,
        subject VARCHAR(100),
        teacher_id INTEGER REFERENCES faculty(id)
      );

      CREATE TABLE IF NOT EXISTS leave_requests (
        id SERIAL PRIMARY KEY,
        user_type VARCHAR(20), -- 'Faculty', 'Student'
        user_id INTEGER,
        start_date DATE,
        end_date DATE,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'Pending', -- 'Approved', 'Rejected'
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS digital_diary (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES faculty(id),
        date DATE DEFAULT CURRENT_DATE,
        lesson_plan TEXT,
        progress_percentage INTEGER DEFAULT 0,
        remarks TEXT
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

    // Insert sample students
    const studentCheck = await dbClient.query("SELECT COUNT(*) FROM students");
    if (parseInt(studentCheck.rows[0].count) === 0) {
      console.log("Inserting initial student data...");
      await dbClient.query(`
        INSERT INTO students (name, roll_no, class, email, phone) VALUES
        ('Aman Gupta', 'S101', 'Class 10', 'aman@example.com', '9876543210'),
        ('Priya Singh', 'S102', 'Class 10', 'priya@example.com', '9876543211'),
        ('Rohan Verma', 'S103', 'Class 9', 'rohan@example.com', '9876543212')
      `);
    }

    // Insert sample exams
    const examCheck = await dbClient.query("SELECT COUNT(*) FROM exams");
    if (parseInt(examCheck.rows[0].count) === 0) {
      console.log("Inserting initial exam data...");
      await dbClient.query(`
        INSERT INTO exams (name, subject, max_marks, exam_date) VALUES
        ('Unit Test 1', 'Mathematics', 50, '2026-04-15'),
        ('Unit Test 1', 'Science', 50, '2026-04-16')
      `);
    }

    // Insert sample timetable
    const timetableCheck = await dbClient.query("SELECT COUNT(*) FROM timetable");
    if (parseInt(timetableCheck.rows[0].count) === 0) {
      console.log("Inserting initial timetable data...");
      await dbClient.query(`
        INSERT INTO timetable (class, day, period_no, start_time, end_time, subject, teacher_id) VALUES
        ('Class 10', 'Monday', 1, '09:00:00', '10:00:00', 'Mathematics', 1),
        ('Class 10', 'Monday', 2, '10:00:00', '11:00:00', 'Science', 2),
        ('Class 9', 'Monday', 1, '09:00:00', '10:00:00', 'English', 3)
      `);
    }

    console.log("Database setup complete!");
    await dbClient.end();
  } catch (err) {
    console.error("Error setting up database:", err);
  }
}

setupDatabase();
