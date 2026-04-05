import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { mockApi } from '../../utils/mockApi';

const StudentManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const { secureApi } = useAuth();
    const [name, setName] = useState('');
    const [className, setClassName] = useState('10A');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [recentStudent, setRecentStudent] = useState(null);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [landmarks, setLandmarks] = useState(null);
    const [scanMessage, setScanMessage] = useState('ALIGNING...');
    const [scanTips, setScanTips] = useState('');
    const [studentList, setStudentList] = useState([]);
    const [cameraIndex, setCameraIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const fetchStudents = async () => {
        try {
            const res = await secureApi(`${API_URL}/api/students`);
            if (res.ok) {
                const data = await res.json();
                setStudentList(data);
            }
        } catch (e) {
            console.error("Student fetch failed", e);
        }
    };

    useEffect(() => {
        fetchStudents();

        // Cleanup camera on component unmount
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student and all their records?")) {
            try {
                const res = await secureApi(`${API_URL}/api/students/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    addToast("Student record purged successfully from database.", "info");
                    fetchStudents();
                }
            } catch (e) {
                addToast("Failed to delete student.", "error");
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name) {
            addToast("Student name is required.", "error");
            return;
        }
        if (!parentName) {
            addToast("Parent name is required.", "error");
            return;
        }
        if (!dob) {
            addToast("Date of Birth is required.", "error");
            return;
        }
        
        try {
            const payload = {
                name,
                class: className,
                parent_name: parentName,
                dob,
                face_image: capturedImage
            };

            const res = await secureApi(`${API_URL}/api/students`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const result = await res.json();
                const newStudent = result.data;
                setRecentStudent(newStudent);
                fetchStudents();
                setName('');
                setParentName('');
                setDob('');
                setCapturedImage(null);
                addToast(`Student Onboarded Successfully: ${newStudent.unique_id}`, "success");
            } else {
                addToast("Enrollment failed. Please check server logs.", "error");
            }
        } catch (err) {
            addToast(err.message, "error");
        }
    };

    const startCamera = async () => {
        // Stop any existing tracks first to release the camera lock
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        
        setIsCameraOpen(true);
        setIsVirtualStream(false);
        try {
            const tiers = [
                { video: { facingMode: { exact: 'user' } } },
                { video: { facingMode: 'user' } },
                { video: true }
            ];

            let stream = null;
            for (const constraints of tiers) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (stream) break;
                } catch (e) {
                    console.warn("Permission acquisition retry...", e.name);
                }
            }

            if (stream) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices();
                    const videoDevices = devices.filter(d => d.kind === 'videoinput');
                    if (videoDevices.length > 1) {
                        const frontCam = videoDevices.find(d => 
                            d.label.toLowerCase().includes('front') || 
                            d.label.toLowerCase().includes('selfie') ||
                            d.label.toLowerCase().includes('user')
                        );
                        const currentTrack = stream.getVideoTracks()[0];
                        const currentLabel = currentTrack?.label?.toLowerCase() || '';
                        if (frontCam && !currentLabel.includes('front') && !currentLabel.includes('selfie') && !currentLabel.includes('user')) {
                            currentTrack.stop();
                            stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: frontCam.deviceId } } });
                        }
                    }
                } catch (e) {
                    console.warn("Camera refinement failed:", e);
                }

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
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
        setIsCameraOpen(false);
        setIsScanning(false);
        setScanProgress(0);
    };

    // Auto-Scanning Loop
    useEffect(() => {
        let scanInterval;
        if (isCameraOpen && !capturedImage) {
            setIsScanning(true);
            setScanProgress(0);
            
            scanInterval = setInterval(async () => {
                if (videoRef.current && canvasRef.current) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                        
                    // ADAPTIVE DIGITAL BOOST: 1.6 brightness + 1.3 contrast to handle harsh shadows
                    ctx.filter = 'brightness(1.6) contrast(1.3)';
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');

                    try {
                        const detection = await mockApi.getFaceDescriptorFromBase64(dataUrl);
                        
                        if (detection) {
                            setLandmarks(detection.landmarks);
                            setScanTips('');
                            setScanMessage(scanProgress < 50 ? "HOLD STILL..." : "LOCKING FEATURES...");
                            // Calculate scan progress based on facial features detected
                            let progress = 30; // 30% for just detecting face
                            if (detection.landmarks) progress += 40; // 70% for landmarks (eyes, nose, mouth)
                            
                            // If we hit 100%, crop to face
                            setScanProgress(prev => {
                                const next = progress >= 70 ? Math.min(100, prev + 15) : Math.max(0, prev - 10);
                                
                                if (next >= 100) {
                                    const box = detection.detection.box;
                                    const pad = 30; // Padding around face
                                    const cropCanvas = document.createElement('canvas');
                                    cropCanvas.width = box.width + pad * 2;
                                    cropCanvas.height = box.height + pad * 2;
                                    const cropCtx = cropCanvas.getContext('2d');
                                    
                                    cropCtx.drawImage(
                                        video, 
                                        box.x - pad, box.y - pad, box.width + pad * 2, box.height + pad * 2, 
                                        0, 0, cropCanvas.width, cropCanvas.height
                                    );
                                    
                                    const croppedData = cropCanvas.toDataURL('image/jpeg');
                                    setCapturedImage(croppedData);
                                    stopCamera();
                                    addToast("Biometric Lock: Face Profile Captured!", "success");
                                }
                                return next;
                            });
                        } else {
                            setLandmarks(null);
                            setScanProgress(prev => Math.max(0, prev - 10));
                            setScanMessage("FACE NOT DETECTED");
                            setScanTips("Tip: Look straight & ensure bright light on your face.");
                        }
                    } catch (err) {
                        setScanMessage("AI SEARCHING...");
                        setScanTips("Tip: Hold still and ensure your whole face is visible.");
                        console.warn("Biometric scan error:", err);
                    }
                }
            }, 600); // 600ms to reduce CPU load and let AI finish // 500ms for high-res model processing
        } else {
            setIsScanning(false);
        }
        return () => clearInterval(scanInterval);
    }, [isCameraOpen, capturedImage, isScanning]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            stopCamera();
        }
    };

    const filteredStudents = (studentList || []).filter(s => {
        const name = s?.name || '';
        const id = s?.id || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = filterClass === 'All' || s?.class === filterClass;
        return matchesSearch && matchesClass;
    });

    return (
        <>
        <style>
            {`
                @keyframes scanLine {
                    0% { top: 10%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 90%; opacity: 0; }
                }
            `}
        </style>
        <div className="student-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', padding: '20px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('registerStudent')}</h2>
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Arjun Singh"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Class</label>
                        <select 
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        >
                            <option value="10A">10A</option>
                            <option value="9B">9B</option>
                            <option value="11C">11C</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Date of Birth</label>
                        <input 
                            type="date" 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('parentName')}</label>
                        <input 
                            type="text" 
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="e.g. Ramesh Singh"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>

                    {/* Face Capture Section */}
                    <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '15px', fontWeight: '700' }}>Student Face Capture / छात्र का चेहरा</label>
                        
                        {!isCameraOpen && !capturedImage && (
                            <button 
                                type="button"
                                onClick={startCamera}
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', border: '1px solid var(--accent-blue)', cursor: 'pointer', fontWeight: '700' }}
                            >
                                📷 Open Camera
                            </button>
                        )}

                        {isCameraOpen && (
                            <div className="scanner-container" style={{ position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden', background: '#0f172a', padding: '40px 0', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="scanner-viewport" style={{ 
                                    width: '260px', 
                                    height: '260px', 
                                    margin: '0 auto 30px', 
                                    borderRadius: '50%', 
                                    border: '2px dashed rgba(255,255,255,0.15)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.02)'
                                }}>
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
                                            filter: isScanning ? 'brightness(1.1) contrast(1.1)' : 'none' 
                                        }}
                                    />

                                    {/* Switch Camera Button Over Video */}
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCameraIndex(prev => prev + 1);
                                            startCamera();
                                        }} 
                                        style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', zIndex: 100 }}
                                        title="Switch Camera"
                                    >
                                        🔄
                                    </button>
                                    
                                    {/* AI Landmark Dots */}
                                    {isScanning && landmarks && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                                            <div style={{ position: 'absolute', left: `${(landmarks.getLeftEye()[0].x / 640) * 260}px`, top: `${(landmarks.getLeftEye()[0].y / 480) * 260}px`, width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                                            <div style={{ position: 'absolute', left: `${(landmarks.getRightEye()[0].x / 640) * 260}px`, top: `${(landmarks.getRightEye()[0].y / 480) * 260}px`, width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                                            <div style={{ position: 'absolute', left: `${(landmarks.getNose()[0].x / 640) * 260}px`, top: `${(landmarks.getNose()[0].y / 480) * 260}px`, width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></div>
                                        </div>
                                    )}

                                    {isScanning && (
                                        <div className="scan-line" style={{ 
                                            position: 'absolute', 
                                            top: `${scanProgress}%`, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '2px', 
                                            background: '#3b82f6', 
                                            boxShadow: '0 0 15px #3b82f6',
                                            zIndex: 2,
                                            transition: 'top 0.1s linear'
                                        }}></div>
                                    )}
                                </div>
                                
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#3b82f6', fontWeight: '800', fontSize: '1rem', marginBottom: '10px', animation: 'pulse 1.5s infinite' }}>
                                        {scanMessage} {scanProgress}%
                                    </div>
                                    {scanTips && (
                                        <div style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', display: 'inline-block', padding: '4px 12px', borderRadius: '20px' }}>
                                            {scanTips}
                                        </div>
                                    )}
                                </div>

                                <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                    <button 
                                        type="button" 
                                        onClick={stopCamera}
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && (
                            <div style={{ textAlign: 'center' }}>
                                <img 
                                    src={capturedImage} 
                                    alt="Captured Student" 
                                    style={{ width: '100%', maxWidth: '200px', borderRadius: '15px', border: '3px solid var(--accent-blue)', marginBottom: '10px' }} 
                                />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => { setCapturedImage(null); startCamera(); }}
                                        style={{ padding: '8px 15px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        🔄 Retake
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setCapturedImage(null)}
                                        style={{ padding: '8px 15px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            </div>
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: capturedImage ? '#3b82f6' : 'rgba(59, 130, 246, 0.5)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                        SIGN STUDENT ID {capturedImage ? '✅' : '👤'}
                    </button>
                </form>

                {recentStudent && (
                    <div style={{ marginTop: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b98150' }}>
                        <p style={{ color: '#10b981', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>{t('onboardSuccess')}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID</div>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)' }}>{recentStudent.id}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ROLL NO</div>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)' }}>{recentStudent.rollNo}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Student Registry</h3>
                
                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                    <input 
                        type="text" 
                        placeholder="Search name/ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                    />
                    <select 
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                    >
                        <option value="All">All Classes</option>
                        <option value="10A">10A</option>
                        <option value="9B">9B</option>
                        <option value="11C">11C</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '500px' }}>
                    {filteredStudents.length > 0 ? filteredStudents.slice().reverse().map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {s.faceImage ? (
                                    <img src={s.faceImage} alt={s.name} style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--accent-blue)' }} />
                                ) : (
                                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>👤</div>
                                )}
                                <div>
                                    <div style={{ fontWeight: '700' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Class {s.class} • Roll {s.rollNo}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{s.unique_id || s.id}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.parent_name || s.parentName}</div>
                                </div>
                                {useAuth().user?.role === 'Admin' && (
                                    <button 
                                        onClick={() => handleDelete(s.id)}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No students found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default StudentManagement;
