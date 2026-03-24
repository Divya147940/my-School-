import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import FeeReceipt from './FeeReceipt';
import PaymentGateway from './PaymentGateway';

const ParentFees = () => {
    const { t, language } = useLanguage();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentState, setPaymentState] = useState('idle'); // idle, processing, success
    const [selectedFee, setSelectedFee] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedTxn, setSelectedTxn] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [showPaymentGateway, setShowPaymentGateway] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        setLoading(true);
        try {
            const data = mockApi.getParentFees();
            setFees(data);
            
            const fullLedger = mockApi.loadData().feeLedger || [];
            // For demo: Filter for Aman Gupta if he's the student
            setHistory(fullLedger.filter(txn => txn.studentName === 'Aman Gupta'));
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = (fee) => {
        setSelectedFee(fee);
        setShowPaymentGateway(true);
    };

    const handlePaymentSuccess = () => {
        mockApi.payFee(selectedFee.id);
        setTransactionId('NSGI' + Math.random().toString(36).substr(2, 9).toUpperCase());
        setShowPaymentGateway(false);
        fetchFees();
    };

    if (loading) return <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '50px' }}>{language === 'hi' ? 'लोड हो रहा है...' : 'Loading fees...'}</div>;

    const unpaidFee = fees.find(f => f.status === 'Unpaid');

    return (
        <div className="parent-fees">
            {/* Payment Gateway Modal */}
            {showPaymentGateway && (
                <PaymentGateway 
                    amount={selectedFee?.amount} 
                    onSuccess={handlePaymentSuccess} 
                    onClose={() => setShowPaymentGateway(false)} 
                />
            )}

            {/* Transaction History Section */}
            <div className="glass-panel" style={{ marginTop: '40px', padding: '30px' }}>
                <h3 className="section-title">{t('history')}</h3>
                <div className="table-responsive">
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>{t('txnId')}</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Amount</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>{t('paymentMode')}</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>{t('collectedBy')}</th>
                                <th style={{ padding: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map(txn => (
                                <tr key={txn.id} className="table-row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td style={{ padding: '20px', fontWeight: '800' }}>#{txn.id}</td>
                                    <td style={{ padding: '20px' }}>{txn.date}</td>
                                    <td style={{ padding: '20px', fontWeight: '800', color: 'var(--accent-blue)' }}>₹{txn.amount}</td>
                                    <td style={{ padding: '20px' }}><span className={`badge badge-${txn.mode.toLowerCase()}`} style={{ 
                                        padding: '6px 14px', 
                                        borderRadius: '30px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '800',
                                        background: 'rgba(59, 130, 246, 0.15)', // Example background, adjust as needed
                                        color: '#3b82f6' // Example color, adjust as needed
                                    }}>{txn.mode}</span></td>
                                    <td style={{ padding: '20px', fontSize: '0.8rem' }}>{txn.collectedBy}</td>
                                    <td style={{ padding: '20px' }}><span className="badge badge-paid" style={{ 
                                        padding: '6px 14px', 
                                        borderRadius: '30px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '800',
                                        background: 'rgba(16, 185, 129, 0.15)', 
                                        color: '#10b981' 
                                    }}>SUCCESS</span></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                                <button 
                                                    onClick={() => {
                                                        setSelectedTxn({ ...fee, id: `FEE-${fee.id}` });
                                                        setShowReceipt(true);
                                                    }}
                                                    style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                                                >
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

            {showReceipt && (
                <FeeReceipt 
                    txn={selectedTxn} 
                    onClose={() => setShowReceipt(false)} 
                />
            )}
        </div>
    );
};

export default ParentFees;
