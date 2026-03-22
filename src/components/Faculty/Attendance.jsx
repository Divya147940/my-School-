import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const Attendance = () => {
  const { addToast } = useToast();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
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
    setLoading(false);
  }, [selectedClass]);

  React.useEffect(() => {
    const handleUpdate = (e) => {
      const { studentName, status } = e.detail;
      setAttendanceData(prev => prev.map(student => {
        if (student.name === studentName) {
          return { ...student, status };
        }
        return student;
      }));
    };
    window.addEventListener('attendanceUpdate', handleUpdate);
    return () => window.removeEventListener('attendanceUpdate', handleUpdate);
  }, []);

  const setStatus = (id, newStatus) => {
    setAttendanceData(prev => prev.map(student => {
      if (student.id === id) {
        return { ...student, status: newStatus };
      }
      return student;
    }));
  };

  const handleSaveAttendance = () => {
    attendanceData.forEach(student => {
      mockApi.markAttendanceHub(student.name, student.status);
    });
    addToast(`Attendance for ${selectedClass} saved.`, "success");
  };

  const handleResetAttendance = () => {
    if (window.confirm("Clear today's register for this class?")) {
      setAttendanceData(prev => prev.map(s => ({ ...s, status: null })));
    }
  };

  const statusColors = {
    Present: '#10b981',
    Absent: '#ef4444',
    Late: '#f59e0b'
  };

  const uniqueClasses = [...new Set(mockApi.getDB().studentRegistry.map(s => s.class))];

  return (
    <div className="attendance-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleResetAttendance}
            style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Reset
          </button>
          <button 
            onClick={handleSaveAttendance}
            style={{ padding: '10px 25px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Save Attendance
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Student ID</th>
              <th style={{ padding: '15px 20px' }}>Student Name</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
              <th style={{ padding: '15px 20px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>Loading students...</td></tr>
            ) : attendanceData.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No students found in this class.</td></tr>
            ) : (
              attendanceData.map((student) => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '15px 20px' }}>{student.id}</td>
                  <td style={{ padding: '15px 20px' }}>{student.name}</td>
                  <td style={{ padding: '15px 20px' }}>
                    {student.status && (
                      <span style={{ 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.85rem', 
                        background: `${statusColors[student.status]}20`, 
                        color: statusColors[student.status],
                        fontWeight: 'bold'
                      }}>
                        {student.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => setStatus(student.id, 'Present')}
                        style={{ 
                          padding: '6px 15px', 
                          borderRadius: '8px', 
                          background: student.status === 'Present' ? '#10b981' : 'rgba(255,255,255,0.05)', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: student.status === 'Present' ? 'bold' : 'normal',
                          transition: 'all 0.2s'
                        }}
                      >
                        Present
                      </button>
                      <button 
                        onClick={() => setStatus(student.id, 'Absent')}
                        style={{ 
                          padding: '6px 15px', 
                          borderRadius: '8px', 
                          background: student.status === 'Absent' ? '#ef4444' : 'rgba(255,255,255,0.05)', 
                          color: '#fff', 
                          border: 'none', 
                          cursor: 'pointer', 
                          fontSize: '0.85rem',
                          fontWeight: student.status === 'Absent' ? 'bold' : 'normal',
                          transition: 'all 0.2s'
                        }}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
