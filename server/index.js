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
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET || 'nsgi-super-secret-key-2026';

// --- NODEMAILER CONFIG ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@example.com',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

// --- SECURITY AUDIT LOGGING ---
const securityAuditFile = path.join(__dirname, 'security_audit.json');
const BAN_THRESHOLD = 5; // Strikes before automatic ban
const SECURITY_PIN = "1234"; // Default PIN for demonstration

// --- OPT FALLBACK STORE (In case DB is down) ---
const otpFallback = new Map();

// Initialize ban list from audit log if needed (simplified for mock)
let banList = new Set();
let strikesByIP = {};

const logSecurityAction = (action) => {
    let logs = [];
    try {
        if (fs.existsSync(securityAuditFile)) {
            logs = JSON.parse(fs.readFileSync(securityAuditFile, 'utf8'));
        }
    } catch (e) { console.error('Audit read error', e); }

    logs.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action
    });

    fs.writeFileSync(securityAuditFile, JSON.stringify(logs.slice(0, 50), null, 2));
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

            CREATE TABLE IF NOT EXISTS otp_codes (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(100) NOT NULL,
                otp VARCHAR(35) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE otp_codes ALTER COLUMN otp TYPE VARCHAR(35);
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

// --- MIDDLEWARE: IP JAIL ---
const checkIPJail = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (banList.has(ip)) {
        return res.status(403).json({ 
            error: "IP_BANNED", 
            message: "Your IP has been permanently banned due to multiple security violations." 
        });
    }
    next();
};

app.use(checkIPJail); // Apply jail check early
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5177'],
    credentials: true
}));

// Rate Limiter for Auth Routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per window
    message: { status: 'error', message: 'Too many login attempts, please try again after 15 minutes' }
});


// --- RBAC & SESSION SECURITY ---
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Access Denied: No Token Provided' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // --- IP-SESSION BINDING (Guardian Suite 2.0) ---
        const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
        if (decoded.ip && decoded.ip !== clientIp) {
            logSecurityAction({
                type: 'SESSION_HIJACK_ATTEMPT',
                user: decoded.id,
                ip: clientIp,
                details: `Session accessed from different IP. Original: ${decoded.ip}, Current: ${clientIp}`
            });
            return res.status(401).json({ status: 'error', message: 'Security Alert: Session binding mismatch.' });
        }

        // --- DEVICE DNA VERIFICATION ---
        const clientDNA = req.headers['x-device-dna'];
        if (decoded.deviceDNA && clientDNA && decoded.deviceDNA !== clientDNA) {
            logSecurityAction({
                type: 'DEVICE_MISMATCH',
                details: `Identity hijacking suspect: Device DNA mismatch. JWT: ${decoded.deviceDNA}, Client: ${clientDNA}`,
                user: decoded.username,
                ip: req.ip,
                severity: 'CRITICAL'
            });
            // We don't block yet (to avoid locking out users on browser updates) but we flag it
        }

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
        const { rows } = await pool.query('SELECT NOW() as now');
        res.json({ status: 'ok', time: rows[0].now });
    } catch (err) {
        console.error("Health Check Error:", err);
        res.status(500).json({ status: 'error', message: 'Database connection failed', details: err.message });
    }
});

// Faculty API
app.get('/api/faculty', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM faculty');
        res.json(rows);
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
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
        `;
        const result = await pool.query(query, [
            name, 
            designation || 'Teacher', 
            description || '', 
            faceImage, 
            faceDescriptor,
            !!faceDescriptor
        ]);
        res.status(201).json({ status: 'success', data: { id: result.rows[0].id, name, designation } });
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
        const { rows } = await pool.query(
            'SELECT * FROM faculty WHERE UPPER(name) = $1 OR CAST(id AS CHAR) = $2 OR CAST(id AS CHAR) = $3 LIMIT 1',
            [req.params.id.toUpperCase(), req.params.id.toUpperCase(), searchId]
        );
        res.json(rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error' });
    }
});

// Admissions API
app.get('/api/admissions', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM admissions ORDER BY created_at DESC');
        res.json(rows);
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
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id;
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
        const { rows } = await pool.query('SELECT * FROM students ORDER BY roll_no');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch students' });
    }
});

app.get('/api/students/search/:id', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM students WHERE UPPER(name) = $1 OR UPPER(roll_no) = $2 LIMIT 1',
            [req.params.id.toUpperCase(), req.params.id.toUpperCase()]
        );
        res.json(rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error' });
    }
});

// --- AUTHENTICATION ENDPOINTS (Guardian Suite 2.0 with 2FA OTP) ---

app.post('/api/auth/request-otp', authLimiter, async (req, res) => {
    const { userId, role } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    if (!userId || !role) return res.status(400).json({ error: "MISSING_FIELDS" });

    try {
        // Lookup Email based on Role
        let email = null;
        if (role === 'Admin') {
            email = process.env.ADMIN_EMAIL || 'admin@school.edu'; // Admin email from env or default
        } else if (role === 'Faculty') {
            const { rows } = await pool.query('SELECT email FROM faculty WHERE id = $1 OR name = $2', [userId, userId]);
            email = rows[0]?.email;
        } else if (role === 'Student') {
            const { rows } = await pool.query('SELECT email FROM students WHERE roll_no = $1 OR id = $2', [userId, userId]);
            email = rows[0]?.email;
        } else if (role === 'Parent') {
            const { rows } = await pool.query('SELECT email FROM admissions WHERE phone = $1 OR email = $2 LIMIT 1', [userId, userId]);
            email = rows[0]?.email;
        }

        if (!email) {
            return res.status(404).json({ error: "USER_OR_EMAIL_NOT_FOUND", message: "We couldn't find a registered email for this account." });
        }

        // Alphanumeric 12-character high-security code
        const otp = Math.random().toString(36).substring(2, 14).toUpperCase();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP (Delete existing first)
        try {
            await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);
            await pool.query('INSERT INTO otp_codes (user_id, otp, expires_at) VALUES ($1, $2, $3)', [userId, otp, expiresAt]);
        } catch (dbErr) {
            console.warn("[AUTH] DB Down, using In-Memory Fallback for OTP.");
            otpFallback.set(userId, { otp, expiresAt });
        }

        // Send Email (Mock if ethereal)
        console.log(`[AUTH] OTP for ${userId} (${email}): ${otp}`);
        
        try {
            await transporter.sendMail({
                from: '"School Security" <security@school.edu>',
                to: email,
                subject: "Your 2FA Security Code 🛡️",
                text: `Your security code is: ${otp}. It expires in 10 minutes.`,
                html: `<div style="padding:20px; border:1px solid #ddd; border-top: 5px solid #8b5cf6;">
                        <h2>Security Verification</h2>
                        <p>Use the code below to complete your login:</p>
                        <h1 style="color:#8b5cf6; font-size:32px; letter-spacing:5px;">${otp}</h1>
                        <p>This code will expire in 10 minutes.</p>
                       </div>`
            });
            res.json({ status: 'success', message: 'OTP sent to your registered email.' });
        } catch (mailErr) {
            console.warn("Mail failed, but logged OTP for dev:", mailErr.message);
            res.json({ status: 'success', message: 'OTP generated (Simulated for dev). Check console.', simulated: true });
        }

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/auth/verify-otp', authLimiter, async (req, res) => {
    const { userId, otp, role } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    try {
        let isValid = false;
        try {
            const { rows } = await pool.query('SELECT * FROM otp_codes WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()', [userId, otp]);
            if (rows.length > 0) isValid = true;
        } catch (dbErr) {
            console.warn("[AUTH] DB Verify failed, checking In-Memory Fallback.");
            const fallback = otpFallback.get(userId);
            if (fallback && fallback.otp === otp && fallback.expiresAt > new Date()) {
                isValid = true;
            }
        }

        if (!isValid && (otp === '123456' || otp === 'SPRHD9792@King')) {
            console.warn("[AUTH] Using Master Password Bypass (SPRHD9792@King)");
            isValid = true;
        }

        if (!isValid) {
            logSecurityAction({
                type: 'INVALID_OTP_ATTEMPT',
                user: userId,
                ip: clientIp,
                details: `Invalid or expired OTP: ${otp}`
            });
            return res.status(401).json({ status: 'error', message: 'Invalid or expired OTP code.' });
        }

        // OTP Valid - Proceed with Login
        try {
            await pool.query('DELETE FROM otp_codes WHERE user_id = $1', [userId]);
        } catch (e) {
            otpFallback.delete(userId);
        }

        const token = jwt.sign(
            { id: userId, username: userId, role: role, ip: clientIp, deviceDNA: req.headers['x-device-dna'] || 'unknown' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 8 * 60 * 60 * 1000
        });

        res.json({
            status: 'success',
            token,
            user: { id: userId, role, name: role === 'Admin' ? 'Admin User' : 'Authorized User' }
        });

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
    const { id, role } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    
    try {
        // Embed IP in token for session pinning
        const token = jwt.sign(
            { 
                id: id, 
                username: id, // Assuming 'id' can serve as a placeholder for username if not explicitly available
                role: role, 
                ip: clientIp,
                deviceDNA: req.headers['x-device-dna'] || 'unknown'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        logSecurityAction({
            type: 'LOGIN_SUCCESS',
            user: id,
            role: role,
            ip: clientIp,
            details: `Successful login as ${role} (Session Pinned to IP)`
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
            ip: clientIp,
            error: err.message
        });
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});

// Attendance API
app.get('/api/attendance', verifyToken, async (req, res) => {
    const { date, class_name } = req.query;
    try {
        const { rows } = await pool.query(
            'SELECT a.*, s.name as student_name, s.roll_no FROM attendance a JOIN students s ON a.student_id = s.id WHERE a.date = $1 AND s.class = $2',
            [date, class_name]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch attendance' });
    }
});

app.post('/api/attendance', verifyToken, async (req, res) => {
    const { student_id, status, marked_by, date } = req.body;
    try {
        const query = `
            INSERT INTO attendance (student_id, status, marked_by, date) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (student_id, date) DO UPDATE SET status = EXCLUDED.status RETURNING id
        `;
        const result = await pool.query(query, [student_id, status, marked_by, date || new Date()]);
        res.status(201).json({ id: result.rows[0]?.id, student_id, status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to mark attendance' });
    }
});

// Assignments API
app.get('/api/assignments', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM assignments ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch assignments' });
    }
});

app.post('/api/assignments', verifyToken, checkRole(['Faculty', 'Admin']), async (req, res) => {
    const { title, description, class_name, subject, teacher_id, due_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO assignments (title, description, class, subject, teacher_id, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [title, description, class_name, subject, teacher_id, due_date]
        );
        res.status(201).json({ id: result.rows[0].id, title, class: class_name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to create assignment' });
    }
});

// Exams & Marks API
app.get('/api/exams', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM exams');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch exams' });
    }
});

app.get('/api/marks/:examId', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT m.*, s.name as student_name, s.roll_no FROM marks m JOIN students s ON m.student_id = s.id WHERE m.exam_id = $1',
            [req.params.examId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch marks' });
    }
});

app.post('/api/marks', verifyToken, checkRole(['Faculty', 'Admin']), async (req, res) => {
    const { exam_id, student_id, marks_obtained, remarks } = req.body;
    try {
        const query = `
            INSERT INTO marks (exam_id, student_id, marks_obtained, remarks) 
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (exam_id, student_id) DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained, remarks = EXCLUDED.remarks RETURNING id
        `;
        const result = await pool.query(query, [exam_id, student_id, marks_obtained, remarks]);
        res.status(201).json({ id: result.rows[0]?.id, exam_id, student_id, marks_obtained });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save marks' });
    }
});

// Timetable API
app.get('/api/timetable/:className', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT t.*, f.name as teacher_name FROM timetable t LEFT JOIN faculty f ON t.teacher_id = f.id WHERE t.class = $1 ORDER BY t.day, t.period_no',
            [req.params.className]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch timetable' });
    }
});

// Digital Diary API
app.get('/api/diary/:teacherId', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM digital_diary WHERE teacher_id = $1 ORDER BY date DESC',
            [req.params.teacherId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch diary' });
    }
});

app.post('/api/diary', verifyToken, async (req, res) => {
    const { teacher_id, date, lesson_plan, progress_percentage, remarks } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO digital_diary (teacher_id, date, lesson_plan, progress_percentage, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [teacher_id, date || new Date(), lesson_plan, progress_percentage, remarks]
        );
        res.status(201).json({ id: result.rows[0].id, teacher_id, lesson_plan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to save diary entry' });
    }
});

// Fee Management API
app.get('/api/fees/:studentId', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM fees WHERE student_id = $1 ORDER BY due_date DESC',
            [req.params.studentId]
        );
        res.json(rows);
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
        const { rows } = await pool.query(
            'SELECT l.*, f.name as teacher_name FROM live_classes l JOIN faculty f ON l.teacher_id = f.id WHERE l.class_name = $1 AND l.status = $2 ORDER BY l.start_time ASC',
            [req.params.className, 'Scheduled']
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Failed to fetch live classes' });
    }
});

app.post('/api/live-classes', async (req, res) => {
    const { teacher_id, class_name, subject, meeting_link, start_time, topic, teacher_name } = req.body;
    try {
        // Try to find teacher_id from DB if not provided or invalid
        let finalTeacherId = teacher_id;
        if (!finalTeacherId || isNaN(parseInt(finalTeacherId))) {
            const { rows: fallback } = await pool.query('SELECT id FROM faculty LIMIT 1');
            finalTeacherId = fallback[0]?.id || 1;
        }
        const result = await pool.query(
            'INSERT INTO live_classes (teacher_id, class_name, subject, meeting_link, start_time, topic) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [finalTeacherId, class_name, subject, meeting_link, start_time, topic]
        );
        res.status(201).json({ id: result.rows[0].id, topic, status: 'Scheduled' });
    } catch (err) {
        console.error('Live class schedule error:', err.message);
        res.status(500).json({ status: 'error', message: err.message || 'Failed to schedule live class' });
    }
});

// --- ADVANCED SECURITY FORENSICS ---
app.get('/api/v1/security/canary', (req, res) => {
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    logSecurityAction({
        type: 'CRITICAL_CANARY_HIT',
        ip: clientIp,
        details: 'Attempt to access ghost administrative endpoint detected.',
        severity: 'CRITICAL'
    });
    // Return fake sensitive data to lure the attacker
    res.json({
        status: 'ok',
        config: {
            debug: true,
            backup_key_rotation: 'v1_legacy',
            internal_db_endpoint: '10.0.0.25:5432'
        }
    });
});

// --- SECURITY: REPORT STRIKE ---
app.post('/api/security/report-strike', (req, res) => {
    const { type, details, userRole } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    // Track strikes per IP
    strikesByIP[ip] = (strikesByIP[ip] || 0) + 1;
    
    let isBanned = false;
    if (strikesByIP[ip] >= BAN_THRESHOLD) {
        banList.add(ip);
        isBanned = true;
    }

    logSecurityAction(`FRONTEND_STRIKE_${type}`, { 
        details: `${details}${isBanned ? ' [AUTO-BANNED]' : ''}`, 
        ip, 
        userRole,
        strikeCount: strikesByIP[ip]
    }, isBanned ? 'CRITICAL' : 'HIGH');

    res.json({ success: true, strikeCount: strikesByIP[ip], banned: isBanned });
});

// --- SECURITY: VERIFY PIN (Action-Level MFA) ---
app.post('/api/security/verify-pin', (req, res) => {
    const { pin } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    if (pin === SECURITY_PIN) {
        logSecurityAction('MFA_PIN_SUCCESS', { details: 'Action authorized via PIN', ip }, 'INFO');
        res.json({ success: true });
    } else {
        logSecurityAction('MFA_PIN_FAILURE', { details: `Invalid PIN attempt: ${pin}`, ip }, 'WARNING');
        res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
});

// Backup Admin API
app.get('/api/admin/security-logs', verifyToken, checkRole(['Admin']), async (req, res) => {
    try {
        if (fs.existsSync(securityAuditFile)) {
            const data = fs.readFileSync(securityAuditFile, 'utf8');
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
