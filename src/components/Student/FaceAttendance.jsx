import React, { useState, useEffect, useRef } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const FaceAttendance = ({ mode }) => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, liveness, matching, success, failed
    const [livenessAction, setLivenessAction] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [verifiedStudent, setVerifiedStudent] = useState(null);
    const [matchConfidence, setMatchConfidence] = useState(0);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isManualMode, setIsManualMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchList, setSearchList] = useState([]);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const livenessActions = [
        { id: 'left', label: 'Turn Head Left', hi: 'अपना सिर बाईं ओर घुमाएं' },
        { id: 'right', label: 'Turn Head Right', hi: 'अपना सिर दाईं ओर घुमाएं' },
        { id: 'blink', label: 'Blink Your Eyes', hi: 'अपनी आँखें झपकाएं' }
    ];

    useEffect(() => {
        const isFaculty = user && (user.role === 'Faculty' || user.role === 'Admin' || mode === 'faculty');
        
        if (isFaculty) {
            setIsVerified(true);
            setIsEnrolled(true);
        } else if (user && (user.role === 'Student' || user.role === 'student')) {
            const data = mockApi.getDB();
            const student = data.studentRegistry.find(s => 
                s.name === user.name || s.id === user.id
            );
            
            if (student) {
                setVerifiedStudent(student);
                setIsEnrolled(student.isFaceEnrolled);
                setIsVerified(true);
            }
        }
        
        return () => {
            stopCamera();
        };
    }, [user, mode]);

    const startCamera = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const startScan = async () => {
        // Randomize liveness action
        const action = livenessActions[Math.floor(Math.random() * livenessActions.length)];
        setLivenessAction(action);
        setScanStatus('liveness');
        setProgress(0);
        await startCamera();
        
        // Step 1: Liveness Progress
        let livenessInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(livenessInterval);
                    // Move to matching
                    setScanStatus('matching');
                    setProgress(0);
                    startFaceMatching();
                    return 100;
                }
                return prev + 4;
            });
        }, 50);
    };

    const startFaceMatching = () => {
        let matchInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(matchInterval);
                    performVerification();
                    return 100;
                }
                return prev + 10;
            });
        }, 40);
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

    const performVerification = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const photo = canvas.toDataURL('image/jpeg');
            setCapturedImage(photo);
            
            // Use general matcher
            const result = mockApi.matchFaceAcrossAllStudents(photo);
            
            if (result.success) {
                setVerifiedStudent(result.student);
                setMatchConfidence(result.confidence);
                
                if (result.confidence >= 0.7) {
                    const markResult = mockApi.markAttendance(result.student.name, 'Present');
                    
                    if (markResult.status === 'offline_queued') {
                        setScanStatus('success');
                        setOfflineCount(prev => prev + 1);
                        // In offline mode we don't log to QR system as that's "cloud" in this demo
                    } else {
                        setScanStatus('success');
                        // Also log to QR system for consistency
                        mockApi.logQRAttendance({
                            name: result.student.name,
                            role: 'student',
                            type: 'morning',
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        });
                    }
                } else {
                    setScanStatus('failed');
                }
            } else {
                setScanStatus('failed');
            }
            stopCamera();
        }
    };

    const handleManualMark = (student) => {
        mockApi.markAttendance(student.name, 'Present');
        setVerifiedStudent(student);
        setScanStatus('success');
        setIsManualMode(false);
    };

    const searchStudents = (term) => {
        setSearchTerm(term);
        if (term.length > 1) {
            const db = mockApi.getDB();
            const filtered = db.studentRegistry.filter(s => 
                s.name.toLowerCase().includes(term.toLowerCase()) || 
                s.id.toLowerCase().includes(term.toLowerCase())
            );
            setSearchList(filtered);
        } else {
            setSearchList([]);
        }
    };

    if (isManualMode) {
        return (
            <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '40px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Manual Override</h2>
                        <button onClick={() => setIsManualMode(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search Student Name or ID..."
                        value={searchTerm}
                        onChange={(e) => searchStudents(e.target.value)}
                        style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '20px' }}
                    />
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {searchList.map(student => (
                            <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: '700' }}>{student.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.id} • Class {student.class}</div>
                                </div>
                                <button 
                                    onClick={() => handleManualMark(student)}
                                    style={{ padding: '8px 15px', borderRadius: '8px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Mark Present
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '50px 40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️</div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>Face Not Registered</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.6' }}>
                        We couldn't find a face registration for <b>{user?.name || 'your account'}</b>. 
                        Please contact the school administrator to enroll your face/eye data.
                    </p>
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
                    {verifiedStudent ? `Identified: ${verifiedStudent.name}` : 'Scanning Mode'}
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>
                    {isEnrolling ? t('enrollFace') : 'AI Face Scanner'}
                </h2>

                <div className="scanner-viewport" style={{ 
                    width: '280px', 
                    height: '280px', 
                    margin: '0 auto 30px', 
                    borderRadius: '50%', 
                    border: '4px solid var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #1e293b, #0f172a)', opacity: isCameraActive ? 0 : 0.8, transition: 'opacity 0.5s' }}></div>
                    
                    {isCameraActive && (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                zIndex: 0
                            }} 
                        />
                    )}

                    {capturedImage && (
                        <img 
                            src={capturedImage} 
                            alt="Captured" 
                            style={{ 
                                position: 'absolute', 
                                inset: 0, 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                zIndex: 1,
                                opacity: scanStatus === 'success' ? 0.6 : 1
                            }} 
                        />
                    )}
                    
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

                    {(scanStatus === 'liveness' || scanStatus === 'matching' || isEnrolling) && (
                        <>
                            <div className="scan-line" style={{ 
                                position: 'absolute', 
                                top: `${progress}%`, 
                                left: 0, 
                                width: '100%', 
                                height: '4px', 
                                background: scanStatus === 'liveness' ? '#f59e0b' : 'var(--accent-blue)', 
                                boxShadow: `0 0 15px ${scanStatus === 'liveness' ? '#f59e0b' : 'var(--accent-blue)'}`,
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

                    {scanStatus === 'liveness' && (
                        <div style={{ animation: 'pulse 1.5s infinite' }}>
                            <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                                🛡️ Liveness Check
                            </div>
                            <div style={{ color: '#fff', fontWeight: '700', fontSize: '1.2rem', background: 'rgba(245, 158, 11, 0.2)', padding: '10px 20px', borderRadius: '12px', border: '1px solid #f59e0b' }}>
                                {language === 'hi' ? livenessAction.hi : livenessAction.label}
                            </div>
                            <div style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>Detecting movement... {progress}%</div>
                        </div>
                    )}

                    {scanStatus === 'matching' && (
                        <div style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '1.2rem' }}>
                            🔍 Analyzing Features... {progress}%
                        </div>
                    )}

                    {scanStatus === 'idle' && !isEnrolling && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                                📸 {t('startScan')}
                            </button>
                            {(user?.role === 'Faculty' || user?.role === 'Admin') && (
                                <button onClick={() => setIsManualMode(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>
                                    Mark Attendance Manually?
                                </button>
                            )}
                        </div>
                    )}

                    {/* Liveness and Matching handles are above */}

                    {scanStatus === 'success' && (
                        <div>
                            <p style={{ color: '#10b981', fontWeight: '800', fontSize: '1.2rem', marginBottom: '5px' }}>{t('matchFound')}</p>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{verifiedStudent?.name} • Match: {(matchConfidence * 100).toFixed(1)}%</p>
                            <button onClick={() => { setScanStatus('idle'); setCapturedImage(null); }} style={{ padding: '12px 25px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Next Student</button>
                        </div>
                    )}

                    {scanStatus === 'failed' && (
                        <div>
                            <p style={{ color: '#ef4444', fontWeight: '800', fontSize: '1.2rem', marginBottom: '5px' }}>Low Confidence / No Match</p>
                            {matchConfidence > 0 && <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Confidence: {(matchConfidence * 100).toFixed(1)}% (Min 70% req.)</p>}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button onClick={() => { setScanStatus('idle'); setCapturedImage(null); }} style={{ padding: '12px 25px', borderRadius: '12px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer' }}>Try Again</button>
                                {(user?.role === 'Faculty' || user?.role === 'Admin') && (
                                    <button onClick={() => setIsManualMode(true)} style={{ padding: '12px 25px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>Override</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <button onClick={() => { stopCamera(); setCapturedImage(null); setScanStatus('idle'); }} style={{ display: 'block', width: '100%', marginTop: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>Cancel Scanning</button>
        </div>
    );
};

export default FaceAttendance;
