import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    setFees(mockApi.getFees());
  }, []);

  const sendReminder = (student) => {
    alert(`Reminder SMS sent to ${student}'s parents regarding pending fees.`);
  };

  const bulkSendReminders = () => {
    const unpaid = fees.filter(f => f.status !== 'Paid');
    if (unpaid.length === 0) {
      alert("No pending fees found. All students have paid!");
      return;
    }
    
    const confirmSend = window.confirm(`Send automated SMS reminders to ${unpaid.length} parents?`);
    if (confirmSend) {
      alert(`🚀 NSGI Bulk SMS System: ${unpaid.length} reminders sent successfully!`);
    }
  };

  return (
    <div className="fee-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
        <h3 style={{ margin: 0 }}>Student Fee Records</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Search student..." style={{ padding: '8px 15px', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
          <button 
            onClick={bulkSendReminders}
            style={{ padding: '8px 20px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            📲 Send Bulk Reminders
          </button>
          <button style={{ padding: '8px 20px', borderRadius: '10px', background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold' }}>Collect Fee</button>
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Class</th>
              <th>Total Fee</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fees.map(fee => (
              <tr key={fee.id}>
                <td>{fee.student}</td>
                <td>{fee.class}</td>
                <td>₹{fee.total}</td>
                <td>₹{fee.paid}</td>
                <td style={{ color: fee.total - fee.paid > 0 ? '#f43f5e' : '#10b981' }}>₹{fee.total - fee.paid}</td>
                <td>
                  <span className={`badge ${fee.status === 'Paid' ? 'badge-paid' : 'badge-pending'}`}>
                    {fee.status}
                  </span>
                </td>
                <td>
                  {fee.status !== 'Paid' && (
                    <button 
                      onClick={() => sendReminder(fee.student)}
                      style={{ padding: '5px 12px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: 'none', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      🔔 Remind
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeManagement;
