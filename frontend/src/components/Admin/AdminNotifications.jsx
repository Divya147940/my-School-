import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';

const AdminNotifications = () => {
  const [msg, setMsg] = useState('');
  const [target, setTarget] = useState('All');

  const handleSend = (e) => {
    e.preventDefault();
    mockApi.addNotification({
      title: `Broadcast: ${target}`,
      content: msg,
      type: 'Notice'
    });
    alert(`Broadcast sent to ${target}!`);
    setMsg('');
  };

  return (
    <div className="admin-notifications">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <h3 style={{ marginTop: 0 }}>Broadcast Message</h3>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Select Target Audience</label>
              <select 
                value={target} onChange={e => setTarget(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option>All Students & Staff</option>
                <option>Class 10 Only</option>
                <option>Faculty Only</option>
                <option>Parents Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '10px' }}>Message Content</label>
              <textarea 
                required 
                value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="Type your announcement here..."
                style={{ width: '100%', padding: '15px', borderRadius: '12px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', minHeight: '120px' }}
              />
            </div>
            <button type="submit" style={{ padding: '15px', borderRadius: '12px', background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              🚀 Send Bulk Notification
            </button>
          </form>
        </div>

        <div>
          <h3>Recent Broadcasts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontWeight: 'bold', color: '#f43f5e' }}>Holiday Announcement</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>School will remain closed on 25th March for Holi festival.</p>
              <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Sent: 2 hours ago to All</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontWeight: 'bold', color: '#f43f5e' }}>Fee Reminder</div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Dear parents, please clear the pending fees before exams.</p>
              <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Sent: Yesterday to Parents</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
