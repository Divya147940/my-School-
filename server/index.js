import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: 'ok', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

// Faculty API
app.get('/api/faculty', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM faculty');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch faculty' });
    }
});

// Admissions API
app.get('/api/admissions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM admissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch admissions' });
    }
});

app.post('/api/admissions', async (req, res) => {
    const {
        studentName, fatherName, motherName, dob, gender,
        aadhar, classApplied, previousSchool, address, phone, email, category
    } = req.body;

    try {
        const query = `
            INSERT INTO admissions (
                student_name, father_name, mother_name, dob, gender,
                aadhar, class_applied, previous_school, address, phone, email, category
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id;
        `;
        const values = [
            studentName, fatherName, motherName, dob, gender,
            aadhar, classApplied, previousSchool, address, phone, email, category
        ];

        const result = await pool.query(query, values);
        res.status(201).json({ status: 'success', id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save admission' });
    }
});

// Students API
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students ORDER BY roll_no');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }
});

// Attendance API
app.get('/api/attendance', async (req, res) => {
    const { date, class_name } = req.query;
    try {
        const result = await pool.query(
            'SELECT a.*, s.name as student_name, s.roll_no FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = $1 AND s.class = $2',
            [date, class_name]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch attendance' });
    }
});

app.post('/api/attendance', async (req, res) => {
    const { student_id, status, marked_by, date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO attendance (student_id, status, marked_by, date) VALUES ($1, $2, $3, $4) ON CONFLICT (student_id, date) DO UPDATE SET status = $2 RETURNING *',
            [student_id, status, marked_by, date || new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to mark attendance' });
    }
});

// Assignments API
app.get('/api/assignments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assignments ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch assignments' });
    }
});

app.post('/api/assignments', async (req, res) => {
    const { title, description, class_name, subject, teacher_id, due_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO assignments (title, description, class, subject, teacher_id, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, class_name, subject, teacher_id, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to create assignment' });
    }
});

// Exams & Marks API
app.get('/api/exams', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exams');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch exams' });
    }
});

app.get('/api/marks/:examId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT m.*, s.name as student_name, s.roll_no FROM marks m JOIN students s ON m.student_id = s.id WHERE m.exam_id = $1',
            [req.params.examId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch marks' });
    }
});

app.post('/api/marks', async (req, res) => {
    const { exam_id, student_id, marks_obtained, remarks } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO marks (exam_id, student_id, marks_obtained, remarks) VALUES ($1, $2, $3, $4) ON CONFLICT (exam_id, student_id) DO UPDATE SET marks_obtained = $3, remarks = $4 RETURNING *',
            [exam_id, student_id, marks_obtained, remarks]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save marks' });
    }
});

// Timetable API
app.get('/api/timetable/:className', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT t.*, f.name as teacher_name FROM timetable t LEFT JOIN faculty f ON t.teacher_id = f.id WHERE t.class = $1 ORDER BY t.day, t.period_no',
            [req.params.className]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch timetable' });
    }
});

// Digital Diary API
app.get('/api/diary/:teacherId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM digital_diary WHERE teacher_id = $1 ORDER BY date DESC',
            [req.params.teacherId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch diary' });
    }
});

app.post('/api/diary', async (req, res) => {
    const { teacher_id, date, lesson_plan, progress_percentage, remarks } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO digital_diary (teacher_id, date, lesson_plan, progress_percentage, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [teacher_id, date || new Date(), lesson_plan, progress_percentage, remarks]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save diary entry' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
