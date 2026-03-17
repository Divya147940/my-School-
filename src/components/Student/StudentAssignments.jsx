import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    setAssignments(mockApi.getAssignments());
  }, []);

  return (
    <div className="student-assignments">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {assignments.map(asm => (
          <div key={asm.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.8rem', background: '#60a5fa20', color: '#60a5fa', padding: '4px 10px', borderRadius: '10px' }}>{asm.subject}</span>
              <span style={{ 
                fontSize: '0.8rem', 
                background: asm.status === 'Pending' ? '#f59e0b20' : '#10b98120', 
                color: asm.status === 'Pending' ? '#f59e0b' : '#10b981', 
                padding: '4px 10px', 
                borderRadius: '10px' 
              }}>{asm.status}</span>
            </div>
            <h3 style={{ margin: '0 0 10px 0' }}>{asm.title}</h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>{asm.instructions}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>Due: {asm.dueDate}</span>
              {asm.status === 'Pending' && (
                <button style={{ padding: '8px 20px', borderRadius: '8px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  Submit Work
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments;
