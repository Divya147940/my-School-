import React, { useState, useEffect, useRef } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const StudentManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [className, setClassName] = useState('10A');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [recentStudent, setRecentStudent] = useState(null);
    const [isVirtualStream, setIsVirtualStream] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    const TEST_ID_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"; // Schematic hybrid avatar

    useEffect(() => {
        setStudentList(mockApi.getDB().studentRegistry || []);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this student and all their records?")) {
            mockApi.deleteStudent(id);
            setStudentList(prev => prev.filter(s => s.id !== id));
            addToast("Student record purged successfully.", "info");
        }
    };

    const handleRegister = (e) => {
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
            const newStudent = mockApi.onboardStudent(name, className, parentName, dob, capturedImage);
            setRecentStudent(newStudent);
            setStudentList(prev => [...prev, newStudent]);
            setName('');
            setParentName('');
            setDob('');
            setCapturedImage(null);
            addToast(`Student ID Signed: ${newStudent.id}`, "success");
        } catch (err) {
            addToast(err.message, "error");
        }
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
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
        setIsCameraOpen(false);
    };

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
                            <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <div style={{ position: 'absolute', bottom: '15px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <button 
                                        type="button" 
                                        onClick={capturePhoto}
                                        style={{ padding: '10px 20px', borderRadius: '30px', background: '#fff', color: '#000', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
                                    >
                                        📸 CAPTURE
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={stopCamera}
                                        style={{ padding: '10px 20px', borderRadius: '30px', background: 'rgba(239, 68, 68, 0.8)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer' }}
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
                                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{s.id}</div>
                                    <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s.parentName}</div>
                                </div>
                                <button 
                                    onClick={() => handleDelete(s.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No students found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
