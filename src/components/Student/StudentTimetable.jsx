import React from 'react';

const StudentTimetable = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const periods = [
    { time: '09:00', subject: 'Mathematics', teacher: 'Mr. Verma' },
    { time: '10:00', subject: 'Science', teacher: 'Mrs. Sharma' },
    { time: '11:00', subject: 'Break', isBreak: true },
    { time: '11:15', subject: 'English', teacher: 'Mr. Gupta' },
    { time: '12:15', subject: 'Social Science', teacher: 'Ms. Singh' },
  ];

  return (
    <div className="student-timetable">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
        {days.map(day => (
          <button key={day} style={{ 
            padding: '10px 20px', 
            borderRadius: '10px', 
            background: day === 'Mon' ? '#3b82f6' : 'rgba(255,255,255,0.05)', 
            color: '#fff', 
            border: 'none',
            cursor: 'pointer',
            minWidth: '80px'
          }}>{day}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {periods.map((p, idx) => (
          <div key={idx} style={{ 
            background: p.isBreak ? 'rgba(239, 68, 68, 0.05)' : 'rgba(30, 41, 59, 0.5)', 
            padding: '20px', 
            borderRadius: '15px', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ minWidth: '80px', fontWeight: 'bold', color: '#60a5fa' }}>{p.time}</div>
            <div style={{ height: '40px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{p.subject}</div>
              {!p.isBreak && <div style={{ fontSize: '0.85rem', opacity: 0.6 }}>{p.teacher}</div>}
            </div>
            {p.isBreak && <div style={{ marginLeft: 'auto', fontSize: '1.2rem' }}>☕</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTimetable;
