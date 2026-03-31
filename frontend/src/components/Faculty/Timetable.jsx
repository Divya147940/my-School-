import React from 'react';

const Timetable = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [
    { time: '09:00 - 10:00', label: 'Period 1' },
    { time: '10:00 - 11:00', label: 'Period 2' },
    { time: '11:00 - 11:15', label: 'Break', isBreak: true },
    { time: '11:15 - 12:15', label: 'Period 3' },
    { time: '12:15 - 01:15', label: 'Period 4' },
  ];

  const schedule = {
    'Monday': { 1: 'Class 10 (Math)', 2: 'Class 9 (Science)', 3: 'Class 10 (Math)', 4: 'Free' },
    'Tuesday': { 1: 'Class 9 (Science)', 2: 'Class 10 (Math)', 3: 'Class 8 (ICT)', 4: 'Class 9 (Science)' },
    // Simplified for demo
  };

  return (
    <div className="timetable-module">
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>Time / Day</th>
              {days.map(day => (
                <th key={day} style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, pIdx) => (
              <tr key={pIdx}>
                <td style={{ padding: '15px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold' }}>{period.label}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{period.time}</div>
                </td>
                {days.map(day => (
                  <td key={day} style={{ 
                    padding: '15px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    textAlign: 'center',
                    background: period.isBreak ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                  }}>
                    {period.isBreak ? '☕' : (schedule[day]?.[pIdx + 1] || '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;
