import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  password: String(process.env.DB_PASSWORD || ''),
  port: parseInt(process.env.DB_PORT || '3306'),
};

async function setupDatabase() {
  // Use a connection without database specified to create the database if needed
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log("Connected to MySQL server.");

    // Check if database exists
    const [databases] = await connection.query(`SHOW DATABASES LIKE 'school_db'`);
    if (databases.length === 0) {
      console.log("Creating database 'school_db'...");
      await connection.query("CREATE DATABASE school_db");
    } else {
      console.log("Database 'school_db' already exists.");
    }
    await connection.end();

    // Connect to school_db to create tables
    const dbConnection = await mysql.createConnection({ ...config, database: 'school_db' });
    console.log("Connected to 'school_db'. Creating tables...");

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS faculty (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        designation VARCHAR(100),
        description TEXT,
        image_url VARCHAR(255),
        face_descriptor TEXT,
        face_image TEXT,
        is_face_enrolled BOOLEAN DEFAULT FALSE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
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

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
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

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        date DATE,
        status VARCHAR(20),
        marked_by INT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (marked_by) REFERENCES faculty(id),
        UNIQUE KEY student_date (student_id, date)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        file_url VARCHAR(255),
        class VARCHAR(50),
        subject VARCHAR(100),
        teacher_id INT,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES faculty(id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        subject VARCHAR(100),
        max_marks INT,
        exam_date DATE
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        exam_id INT,
        student_id INT,
        marks_obtained DECIMAL(5,2),
        remarks TEXT,
        FOREIGN KEY (exam_id) REFERENCES exams(id),
        FOREIGN KEY (student_id) REFERENCES students(id),
        UNIQUE KEY exam_student (exam_id, student_id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS timetable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        class VARCHAR(50),
        day VARCHAR(20),
        period_no INT,
        start_time TIME,
        end_time TIME,
        subject VARCHAR(100),
        teacher_id INT,
        FOREIGN KEY (teacher_id) REFERENCES faculty(id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS digital_diary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT,
        date DATE,
        lesson_plan TEXT,
        progress_percentage INT DEFAULT 0,
        remarks TEXT,
        FOREIGN KEY (teacher_id) REFERENCES faculty(id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS fees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        month VARCHAR(20),
        year INT,
        amount DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'Unpaid',
        due_date DATE,
        FOREIGN KEY (student_id) REFERENCES students(id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fee_id INT,
        razorpay_order_id VARCHAR(255),
        razorpay_payment_id VARCHAR(255),
        razorpay_signature VARCHAR(255),
        amount DECIMAL(10,2),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (fee_id) REFERENCES fees(id)
      );
    `);

    await dbConnection.query(`
      CREATE TABLE IF NOT EXISTS live_classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id INT,
        class_name VARCHAR(50),
        subject VARCHAR(100),
        meeting_link TEXT,
        start_time TIMESTAMP,
        topic TEXT,
        status VARCHAR(20) DEFAULT 'Scheduled',
        FOREIGN KEY (teacher_id) REFERENCES faculty(id)
      );
    `);

    // Insert initial faculty data if empty
    const [facultyCount] = await dbConnection.query("SELECT COUNT(*) as count FROM faculty");
    if (facultyCount[0].count === 0) {
      console.log("Inserting initial faculty data...");
      await dbConnection.query(`
        INSERT INTO faculty (name, designation, description) VALUES
        ('Husbun Jahan', 'MBA | HR & IT Head', 'Expert in Human Resource Management and Information Technology. Manages institutional operations, staff coordination, and IT infrastructure.'),
        ('Divyanshi Verma', 'AI Engineer', 'Specializing in Advanced Agentic Coding and AI integration for educational growth.'),
        ('Rahul', 'MCA | Computer Science & IT Faculty', 'Master of Computer Applications with strong expertise in programming, database management, and networking.'),
        ('Gayatri', 'MBA | HR & IT Faculty', 'MBA in Human Resource & Information Technology. Skilled in organizational management and HR practices.')
      `);
    }

    // Insert sample students
    const [studentCount] = await dbConnection.query("SELECT COUNT(*) as count FROM students");
    if (studentCount[0].count === 0) {
      console.log("Inserting initial student data...");
      await dbConnection.query(`
        INSERT INTO students (name, roll_no, class, email, phone) VALUES
        ('Aman Gupta', 'S101', 'Class 10', 'aman@example.com', '9876543210'),
        ('Priya Singh', 'S102', 'Class 10', 'priya@example.com', '9876543211'),
        ('Rohan Verma', 'S103', 'Class 9', 'rohan@example.com', '9876543212')
      `);
    }

    // Insert sample exams
    const [examCount] = await dbConnection.query("SELECT COUNT(*) as count FROM exams");
    if (examCount[0].count === 0) {
      console.log("Inserting initial exam data...");
      await dbConnection.query(`
        INSERT INTO exams (name, subject, max_marks, exam_date) VALUES
        ('Unit Test 1', 'Mathematics', 50, '2026-04-15'),
        ('Unit Test 1', 'Science', 50, '2026-04-16')
      `);
    }

    console.log("Database setup complete!");
    await dbConnection.end();
  } catch (err) {
    console.error("Error setting up database:", err);
  }
}

setupDatabase();
