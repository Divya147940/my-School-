import React, { useState, useEffect } from 'react';
import './Attendance.css';

const teachers = [
    { id: 1, name: 'Divyanshi Verma', class: 'AI Class' },
    { id: 2, name: 'Rahul Sharma', class: 'Class 10-A' },
    { id: 3, name: 'Priya Singh', class: 'Class 9-B' }
];

// Generator function for 40 students per teacher
const generateStudents = (teacherId) => {
    const students = [];
    // Use a base ID to ensure unique student IDs across different teachers
    const baseId = teacherId * 1000;
    for (let i = 1; i <= 40; i++) {
        students.push({
            id: baseId + i,
            name: `Student ${baseId + i}`,
            // Example guardian phone number, ensuring it's a string
            guardianPhone: `919000000${String(baseId + i).padStart(3, '0')}`
        });
    }
    return students;
};


function Attendance() {
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [checkInTime, setCheckInTime] = useState(null);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [students, setStudents] = useState([]);
    const [canCheckOut, setCanCheckOut] = useState(false);

    useEffect(() => {
        if (selectedTeacher) {
            const savedData = localStorage.getItem(`attendance_${selectedTeacher}`);
            if (savedData) {
                const { time, marked } = JSON.parse(savedData);
                setCheckInTime(new Date(time));
                setAttendanceMarked(marked);
                // Use the generator function to get students when loading from local storage
                setStudents(generateStudents(selectedTeacher).map(s => ({ ...s, status: 'Present' })));
            } else {
                setCheckInTime(null);
                setAttendanceMarked(false);
                setStudents([]);
            }
        }
    }, [selectedTeacher]);

    useEffect(() => {
        if (checkInTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const diff = (now - checkInTime) / (1000 * 60 * 60); // hours
                if (diff >= 6) {
                    setCanCheckOut(true);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [checkInTime]);

    const handleCheckIn = () => {
        const now = new Date();
        setCheckInTime(now);
        setAttendanceMarked(true);
        // Use the generator function to populate students on check-in
        setStudents(generateStudents(selectedTeacher).map(s => ({ ...s, status: 'Present' })));
        localStorage.setItem(`attendance_${selectedTeacher}`, JSON.stringify({ time: now, marked: true }));
    };

    const handleCheckOut = () => {
        localStorage.removeItem(`attendance_${selectedTeacher}`);
        setCheckInTime(null);
        setAttendanceMarked(false);
        setStudents([]);
        alert('Attendance completed for the day!');
    };

    const toggleAttendance = (id) => {
        setStudents(students.map(s =>
            s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
        ));
    };

    const sendAbsenteeSMS = (student) => {
        const message = `Hello, your child ${student.name} is absent from school today.`;
        const url = `https://wa.me/${student.guardianPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="attendance-page">
            <div className="attendance-hero">
                <h1>Teacher Attendance System</h1>
                <p>Track your presence and mark your students / अपनी उपस्थिति दर्ज करें</p>
            </div>

            <div className="attendance-main">
                <div className="attendance-card">
                    <h2>Step 1: Select Teacher / शिक्षक चुनें</h2>
                    <select
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="teacher-select"
                    >
                        <option value="">-- Select Teacher --</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.class})</option>
                        ))}
                    </select>

                    {selectedTeacher && (
                        <div className="attendance-actions">
                            {!attendanceMarked ? (
                                <button onClick={handleCheckIn} className="check-in-btn">
                                    🕒 Check-in (Mark Presence)
                                </button>
                            ) : (
                                <div className="status-box">
                                    <p className="status-text">✅ Marked Present at: {checkInTime?.toLocaleTimeString()}</p>
                                    <button
                                        onClick={handleCheckOut}
                                        disabled={!canCheckOut}
                                        className={`check-out-btn ${!canCheckOut ? 'disabled' : ''}`}
                                    >
                                        📤 Check-out (Requires 6 Hours)
                                    </button>
                                    {!canCheckOut && <p className="wait-msg">Please wait until 6 hours are complete.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {attendanceMarked && (
                    <div className="student-list-card">
                        <h2>Step 2: Student Attendance / बच्चों की उपस्थिति</h2>
                        <p className="hint">By default all are present. Toggle for absentees.</p>
                        <div className="student-grid">
                            {students.map(s => (
                                <div key={s.id} className={`student-card ${s.status === 'Absent' ? 'absent' : ''}`}>
                                    <span className="student-name">{s.name}</span>
                                    <div className="student-actions">
                                        <button
                                            onClick={() => toggleAttendance(s.id)}
                                            className={`toggle-btn ${s.status === 'Absent' ? 'absent-btn' : 'present-btn'}`}
                                        >
                                            {s.status}
                                        </button>
                                        {s.status === 'Absent' && (
                                            <button
                                                onClick={() => sendAbsenteeSMS(s)}
                                                className="notify-btn"
                                            >
                                                📲 Notify Parent
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Attendance;
