import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const FaceAttendance = () => {
    const { t, language } = useLanguage();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success
    const [progress, setProgress] = useState(0);

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
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('faceScan')}</h2>

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
                    {/* Simulated Camera Feed */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: 'linear-gradient(45deg, #1e293b, #0f172a)',
                        opacity: 0.8
                    }}></div>
                    
                    {/* Face Outline Placeholder */}
                    <div style={{ 
                        width: '180px', 
                        height: '220px', 
                        border: '2px dashed rgba(255,255,255,0.3)', 
                        borderRadius: '50% 50% 40% 40%',
                        zIndex: 1
                    }}></div>

                    {scanStatus === 'scanning' && (
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
                            <div className="radar-ping" style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                border: '2px solid var(--accent-blue)', 
                                borderRadius: '50%',
                                animation: 'ping 1.5s infinite',
                                zIndex: 2
                            }}></div>
                        </>
                    )}

                    {scanStatus === 'success' && (
                        <div style={{ 
                            position: 'absolute', 
                            inset: 0, 
                            background: 'rgba(16, 185, 129, 0.2)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            zIndex: 3,
                            animation: 'fadeIn 0.5s'
                        }}>
                            <span style={{ fontSize: '5rem' }}>✅</span>
                        </div>
                    )}
                </div>

                <div className="scan-controls">
                    {scanStatus === 'idle' && (
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
                            <button onClick={() => setScanStatus('idle')} style={{ 
                                padding: '12px 25px', 
                                borderRadius: '12px', 
                                background: 'rgba(255,255,255,0.05)', 
                                color: '#fff', 
                                border: '1px solid var(--glass-border)',
                                cursor: 'pointer'
                            }}>Reset</button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes ping {
                    0% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default FaceAttendance;
