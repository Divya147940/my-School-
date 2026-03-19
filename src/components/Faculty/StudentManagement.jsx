import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const StudentManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [className, setClassName] = useState('10A');
    const [parentName, setParentName] = useState('');
    const [recentStudent, setRecentStudent] = useState(null);
    const [studentList, setStudentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');

    useEffect(() => {
        setStudentList(mockApi.getDB().studentRegistry || []);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student and all their records?")) {
            mockApi.deleteStudent(id);
            setStudentList(prev => prev.filter(s => s.id !== id));
            addToast("Student record purged successfully.", "info");
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!name) {
            addToast("Student name is required.", "error");
            return;
        }
        if (!parentName) {
            addToast("Parent name is required.", "error");
            return;
        }
        
        try {
            const newStudent = mockApi.onboardStudent(name, className, parentName);
            setRecentStudent(newStudent);
            setStudentList(prev => [...prev, newStudent]);
            setName('');
            setParentName('');
            addToast(`Student ID Signed: ${newStudent.id}`, "success");
        } catch (err) {
            addToast(err.message, "error");
        }
    };

    const filteredStudents = studentList.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || s.class === filterClass;
        return matchesSearch && matchesClass;
    });

    return (
        <div className="student-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', padding: '20px' }}>
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

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Student Registry</h3>
                
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <input 
                        type="text" 
                        placeholder="Search name/ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                    />
                    <select 
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                    >
                        <option value="All">All Classes</option>
                        <option value="10A">10A</option>
                        <option value="9B">9B</option>
                        <option value="11C">11C</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '500px' }}>
                    {filteredStudents.length > 0 ? filteredStudents.slice().reverse().map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <div style={{ fontWeight: '700' }}>{s.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Class {s.class} • Roll {s.rollNo}</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{s.id}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.parentName}</div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(s.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No students found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
