import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useTheme } from '../../context/ThemeContext';

const ParentNotifications = () => {
  const { theme } = useTheme();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    setAnnouncements(mockApi.getNotifications());
  }, []);

  return (
    <div className="parent-notifications">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {announcements.map((a, idx) => (
          <div 
            key={idx} 
            className="glass-panel card-vibe"
            style={{ 
              padding: '25px', 
              borderRadius: '20px', 
              position: 'relative', 
              overflow: 'hidden',
              transition: 'transform 0.3s ease'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              left: 0, 
              top: 0, 
              bottom: 0, 
              width: '5px', 
              background: a.type === 'Holiday' ? 'var(--accent-red)' : a.type === 'Event' ? 'var(--accent-teal)' : 'var(--accent-blue)',
              boxShadow: '0 0 15px ' + (a.type === 'Holiday' ? 'rgba(239, 68, 68, 0.5)' : a.type === 'Event' ? 'rgba(20, 184, 166, 0.5)' : 'rgba(59, 130, 246, 0.5)')
            }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.5px' }}>{a.title}</span>
              <span className="glass-panel" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '8px', fontWeight: '700', color: 'var(--text-secondary)' }}>{a.date}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParentNotifications;
