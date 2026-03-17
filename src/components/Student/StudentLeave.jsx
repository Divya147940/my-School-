import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const StudentLeave = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(mockApi.getLeaves().filter(l => l.name.includes('Aman Gupta')));
  }, []);

  const [form, setForm] = useState({ type: 'Sick Leave', start: '', end: '', reason: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = { 
      name: 'Aman Gupta (Student)', 
      type: form.type, 
      duration: `${form.start} to ${form.end}`, 
      reason: form.reason 
    };
    mockApi.addLeaveRequest(req);
    setHistory(mockApi.getLeaves().filter(l => l.name.includes('Aman Gupta')));
    setForm({ type: 'Sick Leave', start: '', end: '', reason: '' });
    alert('Leave request sent to Admin!');
  };

  return (
    <div className="student-leave">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Request Leave</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" placeholder="Type of Leave" required 
              value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="date" required 
                value={form.start} onChange={e => setForm({...form, start: e.target.value})}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              />
              <input 
                type="date" required 
                value={form.end} onChange={e => setForm({...form, end: e.target.value})}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)' }}
              />
            </div>
            <textarea 
              placeholder="Reason for leave" required 
              value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
              style={{ padding: '12px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', minHeight: '100px' }}
            />
            <button type="submit" style={{ padding: '12px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold' }}>
              Submit Request
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>History</h3>
          {history.map(item => (
            <div key={item.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{item.type}</span>
                <span style={{ 
                  padding: '3px 10px', borderRadius: '8px', fontSize: '0.8rem',
                  background: item.status === 'Approved' ? '#10b98120' : '#f59e0b20',
                  color: item.status === 'Approved' ? '#10b981' : '#f59e0b'
                }}>{item.status}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '10px' }}>{item.start} to {item.end}</div>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentLeave;
