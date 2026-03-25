import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Common/Toaster';
import './StudentLeave.css';

const StudentLeave = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ type: 'Bimari (Sick Leave)', start: '', end: '', reason: '' });

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    setHistory(savedRequests.filter(r => r.studentId === user?.id));
  }, [user?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.start || !form.end || !form.reason) {
        addToast('Please fill all fields!', 'error');
        return;
    }

    const newRequest = {
      id: Date.now(),
      studentId: user.id,
      studentName: user.name,
      studentRoll: user.rollNumber,
      class: user.class,
      type: form.type,
      start: form.start,
      end: form.end,
      reason: form.reason,
      status: 'Pending',
      appliedAt: new Date().toLocaleDateString()
    };

    const allRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    const updatedAll = [newRequest, ...allRequests];
    localStorage.setItem('leave_requests', JSON.stringify(updatedAll));
    
    setHistory(prev => [newRequest, ...prev]);
    setForm({ type: 'Bimari (Sick Leave)', start: '', end: '', reason: '' });
    addToast('Aaapki leave ki request Teacher ko bhej di gayi hai! 📝', 'success');
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
                <option>Bimari (Sick Leave)</option>
                <option>Zaruri Kaam (Casual Leave)</option>
                <option>Emergency</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Kab se? (From)</label>
                <input 
                  type="date" required 
                  value={form.start} onChange={e => setForm({...form, start: e.target.value})}
                  className="premium-input"
                />
              </div>
              <div className="form-group">
                <label>Kab tak? (To)</label>
                <input 
                  type="date" required 
                  value={form.end} onChange={e => setForm({...form, end: e.target.value})}
                  className="premium-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Kyun? (Reason)</label>
              <textarea 
                placeholder="Vajh likhein..." required 
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
          <h3 className="section-title">📋 My Applications</h3>
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
                  <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>Applied on: {item.appliedAt}</div>
                </div>
              ))
            ) : (
              <div className="no-history">Koi puraani application nahi mili.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLeave;

