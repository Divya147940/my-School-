import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const LessonDiary = ({ mode = 'faculty', teacherId, teacherName }) => {
    const { t, language } = useLanguage();
    const [logs, setLogs] = useState([]);
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [summary, setSummary] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const data = mockApi.loadData();
        setLogs(data.lessonLogs || []);
    }, []);

    const handleLog = (e) => {
        e.preventDefault();
        if (!subject || !topic || !summary) return;

        setIsSaving(true);
        setTimeout(() => {
            const newLog = mockApi.logLesson(teacherId, teacherName, subject, topic, summary);
            setLogs(prev => [newLog, ...prev]);
            setSubject('');
            setTopic('');
            setSummary('');
            setIsSaving(false);
        }, 1200);
    };

    const filteredLogs = logs.filter(log => {
        if (mode === 'faculty') return log.teacherId === teacherId;
        return (
            log.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.topic.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="lesson-diary-system" style={{ display: 'grid', gridTemplateColumns: mode === 'faculty' ? '1fr 1fr' : '1fr', gap: '30px', padding: '20px' }}>
            {mode === 'faculty' && (
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('logActivity')} 📑</h2>
                    <form onSubmit={handleLog}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Subject</label>
                            <input 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Mathematics"
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('topic')}</label>
                            <input 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g. Introduction to Calculus"
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('summary')}</label>
                            <textarea 
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Today we covered..."
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', height: '120px', resize: 'none' }}
                            />
                        </div>
                        <button type="submit" disabled={isSaving} style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                            {isSaving ? 'SAVING LOG...' : 'SAVE TO DIARY 📒'}
                        </button>
                    </form>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{mode === 'admin' ? t('activityTracker') : t('lessonDiary')}</h3>
                    {mode === 'admin' && (
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('searchStudent') || 'Search log...'}
                            style={{ padding: '10px 20px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    )}
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredLogs.length > 0 ? filteredLogs.slice().reverse().map(log => (
                        <div key={log.id} style={{ 
                            padding: '25px', 
                            borderRadius: '24px', 
                            background: 'rgba(255,255,255,0.03)', 
                            border: '1px solid rgba(255,255,255,0.05)',
                            transition: 'transform 0.3s'
                        }} className="log-item-hover">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: '800', textTransform: 'uppercase' }}>{log.subject}</span>
                                    <h4 style={{ margin: '5px 0', fontSize: '1.2rem', fontWeight: '800' }}>{log.topic}</h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>{log.date}</div>
                                    {mode === 'admin' && <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>By: {log.teacherName}</div>}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                                {log.summary}
                            </p>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                            No entries found. Start logging your daily work!
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .log-item-hover:hover { transform: translateX(10px); border-color: var(--accent-blue); }
            `}</style>
        </div>
    );
};

export default LessonDiary;
