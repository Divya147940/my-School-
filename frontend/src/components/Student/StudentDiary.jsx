import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const StudentDiary = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(mockApi.getDiary());
  }, []);

  return (
    <div className="student-diary">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {entries.map(entry => (
          <div key={entry.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, color: '#60a5fa' }}>{entry.topic}</h3>
                <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Date Content Covered: {entry.date}</span>
              </div>
              <div style={{ padding: '8px 15px', borderRadius: '12px', background: '#10b98120', color: '#10b981', fontWeight: 'bold' }}>
                {entry.progress}% Complete
              </div>
            </div>
            
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
              <div style={{ width: `${entry.progress}%`, height: '100%', background: 'linear-gradient(to right, #60a5fa, #10b981)' }}></div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#94a3b8' }}>Teacher's Remarks</h4>
              <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.6' }}>{entry.remarks}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDiary;
