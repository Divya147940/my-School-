import React, { useState, useEffect, useRef } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const FaceAttendance = ({ mode }) => {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, matching, success, failed
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
    const [recentScans, setRecentScans] = useState([]);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const TEST_ID_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"; // Schematic hybrid avatar
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Removed livenessActions per user request to focus strictly on face detection


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
        setIsVirtualStream(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.warn("Camera busy/denied. Using Biometric Simulation Mode.");
            setIsVirtualStream(true);
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
        setScanStatus('matching');
        setProgress(0);
        await startCamera();
        
        let matchInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(matchInterval);
                    performVerification();
                    return 100;
                }
                return prev + 10;
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

    const performVerification = async (isFallback = false) => {
        if (isFallback || (videoRef.current && canvasRef.current)) {
            let photo = capturedImage;
            if (!isFallback) {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                photo = canvas.toDataURL('image/jpeg');
                setCapturedImage(photo);
            }
            
            // Use general matcher with Strict AI Euclidean Distances (0.40)
            const result = await mockApi.matchFaceAcrossAllStudents(photo);
            
            if (result.success) {
                setVerifiedStudent(result.student);
                setMatchConfidence(result.confidence);
                
                if (result.confidence >= 0.7) {
                    const markResult = mockApi.markAttendance(result.student.name, 'Present');
                    
                    // Add to Recent Scans (Proactive Logic)
                    const scanEntry = {
                        id: Date.now(),
                        name: result.student.name,
                        image: photo,
                        registryImage: result.student.faceImage || photo,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'SUCCESS'
                    };
                    setRecentScans(prev => [scanEntry, ...prev].slice(0, 5));

                    if (markResult.status === 'offline_queued') {
                        setScanStatus('success');
                    } else {
                        setScanStatus('success');
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

    // Removed restrictive registration check to allow Public Kiosk scanning

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

                    {isVirtualStream ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <img src={TEST_ID_PHOTO} alt="Virtual" style={{ width: '150px', height: '150px', borderRadius: '50%', filter: 'brightness(0.5) sepia(0.5) contrast(1.2)', opacity: 0.8 }} />
                        </div>
                    ) : (
                        <div style={{ width: '180px', height: '220px', border: '2px dashed rgba(255,255,255,0.3)', borderRadius: '50% 50% 40% 40%', zIndex: 1 }}></div>
                    )}

                    {/* Clean View: HUD Removed per user request */}

                    {(scanStatus === 'matching' || isEnrolling) && (
                        <>
                            <div className="scan-line" style={{ 
                                position: 'absolute', 
                                top: `${progress}%`, 
                                left: 0, 
                                width: '100%', 
                                height: '4px', 
                                background: 'var(--accent-blue)', 
                                boxShadow: `0 0 15px var(--accent-blue)`,
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
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <p style={{ color: '#10b981', fontWeight: '900', fontSize: '1.4rem', marginBottom: '15px' }}>🎉 {t('matchFound')}</p>
                            
                            {/* Side by Side Proof */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '5px' }}>SCANNED</div>
                                    <img src={capturedImage} style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px solid #3b82f6' }} alt="Scanned" />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', color: '#10b981', fontSize: '1.5rem' }}>↔️</div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.6rem', color: '#64748b', marginBottom: '5px' }}>DATABASE</div>
                                    <img src={verifiedStudent?.faceImage || capturedImage} style={{ width: '80px', height: '80px', borderRadius: '12px', border: '2px solid #10b981' }} alt="Database" />
                                </div>
                            </div>

                            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '15px', border: '1px solid #10b981', marginBottom: '20px' }}>
                                <div style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem' }}>{verifiedStudent?.name}</div>
                                <div style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 'bold' }}>ATTENDANCE MARKED • {(matchConfidence * 100).toFixed(0)}% BIOMETRIC CONFIDANCE</div>
                            </div>

                            <button onClick={() => { setScanStatus('idle'); setCapturedImage(null); }} style={{ padding: '15px 40px', borderRadius: '30px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>NEXT SCAN</button>
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
            
            {/* Proactive Logic: Recent Activity Feed */}
            {recentScans.length > 0 && (
                <div className="glass-panel" style={{ marginTop: '30px', padding: '25px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🕒 Recent Activity Logic
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentScans.map(scan => (
                            <div key={scan.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)' }}>
                                <img src={scan.image} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} alt="Signature" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{scan.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>✅ Identified & Marked</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{scan.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <button onClick={() => { stopCamera(); setCapturedImage(null); setScanStatus('idle'); }} style={{ display: 'block', width: '100%', marginTop: '20px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textAlign: 'center' }}>Cancel Scanning</button>
        </div>
    );
};

export default FaceAttendance;
