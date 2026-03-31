import React from 'react';
import './StudentIDCard.css';
import { useLanguage } from '../../context/LanguageContext';

const StudentIDCard = () => {
    const { language } = useLanguage();
    const { user } = useAuth(); // Assuming useAuth is available or use mock
    
    const student = {
        name: user?.name || "Aarav Sharma",
        id: user?.id || "NSGI-2024-0892",
        class: user?.class || "Class 10-A",
        dob: "12/05/2009",
        validUntil: "March 2026",
        bloodGroup: "O+",
        house: "Red House",
        status: "Verified ✅"
    };

    const qrData = `NSGI-VERIFY:${student.id}:${student.name}:${new Date().toLocaleDateString()}`;

    return (
        <div className="id-card-container">
            <div className="holographic-card">
                <div className="card-glare"></div>
                <div className="card-header">
                    <div className="school-logo" style={{ fontSize: '2rem' }}>🏢</div>
                    <div className="school-info">
                        <h2 style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>SHRI JAGESHWAR MEMORIAL</h2>
                        <p style={{ fontSize: '0.6rem', opacity: 0.8 }}>Shaping Futures, Building Leaders</p>
                    </div>
                </div>

                <div className="card-body">
                    <div className="profile-section">
                        <div className="photo-frame" style={{ background: 'var(--accent-blue)', opacity: 0.2 }}>
                            <div className="photo-placeholder-icon">👤</div>
                        </div>
                        <div className="status-badge-id">{student.status}</div>
                    </div>

                    <div className="info-section">
                        <div className="info-row">
                            <label>{language === 'hi' ? 'नाम' : 'NAME'}</label>
                            <span style={{ fontSize: '1.1rem', fontWeight: '900' }}>{student.name}</span>
                        </div>
                        <div className="info-row">
                            <label>{language === 'hi' ? 'छात्र आईडी' : 'STUDENT ID'}</label>
                            <span className="id-text" style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{student.id}</span>
                        </div>
                        <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div className="info-row">
                                <label>{language === 'hi' ? 'कक्षा' : 'CLASS'}</label>
                                <span>{student.class}</span>
                            </div>
                            <div className="info-row">
                                <label>{language === 'hi' ? 'रक्त समूह' : 'BLOOD'}</label>
                                <span>{student.bloodGroup}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px' }}>
                    <div className="qr-container-id">
                         <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrData)}`} 
                            alt="Student QR" 
                            style={{ borderRadius: '8px', border: '2px solid #fff' }}
                         />
                    </div>
                    <div className="validity" style={{ textAlign: 'right' }}>
                        <label style={{ fontSize: '0.6rem', opacity: 0.6 }}>VALID UNTIL</label>
                        <div style={{ fontWeight: 'bold' }}>{student.validUntil}</div>
                        <div style={{ fontSize: '0.5rem', marginTop: '5px' }}>SCAN TO VERIFY PRESENCE</div>
                    </div>
                </div>
            </div>

            <div className="card-actions" style={{ marginTop: '20px', textAlign: 'center' }}>
                <button className="submit-btn-glow" style={{ padding: '12px 25px' }}>📥 Download Digital Identity</button>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px' }}>⚠️ Present this QR to your teacher for verified attendance.</p>
            </div>
        </div>
    );
};

export default StudentIDCard;
