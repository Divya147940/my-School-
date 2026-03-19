import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const FeeCollector = ({ userRole, userName }) => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('Cash');
    const [recentTxn, setRecentTxn] = useState(null);
    const [ledger, setLedger] = useState([]);

    useEffect(() => {
        const data = mockApi.loadData();
        setStudents(data.studentRegistry || []);
        setLedger(data.feeLedger || []);
    }, []);

    const handleCollect = (e) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!selectedStudent) {
            addToast("Please select a student first.", "error");
            return;
        }
        if (!numAmount || numAmount <= 0) {
            addToast("Please enter a valid amount.", "error");
            return;
        }

        const student = students.find(s => s.id === selectedStudent);
        const newTxn = mockApi.recordFee(
            student.id, 
            student.name, 
            numAmount, 
            mode, 
            userRole, 
            userName
        );

        setRecentTxn(newTxn);
        setLedger(prev => [newTxn, ...prev]);
        setAmount('');
    };

    return (
        <div className="fee-collector-system" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', padding: '20px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('collectFee')}</h2>
                <form onSubmit={handleCollect}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Select Student</label>
                        <select 
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        >
                            <option value="">-- Choose Student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.id}) - Class {s.class}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('amountPaid')} (₹)</label>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 5000"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('paymentMode')}</label>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            {['Cash', 'Online'].map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMode(m)}
                                    style={{ 
                                        flex: 1, 
                                        padding: '12px', 
                                        borderRadius: '12px', 
                                        border: mode === m ? '2px solid var(--accent-blue)' : '1px solid var(--glass-border)',
                                        background: mode === m ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                        color: mode === m ? 'var(--accent-blue)' : '#fff',
                                        fontWeight: '700',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {m === 'Cash' ? t('cash') : t('online')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                        RECORD PAYMENT 🧾
                    </button>
                </form>

                {recentTxn && (
                    <div style={{ marginTop: '30px', padding: '25px', borderRadius: '24px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b98150' }}>
                        <div style={{ color: '#10b981', fontWeight: '800', marginBottom: '15px', textAlign: 'center' }}>RECORDED SUCCESSFULLY!</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('txnId')}</div>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)' }}>#{recentTxn.id}</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '15px' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Mode</div>
                                <div style={{ fontWeight: '900', color: '#10b981' }}>{recentTxn.mode}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>School Fee Ledger</h3>
                <div style={{ overflowY: 'auto', maxHeight: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {ledger.slice().reverse().map(txn => (
                        <div key={txn.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '1rem' }}>{txn.studentName}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{txn.date} • {t('txnId')} #{txn.id}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '900', color: 'var(--accent-blue)', fontSize: '1.1rem' }}>₹{txn.amount}</div>
                                <div style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', background: txn.mode === 'Cash' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: txn.mode === 'Cash' ? '#f59e0b' : '#10b981', display: 'inline-block' }}>{txn.mode}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeeCollector;
