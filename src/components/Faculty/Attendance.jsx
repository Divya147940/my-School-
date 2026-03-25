import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';
import { useAuth } from '../../context/AuthContext';

const Attendance = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(user?.assignedClass || '10A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [view, setView] = useState('register'); // 'register' or 'leaves'

  const refreshData = () => {
    setLoading(true);
    const db = mockApi.getDB();
    const attendanceLogs = (db.attendanceHub || []).filter(a => a.class === selectedClass);
    
    const students = db.studentRegistry
      .filter(s => s.class === selectedClass)
      .map(s => {
        const attRecord = attendanceLogs.find(a => a.studentName === s.name);
        return {
          id: s.id,
          name: s.name,
          roll: s.rollNo,
          status: attRecord && attRecord.status !== 'Pending' ? attRecord.status : null
        };
      });
    
    setAttendanceData(students);
    
    // Load Leave Requests
    const allLeaves = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    setLeaveRequests(allLeaves.filter(l => l.class === selectedClass));
    
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [selectedClass]);

  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  const setStatus = (id, status) => {
    const student = attendanceData.find(s => s.id === id);
    mockApi.logAudit('ATTENDANCE_CHANGE', `Manual attendance update for ${student?.name}`, 'Faculty', { studentId: id, status });
    setAttendanceData(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    addToast(`${student?.name} marked as ${status}`, "success");
  };

  const handleQRVerify = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
        const isAtSchool = true;
        if (isAtSchool) {
            addToast("Face Recognition: IDENTITY MATCHED 👤✅", "success");
            addToast("Location Verified: WITHIN SCHOOL BOUNDS 🟢", "success");
            mockApi.logAudit('BIOMETRIC_VERIFY', 'Faculty biometric facial verification successful.', 'Faculty', { method: 'AI_FACE_MATCH' });
            setIsBiometricScanning(false);
        } else {
            addToast("Identity Warning: NO MATCH 🔴", "error");
            setIsBiometricScanning(false);
        }
    }, 2500);
  };

  const handleSaveAttendance = () => {
    attendanceData.forEach(student => {
      mockApi.markAttendanceHub(student.name, student.status);
      if (student.status === 'Absent') {
          console.log(`[SIMULATED SMS] To Parent of ${student.name}: Aapka bacha aaj school nahi aaya hai.`);
      }
    });
    addToast(`Attendance for ${selectedClass} saved. Absent parents notified! 📱`, "success");
  };

  const handleLeaveAction = (id, action) => {
    const allLeaves = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    const updated = allLeaves.map(l => l.id === id ? { ...l, status: action } : l);
    localStorage.setItem('leave_requests', JSON.stringify(updated));
    setLeaveRequests(updated.filter(l => l.class === selectedClass));
    addToast(`Leave request ${action.toLowerCase()}!`, "info");
  };

  const statusColors = {
    Present: '#10b981',
    Absent: '#ef4444',
    Late: '#f59e0b',
    Leave: '#8b5cf6'
  };

  const uniqueClasses = [...new Set(mockApi.getDB().studentRegistry.map(s => s.class))];

  return (
    <div className="attendance-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '5px' }}>
            <button 
                onClick={() => setView('register')}
                style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: view === 'register' ? '#3b82f6' : 'transparent', color: '#fff', cursor: 'pointer' }}
            > Register </button>
            <button 
                onClick={() => setView('leaves')}
                style={{ padding: '8px 15px', borderRadius: '8px', border: 'none', background: view === 'leaves' ? '#8b5cf6' : 'transparent', color: '#fff', cursor: 'pointer', position: 'relative' }}
            > 
                Leaves 
                {leaveRequests.filter(l => l.status === 'Pending').length > 0 && 
                    <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '10px' }}>
                        {leaveRequests.filter(l => l.status === 'Pending').length}
                    </span>
                }
            </button>
          </div>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        {view === 'register' && (
            <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                onClick={() => { if(window.confirm("Reset list?")) setAttendanceData(prev => prev.map(s => ({...s, status: null }))) }}
                style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 'bold', cursor: 'pointer' }}
                > Reset </button>
                <button 
                onClick={handleSaveAttendance}
                style={{ padding: '10px 25px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                > Save & Notify 📱 </button>
            </div>
        )}
      </div>

      {view === 'register' ? (
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { if(window.confirm("Mark everyone as Present?")) setAttendanceData(prev => prev.map(s => ({...s, status: 'Present' }))) }} style={{ padding: '8px 15px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>🙌 Mark All Present</button>
                    <button onClick={() => { if(window.confirm("Mark as Holiday?")) setAttendanceData(prev => prev.map(s => ({...s, status: 'Holiday' }))) }} style={{ padding: '8px 15px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: '1px solid rgba(139, 92, 246, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}>🎉 Mark Holiday</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <select className="premium-input-mini" style={{ width: '150px' }}>
                        <option>Current Subject: Math</option>
                        <option>Science</option>
                        <option>English</option>
                    </select>
                    <button onClick={handleQRVerify} style={{ padding: '8px 15px', borderRadius: '10px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📡 VERIFY QR SCAN</button>
                </div>
            </div>

            {isBiometricScanning && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '250px', height: '250px', border: '2px solid var(--accent-blue)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
                        <div className="scan-line" style={{ width: '100%', height: '2px', background: 'var(--accent-blue)', position: 'absolute', top: 0, left: 0, boxShadow: '0 0 15px var(--accent-blue)', animation: 'scan 2s linear infinite' }}></div>
                        <div style={{ fontSize: '5rem', textAlign: 'center', marginTop: '70px', opacity: 0.5 }}>👤</div>
                    </div>
                    <h3 style={{ marginTop: '20px', color: '#fff', letterSpacing: '2px' }}>ANALYZING FACIAL BIOMETRICS...</h3>
                    <p style={{ color: 'var(--accent-blue)', fontSize: '0.8rem' }}>DO NOT CLOSE THIS WINDOW</p>
                    <style>{`
                        @keyframes scan {
                            0% { top: 0; }
                            50% { top: 100%; }
                            100% { top: 0; }
                        }
                    `}</style>
                </div>
            )}

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '15px 20px' }}>Roll</th>
                <th style={{ padding: '15px 20px' }}>Student Name</th>
                <th style={{ padding: '15px 20px' }}>Attendance %</th>
                <th style={{ padding: '15px 20px' }}>Status</th>
                <th style={{ padding: '15px 20px' }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading...</td></tr>
                ) : (
                attendanceData.map((student) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: (student.attendance || 85) < 75 ? 'rgba(244, 63, 94, 0.02)' : 'transparent' }}>
                    <td style={{ padding: '15px 20px' }}>{student.roll || student.id.slice(-3)}</td>
                    <td style={{ padding: '15px 20px' }}>
                        <div>{student.name}</div>
                        <small style={{ color: (student.attendance || 85) < 75 ? '#f43f5e' : 'var(--text-secondary)' }}>
                           {(student.attendance || 85) < 75 ? '🔥 High Absences' : '✅ Consistent'}
                        </small>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                        <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${student.attendance || 85}%`, height: '100%', background: (student.attendance || 85) < 75 ? '#f43f5e' : '#10b981' }}></div>
                        </div>
                        <span style={{ fontSize: '0.7rem' }}>{student.attendance || 85}%</span>
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                        {student.status && (
                        <span style={{ 
                            padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', 
                            background: `${statusColors[student.status] || '#666'}20`, color: statusColors[student.status] || '#666', fontWeight: 'bold'
                        }}> {student.status} </span>
                        )}
                    </td>
                    <td style={{ padding: '15px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                        {['Present', 'Absent', 'Late'].map(s => (
                            <button 
                                key={s}
                                onClick={() => setStatus(student.id, s)}
                                style={{ 
                                    padding: '6px 12px', borderRadius: '8px', 
                                    background: student.status === s ? statusColors[s] : 'rgba(255,255,255,0.05)', 
                                    color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem'
                                }}
                            > {s} </button>
                        ))}
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '15px' }}>
            {leaveRequests.length === 0 ? <p>No leave requests for this class.</p> : 
                leaveRequests.map(req => (
                    <div key={req.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{req.studentName} (Roll: {req.studentRoll})</div>
                            <div style={{ color: '#8b5cf6', fontWeight: 'bold', margin: '5px 0' }}>{req.startDate} se {req.endDate} ({req.type})</div>
                            <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Vajh: {req.reason}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {req.status === 'Pending' ? (
                                <>
                                    <button onClick={() => handleLeaveAction(req.id, 'Approved')} style={{ padding: '10px 20px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Approve ✅</button>
                                    <button onClick={() => handleLeaveAction(req.id, 'Rejected')} style={{ padding: '10px 20px', borderRadius: '10px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Reject ❌</button>
                                </>
                            ) : (
                                <span style={{ padding: '8px 15px', borderRadius: '20px', background: req.status === 'Approved' ? '#10b98120' : '#ef444420', color: req.status === 'Approved' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{req.status}</span>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
      )}
    </div>
  );
};

export default Attendance;

