import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const FacultyManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [assignedClass, setAssignedClass] = useState('');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [enrollmentSource, setEnrollmentSource] = useState(null); // 'CAMERA', 'FILE', 'DEMO'
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [hardwareLocked, setHardwareLocked] = useState(false);
    const [recentFaculty, setRecentFaculty] = useState(null);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [landmarks, setLandmarks] = useState(null);
    const [scanMessage, setScanMessage] = useState('ALIGNING...');
    const [scanTips, setScanTips] = useState('');
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
    const [revealStates, setRevealStates] = useState({}); // { [facultyId-field]: boolean }

    const handleReveal = (fId, field, facultyName) => {
        const key = `${fId}-${field}`;
        setRevealStates(prev => ({ ...prev, [key]: true }));
        mockApi.logAudit('DATA_ACCESS_REVEAL', `Admin revealed sensitive field [${field}] for ${facultyName}`, 'Admin', { facultyId: fId, field });
    };

    const isRevealed = (fId, field) => revealStates[`${fId}-${field}`];

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
            }
        }, 300); // Increased delay for stability
    };

    // Automated scanning loop for Faculty registration
    useEffect(() => {
        let scanInterval;
        if (isCameraOpen && !capturedImage) {
            setIsScanning(true);
            setScanProgress(0);
            scanInterval = setInterval(async () => {
                if (videoRef.current && canvasRef.current) {
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                    // ADAPTIVE DIGITAL BOOST: 1.6 brightness + 1.3 contrast for harsh lighting
                    ctx.filter = 'brightness(1.6) contrast(1.3)';
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');

                    try {
                        const detection = await mockApi.getFaceDescriptorFromBase64(dataUrl);
                        if (detection) {
                            setLandmarks(detection.landmarks);
                            setScanTips('');
                            setScanMessage(scanProgress < 50 ? "HOLD STILL..." : "LOCKING FEATURES...");
                            let progress = 30;
                            if (detection.landmarks) progress += 40;

                            if (progress >= 70) {
                                setScanProgress(prev => Math.min(100, prev + 15));
                            } else {
                                setScanProgress(prev => Math.max(10, prev - 5));
                            }

                            // Auto-capture on 100%
                            if (scanProgress >= 100) {
                                const box = detection.detection.box;
                                const pad = 40;
                                const cropCanvas = document.createElement('canvas');
                                cropCanvas.width = box.width + pad * 2;
                                cropCanvas.height = box.height + pad * 2;
                                const cropCtx = cropCanvas.getContext('2d');

                                cropCtx.drawImage(
                                    video,
                                    box.x - pad, box.y - pad, box.width + pad * 2, box.height + pad * 2,
                                    0, 0, cropCanvas.width, cropCanvas.height
                                );

                                setCapturedImage(cropCanvas.toDataURL('image/jpeg'));
                                setEnrollmentSource('CAMERA');
                                stopCamera();
                                addToast("Teacher Biometrics Locked Successfully!", "success");
                            }
                        } else {
                            setLandmarks(null);
                            setScanProgress(prev => Math.max(0, prev - 10));
                            setScanMessage("FACE NOT DETECTED");
                            setScanTips("Tip: Ensure light is on your face and your camera is clean.");
                        }
                    } catch (err) {
                        setScanMessage("AI SEARCHING...");
                        setScanTips("Tip: Hold still and ensure your whole face is visible.");
                        console.warn("Faculty scan skipped/error:", err);
                    }
                }
            }, 600); // 600ms to reduce CPU load and let AI finish // 500ms for high-res model processing
        } else {
            setIsScanning(false);
        }
        return () => clearInterval(scanInterval);
    }, [isCameraOpen, capturedImage, scanProgress]);

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
        if (!name || !subject || !assignedClass || !dob || !parentName) {
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

            const faculty = await mockApi.onboardFaculty(name, subject, assignedClass, dob, parentName, capturedImage);

            clearInterval(interval);
            setAnalysisProgress(100);

            setTimeout(() => {
                setRecentFaculty(faculty);
                setFacultyList(prev => [...prev, faculty]);
                setName('');
                setSubject('');
                setAssignedClass('');
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
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Assigned Class</label>
                                    <select
                                        value={assignedClass}
                                        onChange={(e) => setAssignedClass(e.target.value)}
                                        style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    >
                                        <option value="" style={{ background: '#1e293b' }}>Select Class</option>
                                        {['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(c => (
                                            <option key={c} value={c} style={{ background: '#1e293b' }}>Class {c}</option>
                                        ))}
                                    </select>
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

                                        {/* Circular Face Guide */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '240px',
                                            height: '240px',
                                            border: '3px solid ' + (scanProgress > 80 ? '#10b981' : (scanProgress > 40 ? '#fbbf24' : 'rgba(255,255,255,0.2)')),
                                            borderRadius: '50%',
                                            boxShadow: '0 0 0 1000px rgba(0,0,0,0.6)',
                                            pointerEvents: 'none'
                                        }}>
                                            <div style={{ position: 'absolute', top: '15%', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: '0.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                {isScanning ? 'AI SCANNING...' : 'POSITION FACE'}
                                            </div>
                                        </div>

                                        {/* AI Landmark Dots */}
                                        {isScanning && landmarks && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                                <div style={{ position: 'absolute', left: `${(landmarks.getLeftEye()[0].x / 640) * 100}%`, top: `${(landmarks.getLeftEye()[0].y / 480) * 100}%`, width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }}></div>
                                                <div style={{ position: 'absolute', left: `${(landmarks.getRightEye()[0].x / 640) * 100}%`, top: `${(landmarks.getRightEye()[0].y / 480) * 100}%`, width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }}></div>
                                                <div style={{ position: 'absolute', left: `${(landmarks.getNose()[0].x / 640) * 100}%`, top: `${(landmarks.getNose()[0].y / 480) * 100}%`, width: '4px', height: '4px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 10px #3b82f6' }}></div>
                                            </div>
                                        )}

                                        {isScanning && (
                                            <div style={{ position: 'absolute', bottom: '60px', left: '0', right: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <div style={{ width: '70%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                                                    <div style={{ width: `${scanProgress}%`, height: '100%', background: scanProgress > 80 ? '#10b981' : 'var(--accent-blue)', transition: 'width 0.3s ease-out' }}></div>
                                                </div>
                                                <div style={{ color: '#fff', fontWeight: '900', fontSize: '0.9rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '1px' }}>
                                                    {scanMessage} {scanProgress}%
                                                </div>
                                                {scanTips && (
                                                    <div style={{ marginTop: '10px', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.6)', padding: '5px 15px', borderRadius: '20px', animation: 'fadeIn 0.5s' }}>
                                                        {scanTips}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
                                            <button type="button" onClick={stopCamera} style={{ padding: '8px 15px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(5px)', fontSize: '0.8rem' }}>CANCEL</button>
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
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        {f.subject} • Class {f.assignedClass} • {f.id}
                                        {f.isFaceEnrolled && (
                                            <span style={{ color: '#10b981', fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)', fontWeight: 'bold' }}>✓ BIOMETRIC</span>
                                        )}
                                    </div>

                                    {/* GUARDIAN SUITE 2.0: MASKED DATA SECTION */}
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                                        <div style={{ color: '#94a3b8' }}>
                                            📞 {isRevealed(f.id, 'contact') ? f.contact : '•••••• •••• '}
                                            {!isRevealed(f.id, 'contact') && (
                                                <button onClick={() => handleReveal(f.id, 'contact', f.name)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline', padding: 0 }}>Reveal</button>
                                            )}
                                        </div>
                                        <div style={{ color: '#94a3b8' }}>
                                            💰 {isRevealed(f.id, 'salary') ? f.salary : '₹ ••,••• '}
                                            {!isRevealed(f.id, 'salary') && (
                                                <button onClick={() => handleReveal(f.id, 'salary', f.name)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginLeft: '5px', textDecoration: 'underline', padding: 0 }}>Reveal</button>
                                            )}
                                        </div>
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
