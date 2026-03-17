import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';

const Attendance = () => {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: 'Aman Gupta', roll: 'S101', status: 'Present' },
    { id: 2, name: 'Priya Singh', roll: 'S102', status: 'Absent' },
    { id: 3, name: 'Rohan Verma', roll: 'S103', status: 'Present' },
    { id: 4, name: 'Sanya Khan', roll: 'S104', status: 'Present' },
  ]);

  const toggleStatus = (id) => {
    setAttendanceData(prev => prev.map(student => {
      if (student.id === id) {
        const nextStatus = student.status === 'Present' ? 'Absent' : student.status === 'Absent' ? 'Late' : 'Present';
        return { ...student, status: nextStatus };
      }
      return student;
    }));
  };

  const handleSaveAttendance = () => {
    attendanceData.forEach(student => {
      mockApi.markAttendance(student.name, date, student.status);
    });
    alert(`Attendance for ${selectedClass} on ${date} saved successfully!`);
  };

  const statusColors = {
    Present: '#10b981',
    Absent: '#ef4444',
    Late: '#f59e0b'
  };

  return (
    <div className="attendance-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option>Class 10</option>
            <option>Class 9</option>
            <option>Class 8</option>
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
            {attendanceData.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px' }}>{student.roll}</td>
                <td style={{ padding: '15px 20px' }}>{student.name}</td>
                <td style={{ padding: '15px 20px' }}>
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
                </td>
                <td style={{ padding: '15px 20px' }}>
                  <button 
                    onClick={() => toggleStatus(student.id)}
                    style={{ padding: '6px 15px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Change
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
