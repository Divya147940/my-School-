import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const StudentAttendance = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  useEffect(() => {
    setAttendanceHistory(mockApi.getAttendance('Aman Gupta'));
  }, []);

  const stats = {
    totalClasses: 120,
    present: attendanceHistory.filter(a => a.status === 'Present').length + 110,
    absent: attendanceHistory.filter(a => a.status === 'Absent').length + 5,
    get percentage() { return Math.round((this.present / (this.present + this.absent)) * 100) + '%' }
  };

  return (
    <div className="student-attendance">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(59, 130, 246, 0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>{stats.percentage}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Attendance</div>
        </div>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{stats.present}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Days Present</div>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(239, 68, 68, 0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.absent}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Days Absent</div>
        </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Date</th>
              <th style={{ padding: '15px 20px' }}>Day</th>
              <th style={{ padding: '15px 20px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map((row, index) => (
              <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '15px 20px' }}>{row.date}</td>
                <td style={{ padding: '15px 20px' }}>{new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                <td style={{ padding: '15px 20px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '10px', 
                    fontSize: '0.8rem', 
                    background: row.status === 'Present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', 
                    color: row.status === 'Present' ? '#10b981' : '#ef4444' 
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
