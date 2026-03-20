import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('10A');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    setLoading(true);
    const db = mockApi.getDB();
    const students = db.studentRegistry
      .filter(s => s.class === selectedClass)
      .map(s => ({
        id: s.id,
        name: s.name,
        roll: s.rollNo,
        status: null
      }));
    
    // Merge with existing attendance if any for this date
    const attendanceLogs = db.attendanceHub.filter(a => a.class === selectedClass);
    // Note: In a real app we'd filter by date too, but here we'll just initialize with registry
    
    setAttendanceData(students);
    setLoading(false);
  }, [selectedClass]);

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
    alert(`Attendance for ${selectedClass} on ${date} saved successfully!`);
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
        <button 
          onClick={handleSaveAttendance}
          style={{ padding: '10px 25px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Save Attendance
        </button>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Roll No</th>
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
                  <td style={{ padding: '15px 20px' }}>{student.roll}</td>
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
