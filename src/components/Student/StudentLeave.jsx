import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';
import './StudentLeave.css';

const StudentLeave = () => {
  const { addToast } = useToast();
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
      start: form.start,
      end: form.end,
      duration: `${form.start} to ${form.end}`, 
      reason: form.reason 
    };
    mockApi.addLeaveRequest(req);
    setHistory(mockApi.getLeaves().filter(l => l.name.includes('Aman Gupta')));
    setForm({ type: 'Sick Leave', start: '', end: '', reason: '' });
    addToast('Leave request sent to Admin!', 'success');
  };

  return (
    <div className="student-leave-container">
      <div className="leave-grid">
        <div className="leave-form-card glass-panel">
          <h3 className="section-title">✨ Request New Leave</h3>
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label>Leave Type</label>
              <select 
                value={form.type} 
                onChange={e => setForm({...form, type: e.target.value})}
                className="premium-input"
              >
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Emergency</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>From Date</label>
                <input 
                  type="date" required 
                  value={form.start} onChange={e => setForm({...form, start: e.target.value})}
                  className="premium-input"
                />
              </div>
              <div className="form-group">
                <label>To Date</label>
                <input 
                  type="date" required 
                  value={form.end} onChange={e => setForm({...form, end: e.target.value})}
                  className="premium-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Leave</label>
              <textarea 
                placeholder="Explain why you need leave..." required 
                value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                className="premium-input text-area"
              />
            </div>

            <button type="submit" className="submit-btn-glow">
              🚀 Submit Leave Request
            </button>
          </form>
        </div>

        <div className="leave-history-section">
          <h3 className="section-title">📋 Application History</h3>
          <div className="history-list">
            {history.length > 0 ? (
              history.map(item => (
                <div key={item.id} className="history-card glass-panel">
                  <div className="history-header">
                    <span className="leave-badge">{item.type}</span>
                    <span className={`status-pill ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="leave-dates">
                    <span>📅 {item.start}</span>
                    <span className="date-arrow">→</span>
                    <span>📅 {item.end}</span>
                  </div>
                  <p className="leave-reason">"{item.reason}"</p>
                </div>
              ))
            ) : (
              <div className="no-history">No previous records found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLeave;
