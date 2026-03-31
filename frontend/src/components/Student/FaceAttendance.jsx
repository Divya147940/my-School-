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
    const [landmarks, setLandmarks] = useState(null);
    const [scanMessage, setScanMessage] = useState('AI SEARCHING...');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchList, setSearchList] = useState([]);
    const [recentScans, setRecentScans] = useState([]);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const [funFilter, setFunFilter] = useState(null); // 'lion', 'crown', 'glasses'
    const TEST_ID_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"; 
    
    const [cameraIndex, setCameraIndex] = useState(0);
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
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            
            let targetDeviceId = null;
            if (videoDevices.length > 0) {
                if (cameraIndex === 0) {
                    const frontCam = videoDevices.find(d => 
                        d.label.toLowerCase().includes('front') || 
                        d.label.toLowerCase().includes('selfie') ||
                        d.label.toLowerCase().includes('user')
                    );
                    if (frontCam) targetDeviceId = frontCam.deviceId;
                } else {
                    targetDeviceId = videoDevices[cameraIndex % videoDevices.length].deviceId;
                }
            }

            let stream;
            if (targetDeviceId) {
                stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: targetDeviceId } } });
            } else {
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            }

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
        setMatchConfidence(0);
        setLandmarks(null);
        await startCamera();
        
        let matchInterval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                const ctx = canvas.getContext('2d');
                
                // ADAPTIVE DIGITAL BOOST
                ctx.filter = 'brightness(1.6) contrast(1.3)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');

                try {
                    const detection = await mockApi.getFaceDescriptorFromBase64(dataUrl);
                    if (detection) {
                        setLandmarks(detection.landmarks);
                        setScanMessage(progress < 50 ? "HOLD STILL..." : "LOCKING FEATURES...");
                        setProgress(prev => {
                            if (prev >= 100) {
                                clearInterval(matchInterval);
                                performVerification(dataUrl);
                                return 100;
                            }
                            return prev + 5;
                        });
                    } else {
                        setLandmarks(null);
                        setScanMessage("AI SEARCHING...");
                        setProgress(prev => Math.max(0, prev - 2));
                    }
                } catch (err) {
                    console.warn("Scan loop error:", err);
                }
            }
        }, 150);
    };

    const performVerification = async (scannedImage = null) => {
        let photo = scannedImage || capturedImage;
        if (!photo && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            photo = canvas.toDataURL('image/jpeg');
        }
        setCapturedImage(photo);
            
            // Use general matcher with Strict AI Euclidean Distances (0.40)
            const result = await mockApi.matchFaceAcrossAllStudents(photo);
            
            if (result.success) {
                setVerifiedStudent(result.student);
                setMatchConfidence(result.confidence);
                
                if (result.confidence >= 0.5) {
                    const markResult = mockApi.markAttendance(result.student.name, 'Present');
                    window.dispatchEvent(new CustomEvent('attendanceUpdate', { detail: { studentName: result.student.name, status: 'Present' } }));
                    
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
        <div className="face-attendance-container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <div className="glass-panel" style={{ 
                background: '#0f172a', 
                padding: '60px 40px', 
                borderRadius: '40px', 
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <div style={{ position: 'absolute', top: '30px', right: '40px', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>
                    Scanning Mode
                </div>
                
                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '50px', letterSpacing: '-1px' }}>
                    AI Face Scanner
                </h2>

                <div className="scanner-viewport" style={{ 
                    width: '320px', 
                    height: '320px', 
                    margin: '0 auto 60px', 
                    borderRadius: '50%', 
                    border: '2px dashed rgba(255,255,255,0.15)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: isCameraActive ? 0 : 0.8, transition: 'opacity 0.5s' }}></div>
                    
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

                    {/* Scanning Animation */}
                    {(scanStatus === 'matching' || isEnrolling) && (
                        <div className="scan-line" style={{ 
                            position: 'absolute', 
                            top: `${progress}%`, 
                            left: 0, 
                            width: '100%', 
                            height: '2px', 
                            background: '#3b82f6', 
                            boxShadow: '0 0 20px #3b82f6',
                            zIndex: 2,
                            transition: 'top 0.1s linear'
                        }}></div>
                    )}

                    {/* AI Landmark Dots */}
                    {isCameraActive && landmarks && (
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                            <div style={{ position: 'absolute', left: `${(landmarks.getLeftEye()[0].x / 640) * 320}px`, top: `${(landmarks.getLeftEye()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div>
                            <div style={{ position: 'absolute', left: `${(landmarks.getRightEye()[0].x / 640) * 320}px`, top: `${(landmarks.getRightEye()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div>
                            <div style={{ position: 'absolute', left: `${(landmarks.getNose()[0].x / 640) * 320}px`, top: `${(landmarks.getNose()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div>
                        </div>
                    )}

                    {scanStatus === 'success' && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, animation: 'zoomIn 0.3s' }}>
                            <div style={{ width: '120px', height: '120px', background: '#00c853', borderRadius: '12px', border: '5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(0,200,83,0.5)' }}>
                                <span style={{ fontSize: '6rem', color: '#fff' }}>✓</span>
                            </div>
                        </div>
                    )}

                    {/* Dashboard Guide */}
                    {!isCameraActive && !capturedImage && (
                        <div style={{ width: '100%', height: '100%', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '50%', position: 'absolute', transform: 'scale(0.8)' }}></div>
                    )}
                </div>

                <div className="scan-controls" style={{ minHeight: '120px' }}>
                    {scanStatus === 'matching' || isEnrolling ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.2s' }}></div>
                            </div>
                            <div style={{ color: '#3b82f6', fontWeight: '800', fontSize: '1.2rem', animation: 'pulse 1.5s infinite' }}>
                                {scanMessage} {progress}%
                            </div>
                        </div>
                    ) : scanStatus === 'success' ? (
                        <div style={{ animation: 'fadeIn 0.5s ease' }}>
                            <h3 style={{ color: '#10b981', fontWeight: '900', fontSize: '2.2rem', marginBottom: '10px', textTransform: 'uppercase' }}>Match Found!</h3>
                            <div style={{ color: '#fff', opacity: 0.8, fontSize: '1.2rem', marginBottom: '30px', fontWeight: '500' }}>{verifiedStudent?.name} - Marked Present</div>
                            <button onClick={() => { setScanStatus('idle'); setCapturedImage(null); stopCamera(); }} style={{ padding: '15px 80px', borderRadius: '16px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>OK</button>
                        </div>
                    ) : scanStatus === 'failed' ? (
                        <div>
                            <p style={{ color: '#ef4444', fontWeight: '800', fontSize: '1.2rem', marginBottom: '15px' }}>Face Not Recognized</p>
                            <button onClick={() => { setScanStatus('idle'); setCapturedImage(null); }} style={{ padding: '12px 25px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Try Again</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                            <div style={{ position: 'relative', width: '100%' }}>
                                <button onClick={startScan} style={{ 
                                    width: '100%',
                                    padding: '22px', 
                                    paddingRight: '60px',
                                    borderRadius: '20px', 
                                    background: '#3b82f6', 
                                    color: '#fff', 
                                    border: 'none', 
                                    fontWeight: '900', 
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '15px',
                                    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                                }}>
                                    <span style={{ fontSize: '1.5rem' }}>📸</span> START SCAN
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCameraIndex(prev => prev + 1);
                                        startCamera();
                                    }} 
                                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: '#fff' }}
                                    title="Switch Camera"
                                >
                                    🔄
                                </button>
                            </div>
                            
                            <button 
                                onClick={() => setIsManualMode(true)} 
                                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem' }}
                            >
                                Mark Attendance Manually?
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {isCameraActive && (
                <button 
                    onClick={() => { stopCamera(); setScanStatus('idle'); }} 
                    style={{ display: 'block', width: '100%', marginTop: '30px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', textAlign: 'center' }}
                >
                    Cancel and Go Back
                </button>
            )}

            <style>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
                @keyframes zoomIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default FaceAttendance;
