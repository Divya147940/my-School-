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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
