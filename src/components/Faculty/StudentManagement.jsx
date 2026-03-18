import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const StudentManagement = () => {
    const { t, language } = useLanguage();
    const [name, setName] = useState('');
    const [className, setClassName] = useState('10A');
    const [parentName, setParentName] = useState('');
    const [recentStudent, setRecentStudent] = useState(null);
    const [studentList, setStudentList] = useState([]);

    useEffect(() => {
        setStudentList(mockApi.loadData().studentRegistry || []);
    }, []);

    const handleRegister = (e) => {
        e.preventDefault();
        if (!name || !parentName) return;
        
        const newStudent = mockApi.onboardStudent(name, className, parentName);
        setRecentStudent(newStudent);
        setStudentList(prev => [...prev, newStudent]);
        setName('');
        setParentName('');
    };

    return (
        <div className="student-management" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '20px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('registerStudent')}</h2>
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Arjun Singh"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Class</label>
                        <select 
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        >
                            <option value="10A">10A</option>
                            <option value="9B">9B</option>
                            <option value="11C">11C</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('parentName')}</label>
                        <input 
                            type="text" 
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="e.g. Ramesh Singh"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                        SIGN STUDENT ID 🪪
                    </button>
                </form>

                {recentStudent && (
                    <div style={{ marginTop: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b98150' }}>
                        <p style={{ color: '#10b981', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>{t('onboardSuccess')}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID</div>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)' }}>{recentStudent.id}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ROLL NO</div>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)' }}>{recentStudent.rollNo}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Student Registry</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {studentList.slice().reverse().map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
                            <div>
                                <div style={{ fontWeight: '700' }}>{s.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Class {s.class} • Roll {s.rollNo}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{s.id}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.parentName}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
