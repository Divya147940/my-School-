import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const AttendanceOps = () => {
    const { t, language } = useLanguage();
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setStudents(mockApi.getAttendanceHub());
    }, []);

    const handleMark = (name, status) => {
        mockApi.markAttendance(name, status);
        setStudents(mockApi.getAttendanceHub());
    };

    const filteredStudents = (students || []).filter(s => {
        const name = s?.studentName || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="attendance-ops" style={{ padding: '20px' }}>
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{t('manualAttendance')}</h2>
                <input 
                    type="text" 
                    placeholder={t('searchStudent')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        padding: '12px 20px', 
                        borderRadius: '12px', 
                        background: 'var(--glass-bg)', 
                        border: '1px solid var(--glass-border)',
                        color: '#fff',
                        width: '250px'
                    }}
                />
            </div>

            <div className="student-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {filteredStudents.map(student => (
                    <div key={student.id} className="glass-panel" style={{ 
                        padding: '20px', 
                        borderRadius: '24px', 
                        background: 'var(--glass-bg)', 
                        border: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{student.studentName}</h4>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Class: {student.class}</span>
                            <div style={{ marginTop: '5px' }}>
                                <span style={{ 
                                    fontSize: '0.7rem', 
                                    padding: '4px 8px', 
                                    borderRadius: '6px',
                                    background: student.status === 'Present' ? '#10b98120' : student.status === 'Absent' ? '#f43f5e20' : '#cbd5e120',
                                    color: student.status === 'Present' ? '#10b981' : student.status === 'Absent' ? '#f43f5e' : '#94a3b8',
                                    fontWeight: '800'
                                }}>
                                    {student.status.toUpperCase()}
                                </span>
                                {student.time !== '-' && <span style={{ fontSize: '0.7rem', marginLeft: '10px', color: 'var(--text-secondary)' }}>at {student.time}</span>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => handleMark(student.studentName, student.status === 'Present' ? 'Pending' : 'Present')}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '12px', 
                                    background: student.status === 'Present' ? '#10b981' : 'rgba(255,255,255,0.05)', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: '#fff',
                                    transition: '0.3s'
                                }}
                                title={t('markPresent')}
                            >
                                ✅
                            </button>
                            <button 
                                onClick={() => handleMark(student.studentName, student.status === 'Absent' ? 'Pending' : 'Absent')}
                                style={{ 
                                    padding: '10px', 
                                    borderRadius: '12px', 
                                    background: student.status === 'Absent' ? '#f43f5e' : 'rgba(255,255,255,0.05)', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    color: '#fff',
                                    transition: '0.3s'
                                }}
                                title={t('markAbsent')}
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceOps;
