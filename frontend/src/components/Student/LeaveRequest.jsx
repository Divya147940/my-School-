import React, { useState, useEffect } from 'react';

const LeaveRequest = ({ user }) => {
    const [leaveData, setLeaveData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [myRequests, setMyRequests] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const savedRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
        setMyRequests(savedRequests.filter(r => r.studentId === user.id));
    }, [user.id]);

    const handleApply = (e) => {
        e.preventDefault();
        if (!leaveData.startDate || !leaveData.endDate || !leaveData.reason) {
            setStatusMessage('❌ Please fill all fields!');
            return;
        }

        const newRequest = {
            id: Date.now(),
            studentId: user.id,
            studentName: user.name,
            class: user.class,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
            reason: leaveData.reason,
            status: 'Pending',
            appliedAt: new Date().toLocaleDateString()
        };

        const allRequests = JSON.parse(localStorage.getItem('leave_requests') || '[]');
        const updatedRequests = [newRequest, ...allRequests];
        localStorage.setItem('leave_requests', JSON.stringify(updatedRequests));
        
        setMyRequests(prev => [newRequest, ...prev]);
        setLeaveData({ startDate: '', endDate: '', reason: '' });
        setStatusMessage('✅ Leave applied successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
    };

    return (
        <div style={{ padding: '20px', color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                📅 Chutti ki Urzi (Leave Request)
            </h2>

            <form onSubmit={handleApply} style={{ display: 'grid', gap: '15px', maxWidth: '500px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Kab se? (Start Date)</label>
                        <input 
                            type="date" 
                            value={leaveData.startDate}
                            onChange={(e) => setLeaveData({...leaveData, startDate: e.target.value})}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Kab tak? (End Date)</label>
                        <input 
                            type="date" 
                            value={leaveData.endDate}
                            onChange={(e) => setLeaveData({...leaveData, endDate: e.target.value})}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff' }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Vajh? (Reason)</label>
                    <textarea 
                        rows="3"
                        placeholder="Bimari, Shaadi, etc."
                        value={leaveData.reason}
                        onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: '#fff' }}
                    />
                </div>
                <button 
                    type="submit"
                    style={{ padding: '12px', background: '#6366f1', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Apply Karo 📝
                </button>
            </form>

            {statusMessage && <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>{statusMessage}</div>}

            <h3 style={{ marginBottom: '15px' }}>Meri Chuttiyan (My Requests)</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
                {myRequests.length === 0 ? (
                    <p style={{ color: '#888' }}>Koi request nahi hai.</p>
                ) : (
                    myRequests.map(req => (
                        <div key={req.id} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{req.startDate} se {req.endDate}</div>
                                <div style={{ fontSize: '0.85rem', color: '#aaa' }}>Vajh: {req.reason}</div>
                            </div>
                            <div style={{ 
                                padding: '5px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                background: req.status === 'Approved' ? '#10b981' : req.status === 'Rejected' ? '#ef4444' : '#f59e0b'
                            }}>
                                {req.status}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeaveRequest;
