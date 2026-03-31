import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function setupPostgres() {
  const client = new Client({
    host: 'db.pcfskxkrqyfdblqckvgb.supabase.co',
    port: 6543,
    user: 'postgres',
    password: 'Divyanshi@123$#',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL.");

    // Create Faculty Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255),
        face_descriptor TEXT,
        face_image TEXT,
        is_face_enrolled BOOLEAN DEFAULT FALSE
      );
    `);

    // Create Students Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
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

    // Create Attendance Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
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
      CREATE TABLE IF NOT EXISTS assignments (
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
      CREATE TABLE IF NOT EXISTS exams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(100),
        max_marks INT,
        exam_date DATE
      );
    `);

    // Create Marks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS marks (
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
      CREATE TABLE IF NOT EXISTS timetable (
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
      CREATE TABLE IF NOT EXISTS fees (
        id SERIAL PRIMARY KEY,
        student_id INT REFERENCES students(id),
        month VARCHAR(20),
        year INT,
        amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Unpaid',
        due_date DATE
      );
    `);

    // Seed Initial Data
    const facultyCount = await client.query("SELECT COUNT(*) FROM faculty");
    if (parseInt(facultyCount.rows[0].count) === 0) {
      console.log("Seeding faculty...");
      await client.query(`
        INSERT INTO faculty (name, designation, description) VALUES
        ('Husbun Jahan', 'MBA | HR & IT Head', 'Expert in Human Resource Management and Information Technology.'),
        ('Divyanshi Verma', 'AI Engineer', 'Specializing in Advanced Agentic Coding and AI integration.'),
        ('Rahul', 'MCA | Computer Science & IT Faculty', 'Master of Computer Applications.'),
        ('Gayatri', 'MBA | HR & IT Faculty', 'MBA in Human Resource & Information Technology.')
      `);
    }

    const studentCount = await client.query("SELECT COUNT(*) FROM students");
    if (parseInt(studentCount.rows[0].count) === 0) {
      console.log("Seeding students...");
      await client.query(`
        INSERT INTO students (name, roll_no, class, email, phone) VALUES
        ('Aman Gupta', 'S101', 'Class 10', 'aman@example.com', '9876543210'),
        ('Priya Singh', 'S102', 'Class 10', 'priya@example.com', '9876543211')
      `);
    }

    console.log("Supabase Setup Complete!");
  } catch (err) {
    console.error("Setup failed:", err.message);
  } finally {
    await client.end();
  }
}

setupPostgres();
