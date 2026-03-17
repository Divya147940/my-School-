import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const ParentNotifications = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    setAnnouncements(mockApi.getNotifications());
  }, []);

  return (
    <div className="parent-notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {announcements.map((a, idx) => (
          <div key={idx} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: a.type === 'Holiday' ? '#f43f5e' : a.type === 'Event' ? '#10b981' : '#3b82f6' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>{a.title}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{a.date}</span>
            </div>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentNotifications;
