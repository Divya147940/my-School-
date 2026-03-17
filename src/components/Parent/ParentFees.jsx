import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const ParentFees = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    // For demo, shows historical mock fees + current state
    const current = mockApi.getFees().find(f => f.student === 'Aman Gupta');
    setFees([
      { id: 1, month: 'March 2026', amount: current?.paid || 0, status: current?.status || 'Paid', date: '2026-03-05' },
      { id: 2, month: 'February 2026', amount: 5000, status: 'Paid', date: '2026-02-04' },
      { id: 3, month: 'January 2026', amount: 5000, status: 'Paid', date: '2026-01-07' },
    ]);
  }, []);

  return (
    <div className="parent-fees">
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Payment History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                <th style={{ padding: '15px 10px' }}>Month</th>
                <th style={{ padding: '15px 10px' }}>Amount</th>
                <th style={{ padding: '15px 10px' }}>Status</th>
                <th style={{ padding: '15px 10px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => (
                <tr key={fee.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '15px 10px' }}>{fee.month}</td>
                  <td style={{ padding: '15px 10px' }}>₹{fee.amount}</td>
                  <td style={{ padding: '15px 10px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '10px', background: '#10b98120', color: '#10b981', fontSize: '0.8rem' }}>{fee.status}</span>
                  </td>
                  <td style={{ padding: '15px 10px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem' }}>⬇ Receipt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>✅</div>
          <h3>All Dues Cleared</h3>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Thank you! Your ward's school fees are up to date for this session.</p>
          <button style={{ padding: '12px 30px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold' }}>View Full Statement</button>
        </div>
      </div>
    </div>
  );
};

export default ParentFees;
