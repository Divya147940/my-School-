import React, { useState } from 'react';

const LeaveRequest = () => {
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, type: 'Sick Leave', start: '2026-02-10', end: '2026-02-11', reason: 'Flu', status: 'Approved' },
    { id: 2, type: 'Casual Leave', start: '2026-03-01', end: '2026-03-01', reason: 'Personal work', status: 'Approved' },
  ]);

  const [formData, setFormData] = useState({ type: 'Sick Leave', start: '', end: '', reason: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeaveHistory([{ id: Date.now(), ...formData, status: 'Pending' }, ...leaveHistory]);
    setFormData({ type: 'Sick Leave', start: '', end: '', reason: '' });
    alert('Leave application submitted successfully!');
  };

  return (
    <div className="leave-module">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* Application Form */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Apply for Leave</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Leave Type</label>
              <select 
                value={formData.type} 
                onChange={e => setFormData({...formData, type: e.target.value})}
                style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Maternity/Paternity</option>
                <option>Bereavement</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>Start Date</label>
                <input 
                  type="date" required 
                  value={formData.start} 
                  onChange={e => setFormData({...formData, start: e.target.value})}
                  style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label>End Date</label>
                <input 
                  type="date" required 
                  value={formData.end} 
                  onChange={e => setFormData({...formData, end: e.target.value})}
                  style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Reason</label>
              <textarea 
                required 
                value={formData.reason} 
                onChange={e => setFormData({...formData, reason: e.target.value})}
                style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', minHeight: '100px' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Submit Application
            </button>
          </form>
        </div>

        {/* Leave History */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Leave History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {leaveHistory.map(leave => (
              <div key={leave.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold' }}>{leave.type}</span>
                  <span style={{ 
                    fontSize: '0.8rem', 
                    padding: '3px 10px', 
                    borderRadius: '10px', 
                    background: leave.status === 'Approved' ? '#10b98120' : '#f59e0b20', 
                    color: leave.status === 'Approved' ? '#10b981' : '#f59e0b' 
                  }}>
                    {leave.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {leave.start} to {leave.end}
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', opacity: 0.8 }}>{leave.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
