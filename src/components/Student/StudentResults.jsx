import React from 'react';

const StudentResults = () => {
  const results = [
    { subject: 'Mathematics', marks: 48, total: 50, grade: 'A+' },
    { subject: 'Science', marks: 42, total: 50, grade: 'A' },
    { subject: 'English', marks: 45, total: 50, grade: 'A+' },
    { subject: 'Hindi', marks: 40, total: 50, grade: 'B+' },
  ];

  return (
    <div className="student-results">
      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Subject</th>
              <th style={{ padding: '15px 20px' }}>Marks Obtained</th>
              <th style={{ padding: '15px 20px' }}>Total Marks</th>
              <th style={{ padding: '15px 20px' }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res, index) => (
              <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '15px 20px' }}>{res.subject}</td>
                <td style={{ padding: '15px 20px' }}>{res.marks}</td>
                <td style={{ padding: '15px 20px' }}>{res.total}</td>
                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#60a5fa' }}>{res.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', padding: '25px', borderRadius: '20px', background: 'linear-gradient(to right, rgba(96, 165, 250, 0.1), rgba(168, 85, 247, 0.1))', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Final Assessment Summary</h3>
        <p style={{ color: '#94a3b8' }}>Excellent performance this term. Keep up the good work in Mathematics and Science.</p>
        <div style={{ display: 'flex', gap: '30px', marginTop: '15px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>87.5%</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Percentage</div>
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>A</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Overall Grade</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
