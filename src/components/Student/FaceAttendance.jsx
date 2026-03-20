import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const FaceAttendance = () => {
    const { t, language } = useLanguage();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success
    const [progress, setProgress] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [inputId, setInputId] = useState('');
    const [inputDob, setInputDob] = useState('');
    const [verifiedStudent, setVerifiedStudent] = useState(null);

    useEffect(() => {
        // Enrollment state is now student-specific, so we check after verification
    }, []);

    const handleVerify = (e) => {
        e.preventDefault();
        const data = mockApi.loadData();
        const student = data.studentRegistry.find(s => s.id === inputId && s.dob === inputDob);
        
        if (student) {
            setVerifiedStudent(student);
            setIsEnrolled(student.isFaceEnrolled);
            setIsVerified(true);
        } else {
            alert("Invalid ID or Date of Birth. Please try again.");
        }
    };

    const startEnrollment = () => {
        setIsEnrolling(true);
        setProgress(0);
        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    mockApi.enrollFace(verifiedStudent.id);
                    setIsEnrolled(true);
                    setIsEnrolling(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const startScan = () => {
        setScanStatus('scanning');
        setProgress(0);
        
        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setScanStatus('success');
                    mockApi.markAttendance(verifiedStudent.name, 'Present');
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    if (!isVerified) {
        return (
            <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🆔</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>Student Verification</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Enter your Unique ID and DOB to start scan</p>
                    
                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Unique Student ID</label>
                            <input 
                                type="text" 
                                value={inputId}
                                onChange={(e) => setInputId(e.target.value)}
                                placeholder="e.g. RAM2010"
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.9rem' }}>Date of Birth</label>
                            <input 
                                type="date" 
                                value={inputDob}
                                onChange={(e) => setInputDob(e.target.value)}
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                            VERIFY & CONTINUE ➡️
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (!isEnrolled && !isEnrolling) {
        return (
            <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '60px 40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>{t('enrollmentReq')}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: '1.6' }}>Hello, <b>{verifiedStudent.name}</b>!</p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>{t('enrollmentDesc')}</p>
                    <button onClick={startEnrollment} style={{ 
                        padding: '18px 40px', 
                        borderRadius: '16px', 
                        background: 'var(--accent-blue)', 
                        color: '#fff', 
                        border: 'none', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        fontSize: '1.1rem'
                    }}>
                        {t('startEnroll')}
                    </button>
                    <button onClick={() => setIsVerified(false)} style={{ display: 'block', width: '100%', marginTop: '15px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Back to Verification</button>
                </div>
            </div>
        );
    }

    return (
        <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ 
                background: 'var(--glass-bg)', 
                padding: '40px', 
                borderRadius: '32px', 
                textAlign: 'center',
                border: '1px solid var(--glass-border)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Student: {verifiedStudent.name}
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>
                    {isEnrolling ? t('enrollFace') : t('faceScan')}
                </h2>

                <div className="scanner-viewport" style={{ 
                    width: '280px', 
                    height: '280px', 
                    margin: '0 auto 30px', 
                    borderRadius: '50%', 
                    border: '4px solid var(--glass-border)',
                    position: 'relative',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #1e293b, #0f172a)', opacity: 0.8 }}></div>
                    
                    {isEnrolling && (
                        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                            {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} style={{ 
                                    position: 'absolute',
                                    width: '8px', height: '8px',
                                    background: 'var(--accent-blue)',
                                    borderRadius: '50%',
                                    top: `${40 + Math.sin(i) * 30}%`,
                                    left: `${50 + Math.cos(i) * 30}%`,
                                    boxShadow: '0 0 10px var(--accent-blue)',
                                    opacity: progress > i * 12 ? 1 : 0.2,
                                    transition: 'all 0.3s'
                                }}></div>
                            ))}
                        </div>
                    )}

                    <div style={{ width: '180px', height: '220px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '50% 50% 40% 40%', zIndex: 1 }}></div>

                    {(scanStatus === 'scanning' || isEnrolling) && (
                        <>
                            <div className="scan-line" style={{ 
                                position: 'absolute', 
                                top: `${progress}%`, 
                                left: 0, 
                                width: '100%', 
                                height: '4px', 
                                background: 'var(--accent-blue)', 
                                boxShadow: '0 0 15px var(--accent-blue)',
                                zIndex: 2
                            }}></div>
                        </>
                    )}

                    {scanStatus === 'success' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                            <span style={{ fontSize: '5rem' }}>✅</span>
                        </div>
                    )}
                </div>

                <div className="scan-controls">
                    {isEnrolling && (
                        <div style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '1.2rem' }}>
                            {t('mappingLandmarks')} {progress}%
                        </div>
                    )}

                    {scanStatus === 'idle' && !isEnrolling && (
                        <button onClick={startScan} style={{ 
                            padding: '18px 40px', 
                            borderRadius: '16px', 
                            background: 'var(--accent-blue)', 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: '800', 
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}>
                            {t('startScan')}
                        </button>
                    )}

                    {scanStatus === 'scanning' && (
                        <div style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '1.2rem' }}>
                            {t('scanning')} {progress}%
                        </div>
                    )}

                    {scanStatus === 'success' && (
                        <div>
                            <p style={{ color: '#10b981', fontWeight: '800', fontSize: '1.2rem', marginBottom: '20px' }}>{t('matchFound')}</p>
                            <button onClick={() => { setScanStatus('idle'); setIsVerified(false); }} style={{ padding: '12px 25px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Finish</button>
                        </div>
                    )}
                </div>
            </div>
            <button onClick={() => setIsVerified(false)} style={{ display: 'block', width: '100%', marginTop: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>Cancel Scanning</button>
        </div>
    );
};

export default FaceAttendance;
