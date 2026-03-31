import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const LeaveApprovals = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(mockApi.getLeaves());
  }, []);

  const handleAction = (id, action) => {
    mockApi.updateLeaveStatus(id, action);
    setRequests(mockApi.getLeaves());
  };

  return (
    <div className="leave-approvals">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {requests.map(req => (
          <div key={req.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold', color: '#f43f5e' }}>{req.name}</span>
              <span className={`badge ${req.status === 'Approved' ? 'badge-paid' : 'badge-pending'}`}>{req.status}</span>
            </div>
            <div style={{ fontSize: '0.9rem', marginBottom: '10px' }}>
              <div><b>Type:</b> {req.type} | <b>Period:</b> {req.duration}</div>
              <p style={{ opacity: 0.7, marginTop: '10px' }}>{req.reason}</p>
            </div>
            
            {req.status === 'Pending' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  onClick={() => handleAction(req.id, 'Approved')}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'Rejected')}
                  style={{ flex: 1, padding: '8px', borderRadius: '10px', background: '#f43f5e', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApprovals;
