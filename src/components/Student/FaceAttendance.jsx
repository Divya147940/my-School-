import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const FaceAttendance = () => {
    const { t, language } = useLanguage();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success
    const [progress, setProgress] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        const data = mockApi.loadData();
        const student = data.studentRegistry.find(s => s.id === 'STU2026-001');
        if (student) {
            setIsEnrolled(student.isFaceEnrolled);
        }
    }, []);

    const startEnrollment = () => {
        setIsEnrolling(true);
        setProgress(0);
        let interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    mockApi.enrollFace('STU2026-001');
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
                    mockApi.markAttendance('Aman Gupta', 'Present');
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
    };

    if (!isEnrolled && !isEnrolling) {
        return (
            <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '60px 40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>{t('enrollmentReq')}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>{t('enrollmentDesc')}</p>
                    <button onClick={startEnrollment} style={{ 
                        padding: '18px 40px', 
                        borderRadius: '16px', 
                        background: 'var(--accent-blue)', 
                        color: '#fff', 
                        border: 'none', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                    }}>
                        {t('startEnroll')}
                    </button>
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
                    
                    {/* Landmark Mapping Circles for Enrollment */}
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
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, animation: 'fadeIn 0.5s' }}>
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
                            fontSize: '1.1rem',
                            boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
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
                            <button onClick={() => setScanStatus('idle')} style={{ padding: '12px 25px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Reset</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
        </div>
    );
};

export default FaceAttendance;
