import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const StudentFeeLedger = () => {
    const { addToast } = useToast();
    const [searchId, setSearchId] = useState('');
    const [data, setData] = useState(null);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const result = mockApi.getStudentLedger(searchId);
        if (result) {
            setData(result);
        } else {
            addToast("Student not found with this ID.", "error");
            setData(null);
        }
    };

    return (
        <div className="student-fee-ledger">
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '800' }}>🔍 Search Student Ledger</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px' }}>
                    <input 
                        type="text" 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter Student ID (e.g. STU2026-001)" 
                        style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem' }}
                    />
                    <button type="submit" style={{ padding: '0 30px', borderRadius: '12px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                        FETCH HISTORY
                    </button>
                </form>
            </div>

            {data && (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <div style={{ marginBottom: '25px', padding: '0 10px' }}>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#fff' }}>
                            {data.student.name} <span style={{ color: 'var(--accent-blue)', opacity: 0.8, fontSize: '1.2rem' }}>#{data.student.id}</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', margin: '5px 0 0 0' }}>Class: {data.student.class} | Profile Match: 100%</p>
                    </div>
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="admin-card" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>TOTAL FEE</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>₹{data.summary.total}</div>
                        </div>
                        <div className="admin-card" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>TOTAL PAID</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>₹{data.summary.paid}</div>
                        </div>
                        <div className="admin-card" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 'bold' }}>PENDING BALANCE</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>₹{data.summary.total - data.summary.paid}</div>
                        </div>
                                       <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                        {/* Transaction History */}
                        <div className="glass-panel" style={{ padding: '30px', borderRadius: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            <h4 style={{ margin: '0 0 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                📑 Payment History
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last updated: {new Date().toLocaleTimeString()}</span>
                            </h4>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Amount</th>
                                            <th>Collector</th>
                                            <th>Mode</th>
                                            <th>TXN ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.transactions.length > 0 ? data.transactions.slice().reverse().map(txn => (
                                            <tr key={txn.id}>
                                                <td style={{ fontSize: '0.85rem' }}>{txn.date}</td>
                                                <td style={{ fontWeight: 'bold', color: 'var(--accent-blue)' }}>₹{txn.amount}</td>
                                                <td>{txn.collectedBy}</td>
                                                <td>
                                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}>
                                                        {txn.mode}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{txn.mode === 'Cash' ? '-' : txn.id}</td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No payments recorded yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>               </div>
                </div>
            )}
        </div>
    );
};

export default StudentFeeLedger;
