import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { mockApi } from '../../utils/mockApi';

const FacultyManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const { secureApi } = useAuth();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [assignedClass, setAssignedClass] = useState('');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recentFaculty, setRecentFaculty] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);

    const TEST_ID_PHOTO = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"; // Schematic Male/Female hybrid avatar

    // File upload removed
    const [facultyList, setFacultyList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [revealStates, setRevealStates] = useState({}); // { [facultyId-field]: boolean }

    const handleReveal = (fId, field, facultyName) => {
        const key = `${fId}-${field}`;
        setRevealStates(prev => ({ ...prev, [key]: true }));
        mockApi.logAudit('DATA_ACCESS_REVEAL', `Admin revealed sensitive field [${field}] for ${facultyName}`, 'Admin', { facultyId: fId, field });
    };

    const isRevealed = (fId, field) => revealStates[`${fId}-${field}`];

    // Refs removed

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await secureApi(`${API_URL}/api/faculty`);
                if (res.ok) {
                    const data = await res.json();
                    setFacultyList(data);
                }
            } catch (e) {
                console.error("Fetch failed", e);
            }
        };
        fetchFaculty();
    }, [secureApi]);


    // Biometric Logic Removed


    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !subject || !assignedClass || !dob || !parentName || !email || !password) {
            addToast("All fields are required", "error");
            return;
        }
        try {
            setIsAnalyzing(true);
            setAnalysisProgress(50);

            const response = await secureApi(`${API_URL}/api/faculty`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    designation: subject,
                    description: `Class ${assignedClass} teacher`,
                    faceImage: null,
                    faceDescriptor: null,
                    email,
                    password
                })
            });

            const result = await response.json();

            setAnalysisProgress(100);

            if (result.status === 'success') {
                const facultyWithId = { ...result.data, id: result.data.unique_id };
                setTimeout(() => {
                    setRecentFaculty(facultyWithId);
                    setFacultyList(prev => [...prev, facultyWithId]);
                    setName('');
                    setSubject('');
                    setAssignedClass('');
                    setParentName('');
                    setDob('');
                    setEmail('');
                    setPassword('');
                    setIsAnalyzing(false);
                    addToast("Faculty registered successfully!", "success");
                }, 500);
            } else {
                throw new Error(result.message || "Failed to register faculty");
            }

        } catch (err) {
            setIsAnalyzing(false);
            addToast(err.message, "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this faculty record?")) {
            try {
                const res = await secureApi(`${API_URL}/api/faculty/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setFacultyList(prev => prev.filter(f => f.id !== id));
                    addToast("Record removed from database", "success");
                } else {
                    const data = await res.json();
                    throw new Error(data.message || "Failed to delete from database");
                }
            } catch (err) {
                addToast(err.message, "error");
            }
        }
    };

    const filteredFaculty = facultyList.filter(f =>
        (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.unique_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.id || '').toString().includes(searchTerm)
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

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Email ID</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="e.g. faculty@school.edu"
                                        style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Login Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter Password"
                                        style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f630', textAlign: 'center', color: '#94a3b8' }}>
                                <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>🔐 SECURITY READY</div>
                                <p style={{ fontSize: '0.8rem' }}>Faculty will login using Email and Password only. Biometrics disabled for this role.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                style={{
                                    width: '100%',
                                    padding: '18px',
                                    borderRadius: '16px',
                                    background: isAnalyzing ? 'rgba(59, 130, 246, 0.5)' : '#3b82f6',
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
                                        <span>⚙️ REGISTERING FACULTY...</span>
                                    </div>
                                ) : (
                                    <>REGISTER FACULTY 👨‍🏫</>
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
                                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff' }}>{recentFaculty.unique_id || recentFaculty.id}</div>
                                <div style={{ color: '#10b981', fontSize: '0.9rem', marginTop: '10px', fontWeight: 'bold' }}>PASSWORD SET SUCCESSFULLY</div>
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
                                        {f.designation} • {f.unique_id || f.id}
                                    </div>

                                    {/* GUARDIAN SUITE 2.0: MASKED DATA SECTION */}
                                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem' }}>
                                        <div style={{ color: '#94a3b8' }}>
                                            📞 {isRevealed(f.id, 'contact') ? f.contact : 'Verified'}
                                            {!isRevealed(f.id, 'contact') && f.contact && (
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
