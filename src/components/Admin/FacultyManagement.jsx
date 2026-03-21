import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const FacultyManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [enrollmentSource, setEnrollmentSource] = useState(null); // 'CAMERA', 'FILE', 'DEMO'
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hardwareLocked, setHardwareLocked] = useState(false);
    const [recentFaculty, setRecentFaculty] = useState(null);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    
    const TEST_ID_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"; // Schematic Male/Female hybrid avatar

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCapturedImage(reader.result);
                setEnrollmentSource('FILE');
                addToast("Photo uploaded successfully!", "success");
            };
            reader.readAsDataURL(file);
        }
    };
    const [facultyList, setFacultyList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    useEffect(() => {
        setFacultyList(mockApi.getDB().facultyRegistry || []);

        // Cleanup camera on component unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);


    const startCamera = async () => {
        setIsCameraOpen(true);
        setHardwareLocked(false);
        // Step 1: Force release any existing app streams
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }

        setTimeout(async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                addToast("Your Browser does not support Camera Access.", "error");
                setIsCameraOpen(false);
                return;
            }

            const tiers = [
                { video: { facingMode: 'user' } },
                { video: true },
                { video: { width: { ideal: 640 } } }
            ];

            let stream = null;
            let lastErr = null;

            for (const constraints of tiers) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (stream) break;
                } catch (e) {
                    lastErr = e;
                    console.warn("Retrying camera...", e.name);
                }
            }

            if (stream && videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        // Heartbeat check
                        setTimeout(() => {
                            if (videoRef.current && videoRef.current.videoWidth === 0) {
                                setHardwareLocked(true);
                            }
                        }, 1500);
                    }).catch(e => console.error("Playback blocked:", e));
                };
            } else {
                // Fallback: Virtual Stream with explicit warning
                setIsVirtualStream(true);
                setIsCameraOpen(true);
                setHardwareLocked(true); 
                setEnrollmentSource('BIOMETRIC');
                addToast("Physical Camera Locked - Using Biometric Simulation.", "warning");
            }
        }, 300); // Increased delay for stability
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (isVirtualStream) {
            setCapturedImage(TEST_ID_PHOTO);
            setIsVirtualStream(false);
            setIsCameraOpen(false);
            stopCamera();
            return;
        }
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            setCapturedImage(canvas.toDataURL('image/jpeg'));
            setEnrollmentSource('CAMERA');
            stopCamera();
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !subject || !dob || !parentName) {
            addToast("All fields are required", "error");
            return;
        }
        if (!capturedImage) {
            addToast("Biometric Photo is required. Use the Camera or 'Upload Photo' fallback.", "warning");
            return;
        }
        try {
            setIsAnalyzing(true);
            setAnalysisProgress(0);
            
            // AI Face Analysis Sequence (Purely Face Focused)
            const steps = [
                { p: 20, m: "SCANNING FACE..." },
                { p: 50, m: "ANALYZING FEATURES..." },
                { p: 80, m: "GENERATING VECTOR..." },
                { p: 100, m: "SAVING FACE..." }
            ];

            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    setAnalysisProgress(steps[currentStep].p);
                    currentStep++;
                } else {
                    clearInterval(interval);
                }
            }, 300);

            const faculty = await mockApi.onboardFaculty(name, subject, dob, parentName, capturedImage);
            
            clearInterval(interval);
            setAnalysisProgress(100);
            
            setTimeout(() => {
                setRecentFaculty(faculty);
                setFacultyList(prev => [...prev, faculty]);
                setName('');
                setSubject('');
                setParentName('');
                setDob('');
                setCapturedImage(null);
                setEnrollmentSource(null);
                setIsAnalyzing(false);
                addToast("Faculty registered successfully with secure Biometrics!", "success");
            }, 500);

        } catch (err) {
            setIsAnalyzing(false);
            addToast(err.message, "error");
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this faculty record?")) {
            mockApi.deleteFaculty(id);
            setFacultyList(prev => prev.filter(f => f.id !== id));
            addToast("Record removed", "info");
        }
    };

    const filteredFaculty = facultyList.filter(f => 
        (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (f.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.id || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="faculty-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', padding: '20px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                {!recentFaculty ? (
                    <>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>Register New Teacher</h2>
                        <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dr. Rajesh Kumar"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Subject</label>
                            <input 
                                type="text" 
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Physics"
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Date of Birth</label>
                            <input 
                                type="date" 
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Father's/Spouse Name</label>
                        <input 
                            type="text" 
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="e.g. Shri Mahendra Kumar"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px dashed #3b82f650' }}>
                        <label style={{ display: 'block', color: '#3b82f6', marginBottom: '15px', fontWeight: '800', fontSize: '0.85rem' }}>👨‍🏫 BIOMETRIC FACE ENROLLMENT</label>
                        
                        {!isCameraOpen && !capturedImage && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button type="button" onClick={startCamera} style={{ width: '100%', padding: '15px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)', cursor: 'pointer', fontWeight: '800', fontSize: '1rem', transition: '0.3s' }}>
                                    📸 START BIOMETRIC SCAN
                                </button>
                                
                                <label style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center', fontSize: '0.9rem', display: 'block' }}>
                                    📁 UPLOAD PHOTO (FALLBACK)
                                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                                </label>
                            </div>
                        )}

                        {isCameraOpen && (
                            <div style={{ position: 'relative', background: '#000', borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                                {isVirtualStream ? (
                                        <img src={TEST_ID_PHOTO} alt="Virtual Stream" style={{ width: '100%', filter: 'brightness(0.6) sepia(0.5) contrast(1.2)', opacity: 0.9 }} />
                                ) : (
                                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%', filter: 'brightness(1.1) contrast(1.1)' }} />
                                )}
                                
                                {/* Clean View: HUD Removed per user request */}

                                {/* Circular Scanner Frame */}
                                <div style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)', 
                                    width: '260px', 
                                    height: '260px', 
                                    border: '2px solid rgba(16, 185, 129, 0.5)', 
                                    borderRadius: '50%', 
                                    boxShadow: '0 0 0 1000px rgba(0,0,0,0.4)',
                                    pointerEvents: 'none'
                                }}>
                                    {/* HUD Legend Removed per user request */}
                                </div>

                                <style>{`
                                    @keyframes scannerBlink {
                                        0%, 100% { opacity: 0.3; }
                                        50% { opacity: 1; }
                                    }
                                    @keyframes pulseBtn {
                                        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                                        70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
                                        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                                    }
                                `}</style>

                                <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                    <button 
                                        type="button" 
                                        onClick={capturePhoto} 
                                        style={{ 
                                            padding: '12px 25px', 
                                            borderRadius: '30px', 
                                            background: '#3b82f6', 
                                            color: '#fff', 
                                            border: 'none', 
                                            fontWeight: '800', 
                                            cursor: 'pointer',
                                            animation: 'pulseBtn 2s infinite',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                        📸 ✅ BIOMETRIC SNAP
                                    </button>
                                    <button type="button" onClick={stopCamera} style={{ padding: '12px 20px', borderRadius: '30px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>CANCEL</button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div style={{ textAlign: 'center' }}>
                                <img src={capturedImage} alt="Faculty" style={{ width: '100%', maxWidth: '220px', borderRadius: '15px', border: '4px solid #10b981', marginBottom: '10px' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button type="button" onClick={() => { setCapturedImage(null); startCamera(); }} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>🔄 Retake</button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isAnalyzing}
                        style={{ 
                            width: '100%', 
                            padding: '18px', 
                            borderRadius: '16px', 
                            background: isAnalyzing ? 'rgba(59, 130, 246, 0.5)' : (capturedImage ? '#10b981' : '#3b82f6'), 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: '800', 
                            cursor: isAnalyzing ? 'wait' : 'pointer', 
                            fontSize: '1.1rem', 
                            transition: '0.3s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {isAnalyzing ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <span>🔍 AI ANALYZING FACE ({analysisProgress}%)</span>
                            </div>
                        ) : (
                            <>REGISTER FACULTY {capturedImage ? '✓' : '👨‍🏫'}</>
                        )}
                        {isAnalyzing && (
                            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', background: '#fff', width: `${analysisProgress}%`, transition: 'width 0.3s' }}></div>
                        )}
                    </button>
                </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        <div style={{ padding: '40px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                            <h3 style={{ color: '#10b981', fontWeight: '900', fontSize: '2rem', marginBottom: '20px' }}>REGISTRATION SUCCESSFUL!</h3>
                            
                            <div style={{ padding: '30px', background: 'rgba(0,0,0,0.5)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '30px' }}>
                                <div style={{ color: '#64748b', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', fontWeight: 'bold' }}>FACULTY UNIQUE ID</div>
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff' }}>{recentFaculty.id}</div>
                            </div>

                            <button 
                                onClick={() => setRecentFaculty(null)}
                                style={{ padding: '15px 40px', borderRadius: '30px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
                                ➕ REGISTER ANOTHER TEACHER
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Faculty Directory</h3>
                
                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search name, subject or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '25px' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '500px' }}>
                    {filteredFaculty.length > 0 ? filteredFaculty.slice().reverse().map(f => (
                        <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {f.faceImage ? (
                                    <img src={f.faceImage} alt={f.name} style={{ width: '50px', height: '50px', borderRadius: '14px', objectFit: 'cover', border: '1px solid var(--accent-blue)' }} />
                                ) : (
                                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👔</div>
                                )}
                                <div>
                                    <div style={{ fontWeight: '700' }}>{f.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {f.subject} • {f.id}
                                        {f.isFaceEnrolled && (
                                            <span style={{ color: '#10b981', fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 'bold' }}>✓ BIOMETRIC</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <button 
                                    onClick={() => handleDelete(f.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No faculty found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyManagement;
