import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';

const ParentFees = () => {
    const { t, language } = useLanguage();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentState, setPaymentState] = useState('idle'); // idle, processing, success
    const [selectedFee, setSelectedFee] = useState(null);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const data = mockApi.getParentFees();
            setFees(data);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (fee) => {
        setSelectedFee(fee);
        setPaymentState('processing');
        
        // Simulate network delay for premium feel
        setTimeout(() => {
            mockApi.payFee(fee.id);
            setTransactionId('NSGI' + Math.random().toString(36).substr(2, 9).toUpperCase());
            setPaymentState('success');
            fetchFees();
        }, 2500);
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '50px' }}>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading fees...'}</div>;

    const unpaidFee = fees.find(f => f.status === 'Unpaid');

    return (
        <div className="parent-fees">
            {/* Mock Payment Gateway Modal */}
            {paymentState !== 'idle' && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="glass-panel" style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)' }}>
                        {paymentState === 'processing' ? (
                            <>
                                <div className="loader" style={{ width: '80px', height: '80px', border: '5px solid var(--glass-border)', borderTop: '5px solid var(--accent-blue)', borderRadius: '50%', margin: '0 auto 30px', animation: 'spin 1s linear infinite' }}></div>
                                <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{t('processingPayment')}</h2>
                                <p style={{ color: 'var(--text-secondary)' }}>{t('totalAmount')}: ₹{selectedFee?.amount}</p>
                            </>
                        ) : (
                            <>
                                <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'scaleUp 0.5s ease-out' }}>✅</div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#10b981' }}>{t('paymentSuccess')}</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{t('transactionId')}: <b>{transactionId}</b></p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <button onClick={() => setPaymentState('idle')} style={{ padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer', fontWeight: '700' }}>DONE</button>
                                    <button style={{ padding: '15px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}>{t('downloadReceipt')}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="fees-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
                <div className="fees-history">
                    <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px' }}>
                        {t('fees')}
                    </h2>
                    
                    <div className="glass-panel" style={{ background: 'var(--glass-bg)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                <tr>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Month/Year</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Amount</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                                    <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map((fee) => (
                                    <tr key={fee.id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td style={{ padding: '20px', fontWeight: '600' }}>{fee.month} {fee.year}</td>
                                        <td style={{ padding: '20px', fontWeight: '800', color: 'var(--accent-blue)' }}>₹{fee.amount}</td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{ 
                                                padding: '6px 14px', 
                                                borderRadius: '30px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '800',
                                                background: fee.status === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                                color: fee.status === 'Paid' ? '#10b981' : '#f43f5e'
                                            }}>
                                                {fee.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            {fee.status === 'Paid' ? (
                                                <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}>
                                                    RECEIPT 📥
                                                </button>
                                            ) : (
                                                <button onClick={() => handlePayment(fee)} style={{ background: 'var(--accent-blue)', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '800' }}>
                                                    PAY 💳
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="glass-panel card-vibe" style={{ background: 'var(--glass-bg)', padding: '40px', borderRadius: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid var(--glass-border)' }}>
                    {!unpaidFee ? (
                        <>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✨</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{language === 'hi' ? 'सब भुगतान सफल!' : 'All Clear!'}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '250px', lineHeight: '1.6' }}>{language === 'hi' ? 'आपके बच्चे की स्कूल फीस पूरी तरह से भरी हुई है।' : "Your ward's school fees are fully paid for the current session."}</p>
                            <button style={{ padding: '12px 25px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', fontWeight: '700' }}>Download Statement</button>
                        </>
                    ) : (
                        <>
                            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💳</div>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{language === 'hi' ? 'बकाया राशि' : 'Due Balance'}</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>{language === 'hi' ? `${unpaidFee.month} ${unpaidFee.year} के लिए बकाया` : `Outstanding for ${unpaidFee.month} ${unpaidFee.year}`}</p>
                            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-blue)', marginBottom: '30px' }}>₹{unpaidFee.amount}</div>
                            <button 
                                onClick={() => handlePayment(unpaidFee)}
                                style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)', marginBottom: '15px' }}
                            >
                                {t('paySecurely')}
                            </button>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🔒 Secure SSL Encrypted Gateway</span>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes scaleUp { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .table-row-hover:hover { background: rgba(255, 255, 255, 0.02); }
                @media (max-width: 1024px) {
                    .fees-layout { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default ParentFees;
