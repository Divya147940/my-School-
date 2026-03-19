import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const Homework = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ 
        title: '', 
        class: 'Class 10A', 
        subject: '', 
        dueDate: '',
        instructions: '' 
    });

    useEffect(() => {
        setAssignments(mockApi.getAssignments());
    }, []);

    const blueprints = [
        { title: 'Weekly Math Quiz', subject: 'Mathematics', instructions: 'Solve the attached worksheet on Algebra.' },
        { title: 'Lab Report - Acids', subject: 'Science', instructions: 'Write your observations from today\'s lab session.' },
        { title: 'Grammar Practice', subject: 'English', instructions: 'Complete Exercise 4 from the workbook.' }
    ];

    const handleQuickPost = (bp) => {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const asm = { ...bp, class: 'Class 10A', dueDate: nextWeek };
        mockApi.addAssignment(asm);
        setAssignments(mockApi.getAssignments());
        addToast(language === 'hi' ? 'ब्लूप्रिंट का उपयोग करके प्रकाशित किया गया!' : 'Published using Blueprint!', 'success');
    };

    const handleAdd = (e) => {
        e.preventDefault();
        mockApi.addAssignment(newAssignment);
        setAssignments(mockApi.getAssignments());
        setShowForm(false);
        setNewAssignment({ title: '', class: 'Class 10A', subject: '', dueDate: '', instructions: '' });
        addToast(language === 'hi' ? 'असाइनमेंट सफलतापूर्वक बनाया गया!' : 'Assignment Broadcasted Successfully!', 'success');
    };

    const handleDelete = (id) => {
        if (window.confirm(language === 'hi' ? 'क्या आप इस असाइनमेंट को हटाना चाहते हैं?' : 'Are you sure you want to delete this?')) {
            mockApi.removeAssignment(id);
            setAssignments(mockApi.getAssignments());
            addToast('Deleted', 'info');
        }
    };

    return (
        <div className="homework-module">
            <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
                <div>
                    <h3 className="section-title" style={{ margin: 0 }}>{language === 'hi' ? 'सक्रिय असाइनमेंट' : 'Active Assignments'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your digital classroom handouts</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="premium-btn"
                    style={{ 
                        padding: '12px 25px', 
                        borderRadius: '14px', 
                        background: showForm ? '#ef444420' : '#10b98120', 
                        color: showForm ? '#ef4444' : '#10b981', 
                        border: '1px solid var(--glass-border)', 
                        fontWeight: '800', 
                        cursor: 'pointer' 
                    }}
                >
                    {showForm ? '✕ Cancel' : '+ Create New'}
                </button>
            </div>

            {/* Quick Blueprints */}
            {!showForm && (
                <div className="blueprint-bar" style={{ display: 'flex', gap: '15px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', alignSelf: 'center' }}>{language === 'hi' ? 'त्वरित पोस्ट:' : 'Quick Post:'}</span>
                    {blueprints.map((bp, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleQuickPost(bp)}
                            style={{ 
                                padding: '8px 15px', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid var(--glass-border)', 
                                color: 'var(--text-primary)', 
                                borderRadius: '10px', 
                                fontSize: '0.8rem', 
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            ⚡ {bp.title}
                        </button>
                    ))}
                </div>
            )}

            {showForm && (
                <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label>Title</label>
                            <input required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} className="premium-input" />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input required value={newAssignment.subject} onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})} className="premium-input" />
                        </div>
                        <div className="form-group">
                            <label>Target Class</label>
                            <select value={newAssignment.class} onChange={e => setNewAssignment({...newAssignment, class: e.target.value})} className="premium-input">
                                <option>Class 10A</option>
                                <option>Class 9B</option>
                                <option>Class 8C</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="premium-input" />
                        </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label>Instructions / Voice Message Link</label>
                        <textarea rows="3" value={newAssignment.instructions} onChange={e => setNewAssignment({...newAssignment, instructions: e.target.value})} className="premium-input" style={{ width: '100%', resize: 'none' }} />
                    </div>
                    <button type="submit" className="broadcast-btn">📤 Broadcast to Students</button>
                </form>
            )}

            <div className="assignment-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                {assignments.map(asm => {
                    const submissionRate = ((asm.submissions || 0) / (asm.totalStudents || 30)) * 100;
                    return (
                        <div key={asm.id} className="glass-panel" style={{ padding: '25px', borderRadius: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span className="subject-tag-blue">{asm.subject}</span>
                                <span className="class-badge">{asm.class}</span>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{asm.title}</h4>
                            
                            {/* Analytics Ring simulation */}
                            <div className="submission-tracker" style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    borderRadius: '50%', 
                                    background: `conic-gradient(#10b981 ${submissionRate}%, rgba(255,255,255,0.05) 0)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: '800'
                                }}>
                                    {Math.round(submissionRate)}%
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{asm.submissions || 0}/{asm.totalStudents || 30} Submissions</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Due in 2 days</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className="action-btn-outline" style={{ flex: 1 }}>Grade Work</button>
                                <button onClick={() => handleDelete(asm.id)} style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>🗑️</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .premium-input {
                    padding: 12px;
                    border-radius: 12px;
                    background: rgba(0,0,0,0.15);
                    border: 1px solid var(--glass-border);
                    color: #fff;
                    font-size: 0.9rem;
                    width: 100%;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                }
                .broadcast-btn {
                    margin-top: 25px;
                    width: 100%;
                    padding: 15px;
                    background: var(--accent-blue);
                    color: #fff;
                    border: none;
                    border-radius: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
                }
                .subject-tag-blue {
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 4px 10px;
                    background: rgba(59, 130, 246, 0.1);
                    color: #3b82f6;
                    border-radius: 8px;
                    text-transform: uppercase;
                }
                .class-badge {
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 4px 10px;
                    background: rgba(255,255,255,0.05);
                    color: var(--text-secondary);
                    border-radius: 8px;
                }
                .action-btn-outline {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid var(--glass-border);
                    color: #fff;
                    font-weight: 700;
                    padding: 10px;
                    border-radius: 10px;
                    cursor: pointer;
                }
            `}} />
        </div>
    );
};

export default Homework;
