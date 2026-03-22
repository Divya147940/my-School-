import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useToast } from '../components/Common/Toaster';

const EmergencyPortal = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('bio'); // 'bio', 'departure', 'daily'
    
    // Bio Data State
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        bloodGroup: '', height: '', weight: '',
        allergies: '', emergencyContactName: '',
        emergencyContactPhone: '', medicalHistory: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    // Departure State
    const [departures, setDepartures] = useState([]);
    const [depForm, setDepForm] = useState({ studentId: '', name: '', reason: '', pickedBy: '', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });

    // Daily Logs State
    const [dailyLogs, setDailyLogs] = useState([]);
    const [logForm, setLogForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'General', title: '', description: '', amount: '' });

    useEffect(() => {
        const db = mockApi.getInitialData();
        setStudents(db.studentRegistry || []);
        setDepartures(mockApi.getEarlyDepartures());
        setDailyLogs(mockApi.getDailyLogs());
    }, []);

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setFormData(mockApi.getHealthRecord(student.id));
    };

    const handleSaveBio = () => {
        if (!selectedStudent) return;
        setIsSaving(true);
        setTimeout(() => {
            mockApi.updateHealthRecord(selectedStudent.id, formData);
            addToast('Bio Data updated successfully!', 'success');
            setIsSaving(false);
        }, 500);
    };

    const handleDepStudentIdChange = (e) => {
        const id = e.target.value;
        const student = students.find(s => s.id.toLowerCase() === id.toLowerCase() || s.rollNo == id);
        setDepForm({ ...depForm, studentId: id, name: student ? student.name : '' });
    };

    const handleSaveDeparture = () => {
        if (!depForm.studentId || !depForm.name || !depForm.reason) {
            addToast('Please fill all required fields.', 'error');
            return;
        }
        const record = mockApi.logEarlyDeparture(depForm);
        setDepartures([record, ...departures]);
        addToast('Early departure logged!', 'success');
        setDepForm({ ...depForm, studentId: '', name: '', reason: '', pickedBy: '' });
    };

    const handleSaveLog = () => {
        if (!logForm.title || !logForm.description) {
            addToast('Title and description are required.', 'error');
            return;
        }
        const record = mockApi.logDailyEvent(logForm);
        setDailyLogs([record, ...dailyLogs]);
        addToast('Daily log saved!', 'success');
        setLogForm({ ...logForm, title: '', description: '', amount: '' });
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2.5rem' }}>🚑</span>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#fff' }}>Emergency & Logs Portal</h1>
                    <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>Manage Bio-Data, Early Departures, and Campus Events.</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '16px' }}>
                {['bio', 'departure', 'daily'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                        flex: 1, padding: '15px', borderRadius: '12px', border: 'none',
                        background: activeTab === tab ? 'var(--accent-blue)' : 'transparent',
                        color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                        {tab === 'bio' ? '🏥 BIO-DATA' : tab === 'departure' ? '🏃‍♂️ EARLY DEPARTURES' : '📋 DAILY LOGS'}
                    </button>
                ))}
            </div>

            {/* BIO DATA TAB */}
            {activeTab === 'bio' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '30px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="glass-panel" style={{ padding: '25px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#fff' }}>Select Student</h3>
                        <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '20px' }} />
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())).map(student => (
                                <div key={student.id} onClick={() => handleSelectStudent(student)} style={{ padding: '15px', borderRadius: '12px', background: selectedStudent?.id === student.id ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selectedStudent?.id === student.id ? 'rgba(239, 68, 68, 0.4)' : 'transparent'}`, cursor: 'pointer' }}>
                                    <div style={{ fontWeight: 'bold', color: selectedStudent?.id === student.id ? '#ef4444' : '#fff' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {student.id} | Class: {student.class}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', minHeight: '500px' }}>
                        {selectedStudent ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                    <div>
                                        <h2 style={{ margin: 0, fontSize: '1.8rem', color: '#fff' }}>{selectedStudent.name}</h2>
                                        <p style={{ margin: '5px 0 0 0', color: 'var(--text-secondary)' }}>ID: {selectedStudent.id} • Class: {selectedStudent.class}</p>
                                    </div>
                                    <button onClick={handleSaveBio} disabled={isSaving} style={{ padding: '12px 25px', borderRadius: '12px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>{isSaving ? 'SAVING...' : 'SAVE BIO DATA'}</button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Blood Group</label>
                                        <input type="text" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Measurements (Height/Weight)</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input type="text" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} placeholder="Height" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                                            <input type="text" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="Weight" style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 'bold' }}>Allergies</label>
                                    <input type="text" value={formData.allergies} onChange={e => setFormData({...formData, allergies: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fff' }} />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Medical History</label>
                                    <textarea value={formData.medicalHistory} onChange={e => setFormData({...formData, medicalHistory: e.target.value})} rows="2" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}></textarea>
                                </div>
                                <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>📞 Emergency Contacts</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <input type="text" value={formData.emergencyContactName} onChange={e => setFormData({...formData, emergencyContactName: e.target.value})} placeholder="Name & Relation" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                                        <input type="text" value={formData.emergencyContactPhone} onChange={e => setFormData({...formData, emergencyContactPhone: e.target.value})} placeholder="Phone Number" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}><div style={{ fontSize: '4rem', marginBottom: '15px' }}>📋</div><p>Select a student to view/edit Bio Data.</p></div>
                        )}
                    </div>
                </div>
            )}

            {/* EARLY DEPARTURES TAB */}
            {activeTab === 'departure' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Log Early Departure</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <input type="text" placeholder="Student ID" value={depForm.studentId} onChange={handleDepStudentIdChange} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <input type="text" placeholder="Name (Auto-filled)" value={depForm.name} readOnly style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <input type="date" value={depForm.date} onChange={e => setDepForm({...depForm, date: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', colorScheme: 'dark' }} />
                            <input type="time" value={depForm.time} onChange={e => setDepForm({...depForm, time: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px' }}>
                            <input type="text" placeholder="Reason for departure..." value={depForm.reason} onChange={e => setDepForm({...depForm, reason: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <input type="text" placeholder="Picked up by (Name & Relation)..." value={depForm.pickedBy} onChange={e => setDepForm({...depForm, pickedBy: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <button onClick={handleSaveDeparture} style={{ padding: '12px 30px', borderRadius: '10px', background: '#f59e0b', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ADD LOG</button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Departure History</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead><tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '15px' }}>Date & Time</th><th style={{ padding: '15px' }}>Student</th><th style={{ padding: '15px' }}>Reason</th><th style={{ padding: '15px' }}>Picked By</th>
                            </tr></thead>
                            <tbody>
                                {departures.map(d => (
                                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{d.date} at {d.time}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{d.name} <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)' }}>#{d.studentId}</span></td>
                                        <td style={{ padding: '15px', color: '#f59e0b' }}>{d.reason}</td>
                                        <td style={{ padding: '15px' }}>{d.pickedBy}</td>
                                    </tr>
                                ))}
                                {departures.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>No recent early departures.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DAILY LOGS TAB */}
            {activeTab === 'daily' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', animation: 'fadeIn 0.3s ease' }}>
                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Log Event / Expense</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                            <select value={logForm.category} onChange={e => setLogForm({...logForm, category: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', border: '1px solid var(--glass-border)', color: '#fff' }}>
                                <option>General</option><option>Expense</option><option>Maintenance</option><option>Food/Snacks</option><option>Incident</option>
                            </select>
                            <input type="text" placeholder="Title (e.g. Samosas ordered, Fan repaired)" value={logForm.title} onChange={e => setLogForm({...logForm, title: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <input type="date" value={logForm.date} onChange={e => setLogForm({...logForm, date: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', colorScheme: 'dark' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: '15px' }}>
                            <input type="text" placeholder="Detailed Description / Notes..." value={logForm.description} onChange={e => setLogForm({...logForm, description: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }} />
                            <input type="text" placeholder="Amount (e.g. ₹500)" value={logForm.amount} onChange={e => setLogForm({...logForm, amount: e.target.value})} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', width: '150px' }} />
                            <button onClick={handleSaveLog} style={{ padding: '12px 30px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>SAVE LOG</button>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Daily Incident & Expense Record</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead><tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '15px' }}>Date</th><th style={{ padding: '15px' }}>Category</th><th style={{ padding: '15px' }}>Title</th><th style={{ padding: '15px' }}>Details & Amount</th>
                            </tr></thead>
                            <tbody>
                                {dailyLogs.map(l => (
                                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>{l.date}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>{l.category}</span>
                                        </td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{l.title}</td>
                                        <td style={{ padding: '15px', color: 'var(--text-secondary)' }}>
                                            {l.description} {l.amount && <strong style={{ color: '#10b981', marginLeft: '10px' }}>({l.amount})</strong>}
                                        </td>
                                    </tr>
                                ))}
                                {dailyLogs.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>No daily logs recorded.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmergencyPortal;
