import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import fs from 'fs';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { runBackup } from './backup.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET || 'nsgi-super-secret-key-2026';

// --- SECURITY AUDIT LOGGING ---
const AUDIT_FILE = path.join(__dirname, 'security_audit.json');
const logSecurityAction = (action) => {
    let logs = [];
    try {
        if (fs.existsSync(AUDIT_FILE)) {
            logs = JSON.parse(fs.readFileSync(AUDIT_FILE, 'utf8'));
        }
    } catch (e) { console.error('Audit read error', e); }

    logs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action
    });

    fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(0, 50), null, 2));
};

dotenv.config({ path: path.join(__dirname, '.env') });

// Schedule Backup: Everyday at 00:00 (Midnight)
cron.schedule('0 0 * * *', () => {
    console.log('Running daily backup task...');
    runBackup();
});

const app = express();
const PORT = process.env.PORT || 5001;

// --- Initialize DB Schema Upgrades ---
const initDB = async () => {
    try {
        await pool.query(`
            ALTER TABLE faculty ADD COLUMN IF NOT EXISTS face_descriptor TEXT;
            ALTER TABLE faculty ADD COLUMN IF NOT EXISTS face_image TEXT;
            ALTER TABLE faculty ADD COLUMN IF NOT EXISTS is_face_enrolled BOOLEAN DEFAULT FALSE;
            
            ALTER TABLE students ADD COLUMN IF NOT EXISTS face_descriptor TEXT;
            ALTER TABLE students ADD COLUMN IF NOT EXISTS face_image TEXT;
            ALTER TABLE students ADD COLUMN IF NOT EXISTS is_face_enrolled BOOLEAN DEFAULT FALSE;
        `);
        console.log("Database schema updated for biometrics (Status + Descriptors).");
    } catch (e) {
        console.error("DB Init Error:", e.message);
    }
};
initDB();

// --- ADVANCED SECURITY MIDDLEWARE ---
app.use(helmet()); // Security headers
app.use(cookieParser()); // Parse cookies
app.use(express.json());

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per window
    message: { status: 'error', message: 'Too many login attempts, please try again after 15 minutes' }
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

// --- RBAC MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Access Denied: No Token Provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ status: 'error', message: 'Invalid or Expired Token' });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Insufficient Permissions' });
    }
    next();
};

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

app.post('/api/faculty', async (req, res) => {
    const { name, designation, description, faceImage, faceDescriptor } = req.body;
    try {
        const query = `
            INSERT INTO faculty (name, designation, description, face_image, face_descriptor, is_face_enrolled) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `;
        const result = await pool.query(query, [
            name, 
            designation || 'Teacher', 
            description || '', 
            faceImage, 
            faceDescriptor,
            !!faceDescriptor
        ]);
        res.status(201).json({ status: 'success', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save faculty' });
    }
});

// Specific Lookup for Biometric Login
app.get('/api/faculty/search/:id', async (req, res) => {
    try {
        const searchId = req.params.id.toUpperCase().replace(/[^0-9]/g, ''); // Extract numbers
        // Search by name (if full name is entered) OR by numeric ID (if T015/TEA015 etc is entered)
        const result = await pool.query(
            'SELECT * FROM faculty WHERE UPPER(name) = $1 OR CAST(id AS TEXT) = $2 OR CAST(id AS TEXT) = $3 LIMIT 1',
            [req.params.id.toUpperCase(), req.params.id.toUpperCase(), searchId]
        );
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ status: 'error' });
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

app.get('/api/students/search/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE UPPER(name) = $1 OR UPPER(roll_no) = $1 LIMIT 1',
            [req.params.id.toUpperCase()]
        );
        res.json(result.rows[0] || null);
    } catch (err) {
        res.status(500).json({ status: 'error' });
    }
});

// --- AUTHENTICATION ENDPOINTS ---
app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { id, role } = req.body;
    
    try {
        const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '8h' });
        
        logSecurityAction({
            type: 'LOGIN_SUCCESS',
            user: id,
            role: role,
            ip: req.ip || '127.0.0.1',
            details: `Successful login as ${role}`
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });

        res.json({
            status: 'success',
            token,
            user: { id, role, name: role === 'Admin' ? 'Admin User' : 'Authorized User' }
        });
    } catch (err) {
        logSecurityAction({
            type: 'LOGIN_FAILURE',
            user: id,
            ip: req.ip || '127.0.0.1',
            error: err.message
        });
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Attendance API
app.get('/api/attendance', verifyToken, async (req, res) => {
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

app.post('/api/attendance', verifyToken, async (req, res) => {
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

app.post('/api/assignments', verifyToken, checkRole(['Faculty', 'Admin']), async (req, res) => {
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

app.post('/api/marks', verifyToken, checkRole(['Faculty', 'Admin']), async (req, res) => {
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

app.post('/api/diary', verifyToken, async (req, res) => {
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

// Fee Management API
app.get('/api/fees/:studentId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM fees WHERE student_id = $1 ORDER BY due_date DESC',
            [req.params.studentId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch fees' });
    }
});

app.post('/api/fees/create-order', async (req, res) => {
    const { feeId, amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `fee_${feeId}_${Date.now()}`,
        };
        const order = await razorpay.orders.create(options);
        
        // Save order to payments table
        await pool.query(
            'INSERT INTO payments (fee_id, razorpay_order_id, amount, status) VALUES ($1, $2, $3, $4)',
            [feeId, order.id, amount, 'created']
        );
        
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to create Razorpay order' });
    }
});

app.post('/api/fees/verify-payment', async (req, res) => {
    const { feeId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        try {
            // Update payment record
            await pool.query(
                'UPDATE payments SET razorpay_payment_id = $1, razorpay_signature = $2, status = $3 WHERE razorpay_order_id = $4',
                [razorpay_payment_id, razorpay_signature, 'captured', razorpay_order_id]
            );
            
            // Update fee status
            await pool.query(
                'UPDATE fees SET status = $1 WHERE id = $2',
                ['Paid', feeId]
            );
            
            res.json({ status: 'success', message: 'Payment verified successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ status: 'error', message: 'Failed to update payment status' });
        }
    } else {
        res.status(400).json({ status: 'error', message: 'Invalid signature' });
    }
});

// Live Classes API
app.get('/api/live-classes/:className', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT l.*, f.name as teacher_name FROM live_classes l JOIN faculty f ON l.teacher_id = f.id WHERE l.class_name = $1 AND l.status = $2 ORDER BY l.start_time ASC',
            [req.params.className, 'Scheduled']
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch live classes' });
    }
});

app.post('/api/live-classes', verifyToken, checkRole(['Faculty', 'Admin']), async (req, res) => {
    const { teacher_id, class_name, subject, meeting_link, start_time, topic } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO live_classes (teacher_id, class_name, subject, meeting_link, start_time, topic) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [teacher_id, class_name, subject, meeting_link, start_time, topic]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to schedule live class' });
    }
});

// Backup Admin API
app.get('/api/admin/security-logs', verifyToken, checkRole(['Admin']), async (req, res) => {
    try {
        if (fs.existsSync(AUDIT_FILE)) {
            const data = fs.readFileSync(AUDIT_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch security logs' });
    }
});

app.get('/api/admin/backup-history', verifyToken, checkRole(['Admin']), async (req, res) => {
    try {
        const historyFile = path.join(__dirname, 'backup_history.json');
        if (fs.existsSync(historyFile)) {
            const data = fs.readFileSync(historyFile, 'utf8');
            res.json(JSON.parse(data));
        } else {
            res.json([]);
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch backup history' });
    }
});

app.post('/api/admin/run-backup', verifyToken, checkRole(['Admin']), async (req, res) => {
    try {
        const result = await runBackup();
        res.json({ status: 'success', message: 'Backup completed successfully', file: path.basename(result) });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
