import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Common/Toaster';
import './Attendance.css';

const teachers = [
    { id: 1, name: 'Divyanshi Verma', class: 'AI Class' },
    { id: 2, name: 'Rahul Sharma', class: 'Class 10-A' },
    { id: 3, name: 'Priya Singh', class: 'Class 9-B' }
];

const generateStudents = (teacherId) => {
    const students = [];
    const baseId = teacherId * 1000;
    for (let i = 1; i <= 40; i++) {
        students.push({
            id: baseId + i,
            name: `Student ${baseId + i}`,
            guardianPhone: `919000000${String(baseId + i).padStart(3, '0')}`
        });
    }
    return students;
};

const TODAY = new Date().toISOString().split('T')[0];

function Attendance() {
    const { addToast } = useToast();
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [checkInTime, setCheckInTime] = useState(null);
    const [attendanceMarked, setAttendanceMarked] = useState(false);
    const [students, setStudents] = useState([]);
    const [canCheckOut, setCanCheckOut] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [view, setView] = useState('daily'); // daily, monthly, leaves
    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        if (selectedTeacher) {
            const savedData = localStorage.getItem(`attendance_${selectedTeacher}`);
            if (savedData) {
                const { time, marked } = JSON.parse(savedData);
                setCheckInTime(new Date(time));
                setAttendanceMarked(marked);
                const detail = JSON.parse(localStorage.getItem(`attendance_detail_${selectedTeacher}_${TODAY}`) || '[]');
                if (detail.length > 0) {
                    setStudents(detail);
                } else {
                    setStudents(generateStudents(selectedTeacher).map(s => ({ ...s, status: 'Present' })));
                }
            } else {
                setCheckInTime(null); setAttendanceMarked(false); setStudents([]);
            }
        }
    }, [selectedTeacher]);

    const handleCheckIn = () => {
        const now = new Date();
        setCheckInTime(now);
        setAttendanceMarked(true);
        setIsSaved(false);
        const freshStudents = generateStudents(selectedTeacher).map(s => ({ ...s, status: 'Present' }));
        setStudents(freshStudents);
        localStorage.setItem(`attendance_${selectedTeacher}`, JSON.stringify({ time: now, marked: true }));
        localStorage.setItem(`attendance_detail_${selectedTeacher}_${TODAY}`, JSON.stringify(freshStudents));
        addToast("Teacher presence marked! Register is open.", "success");
    };

    const handleSaveAttendance = () => {
        if (!selectedTeacher || students.length === 0) return;
        localStorage.setItem(`attendance_detail_${selectedTeacher}_${TODAY}`, JSON.stringify(students));
        setIsSaved(true);
        addToast("Attendance saved. Absentees can be notified via WhatsApp.", "success");
        setTimeout(() => setIsSaved(false), 2500);
    };

    const toggleStatus = (id, newStatus) => {
        setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `attendance_${selectedTeacher}_${TODAY}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        addToast("Data exported successfully!", "info");
    };

    const sendAbsenteeSMS = (student) => {
        const message = `Hello, your child ${student.name} is absent from school today. Please contact us.`;
        const url = `https://wa.me/${student.guardianPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="attendance-page">
            <div className="attendance-hero">
                <h1>Attendance Master Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={() => setView('daily')} style={{ padding: '8px 20px', borderRadius: '20px', background: view === 'daily' ? '#3b82f6' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>Daily Register</button>
                    <button onClick={() => setView('monthly')} style={{ padding: '8px 20px', borderRadius: '20px', background: view === 'monthly' ? '#8b5cf6' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>Monthly Report</button>
                    <button onClick={() => setView('leaves')} style={{ padding: '8px 20px', borderRadius: '20px', background: view === 'leaves' ? '#10b981' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>Leave Requests</button>
                </div>
            </div>

            <div className="attendance-main">
                <div className="attendance-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2>{view === 'daily' ? 'Register Management' : view === 'monthly' ? 'Performance Aggregator' : 'Leave Approvals'}</h2>
                        <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className="teacher-select" style={{ width: 'auto', margin: 0 }}>
                            <option value="">-- Select Teacher/Class --</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.class})</option>)}
                        </select>
                    </div>

                    {view === 'daily' && selectedTeacher && (
                        <div className="attendance-actions" style={{ marginTop: '20px' }}>
                            {!attendanceMarked ? (
                                <button onClick={handleCheckIn} className="check-in-btn">🕒 Mark Teacher Presence (Open Class)</button>
                            ) : (
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <span className="status-text">✅ Active Session started at {checkInTime?.toLocaleTimeString()}</span>
                                    <button onClick={handleExport} style={{ padding: '8px 15px', borderRadius: '10px', background: '#475569', color: '#fff', border: 'none', cursor: 'pointer' }}>📥 Export Register</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {view === 'daily' && attendanceMarked && (
                    <div className="student-list-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <span style={{ marginRight: '15px', color: '#10b981' }}>Present: {students.filter(s => s.status === 'Present').length}</span>
                                <span style={{ marginRight: '15px', color: '#ef4444' }}>Absent: {students.filter(s => s.status === 'Absent').length}</span>
                                <span style={{ color: '#f59e0b' }}>Late: {students.filter(s => s.status === 'Late').length}</span>
                            </div>
                            <button onClick={handleSaveAttendance} style={{ padding: '10px 25px', borderRadius: '10px', background: isSaved ? '#10b981' : '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                {isSaved ? '✅ Saved Successfully!' : '💾 Finalize Today'}
                            </button>
                        </div>

                        <div className="attendance-scroll" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                        <th style={{ padding: '12px' }}>Student</th>
                                        <th style={{ padding: '12px' }}>Status Log</th>
                                        <th style={{ padding: '12px' }}>Quick Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            <td style={{ padding: '12px' }}>{s.name}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ 
                                                    padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem',
                                                    background: s.status === 'Present' ? '#10b98120' : s.status === 'Absent' ? '#ef444420' : '#f59e0b20',
                                                    color: s.status === 'Present' ? '#10b981' : s.status === 'Absent' ? '#ef4444' : '#f59e0b'
                                                }}> {s.status} </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {['Present', 'Absent', 'Late'].map(st => (
                                                        <button key={st} onClick={() => toggleStatus(s.id, st)} style={{ padding: '5px 8px', borderRadius: '5px', fontSize: '0.7rem', background: s.status === st ? '#475569' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer' }}>{st}</button>
                                                    ))}
                                                    {s.status === 'Absent' && <button onClick={() => sendAbsenteeSMS(s)} style={{ padding: '5px 8px', borderRadius: '5px', fontSize: '0.7rem', background: '#25d366', color: '#fff', border: 'none', cursor: 'pointer' }}>WhatsApp 📲</button>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'monthly' && (
                    <div className="student-list-card">
                        <h2>Attendance Aggregator (Simulation)</h2>
                        <p style={{ color: '#888' }}>Viewing aggregate data for March 2026</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
                            <div className="attendance-card" style={{ textAlign: 'center', background: 'rgba(16, 185, 129, 0.1)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>94%</div>
                                <div>Average Attendance</div>
                            </div>
                            <div className="attendance-card" style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.1)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>26</div>
                                <div>Working Days</div>
                            </div>
                            <div className="attendance-card" style={{ textAlign: 'center', background: 'rgba(245, 158, 11, 0.1)' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>12</div>
                                <div>Late Arrivals</div>
                            </div>
                        </div>
                        <button style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>Download Monthly PDF Report 📄</button>
                    </div>
                )}

                {view === 'leaves' && (
                    <div className="student-list-card">
                        <p style={{ color: '#888' }}>Admin view for global leave management. Check individual Teacher portals for class-specific requests.</p>
                        <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', textAlign: 'center' }}>
                            <p>Global Leave Analytics: 12 Pending, 45 Approved this month.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Attendance;

