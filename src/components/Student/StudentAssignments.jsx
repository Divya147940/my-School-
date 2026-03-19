import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import './AssignmentPortal.css';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    setAssignments(mockApi.getAssignments());
  }, []);

  const handleFinishSubmit = (id) => {
    alert('Assignment submitted successfully!');
    setAssignments(assignments.map(asm => 
      asm.id === id ? { ...asm, status: 'Submitted' } : asm
    ));
    setSubmittingId(null);
  };

  return (
    <div className="assignment-gateway">
      <div className="assignment-grid">
        {assignments.map(asm => (
          <div key={asm.id} className="assignment-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="subject-tag">{asm.subject}</span>
              <span className={`status-badge ${asm.status.toLowerCase()}`}>{asm.status}</span>
            </div>
            
            <h3 className="asm-title">{asm.title}</h3>
            <p className="asm-desc">{asm.instructions}</p>
            
            <div className="asm-footer">
              <span className="due-date">🕒 Due: {asm.dueDate}</span>
              {asm.status === 'Pending' && submittingId !== asm.id && (
                <button className="submit-btn" onClick={() => setSubmittingId(asm.id)}>
                  Submit Work
                </button>
              )}
            </div>

            {submittingId === asm.id && (
              <div className="submission-form">
                <div className="file-input-wrapper">
                  <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>📁</div>
                  <div style={{ fontSize: '0.9rem' }}>Drop your PDF or Image here</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '5px' }}>Max size: 5MB</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button className="submit-btn" onClick={() => handleFinishSubmit(asm.id)} style={{ flex: 1 }}>
                    Final Submission
                  </button>
                  <button className="submit-btn" onClick={() => setSubmittingId(null)} style={{ background: '#ef4444' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {asm.status === 'Submitted' && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', fontSize: '0.85rem' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '5px' }}>Teacher Feedback:</div>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  "Great work! Your methodology is sound. Looking forward to more such submissions."
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments;
