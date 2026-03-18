import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const StudentIdCard = () => {
    const { t, language } = useLanguage();
    const [student, setStudent] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const data = mockApi.loadData();
        const aman = data.studentRegistry.find(s => s.id === 'STU2026-001');
        setStudent(aman);
    }, []);

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            alert(language === 'hi' ? 'आईडी कार्ड डाउनलोड हो गया!' : 'ID Card Downloaded Successfully!');
        }, 3000);
    };

    if (!student) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

    return (
        <div className="id-card-system" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', padding: '20px' }}>
            <div className="id-card-preview" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '30px', 
                width: '100%', 
                maxWidth: '800px' 
            }}>
                {/* Front Side */}
                <div className="glass-panel id-card-side" style={{ 
                    height: '480px', 
                    borderRadius: '24px', 
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))', 
                    border: '2px solid var(--accent-blue)', 
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div className="card-header" style={{ 
                        background: 'var(--accent-blue)', 
                        padding: '20px', 
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', letterSpacing: '1px' }}>NSGI SCHOOL</h3>
                        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>EXCELLENCE IN EDUCATION</p>
                    </div>

                    <div className="card-body" style={{ flex: 1, padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div className="student-photo" style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '15px', 
                            border: '3px solid var(--accent-blue)', 
                            background: '#1e293b',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem'
                        }}>
                            👤
                        </div>
                        
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 5px 0' }}>{student.name}</h2>
                        <p style={{ color: 'var(--accent-blue)', fontWeight: '700', margin: '0 0 20px 0', fontSize: '1rem' }}>{t('student')}</p>

                        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', textAlign: 'left', fontSize: '0.85rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>STUDENT ID</div>
                                <div style={{ fontWeight: '700' }}>{student.id}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>CLASS</div>
                                <div style={{ fontWeight: '700' }}>{student.class}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>ROLL NO</div>
                                <div style={{ fontWeight: '700' }}>{student.rollNo}</div>
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>{t('validUntil')}</div>
                                <div style={{ fontWeight: '700' }}>MARCH 2027</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '60px', height: '60px', background: '#fff', borderRadius: '8px', padding: '5px' }}>
                        <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.5rem' }}>QR CODE</div>
                    </div>
                </div>

                {/* Back Side */}
                <div className="glass-panel id-card-side" style={{ 
                    height: '480px', 
                    borderRadius: '24px', 
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))', 
                    border: '1px solid var(--glass-border)', 
                    padding: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <div className="terms" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <p>1. This card must be carried at all times within school premises.</p>
                        <p>2. Loss of this card must be reported immediately to the Principal.</p>
                        <p>3. This card is non-transferable.</p>
                        <p>4. In case of emergency, please contact the provided number.</p>
                    </div>

                    <div className="contact-info" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', fontWeight: '800' }}>SCHOOL ADDRESS</div>
                            <div style={{ fontSize: '0.75rem' }}>123, NSGI Knowledge Park, Sector 62, Noida, UP - 201301</div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '0.6rem', color: 'var(--accent-blue)', fontWeight: '800' }}>EMERGENCY CONTACT</div>
                            <div style={{ fontSize: '0.75rem' }}>+91 9999 000 111 | +91 120 4455667</div>
                        </div>
                    </div>

                    <div className="signature-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ borderBottom: '1px solid #fff', width: '100px', marginBottom: '5px' }}></div>
                            <div style={{ fontSize: '0.6rem' }}>{t('signature')}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--accent-blue)', fontWeight: '900', fontSize: '1rem', marginBottom: '2px' }}><i>NSGI Admin</i></div>
                            <div style={{ fontSize: '0.6rem' }}>Principal Signature</div>
                        </div>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleDownload}
                disabled={isDownloading}
                style={{ 
                    padding: '18px 50px', 
                    borderRadius: '20px', 
                    background: 'var(--accent-blue)', 
                    color: '#fff', 
                    border: 'none', 
                    fontWeight: '800', 
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}
            >
                {isDownloading ? (
                    <>
                        <div className="btn-loader" style={{ width: '20px', height: '20px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                        {language === 'hi' ? 'तैयार हो रहा है...' : 'Generating Card...'}
                    </>
                ) : (
                    <>📥 {t('downloadCard')}</>
                )}
            </button>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .id-card-side { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
                .id-card-side:hover { transform: scale(1.02); }
            `}</style>
        </div>
    );
};

export default StudentIdCard;
