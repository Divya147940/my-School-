import React, { useState } from 'react';

const Exams = () => {
  const [selectedExam, setSelectedExam] = useState('Unit Test 1');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  
  const [marksData, setMarksData] = useState([
    { id: 1, name: 'Aman Gupta', roll: 'S101', marks: 45, total: 50 },
    { id: 2, name: 'Priya Singh', roll: 'S102', marks: 48, total: 50 },
    { id: 3, name: 'Rohan Verma', roll: 'S103', marks: 38, total: 50 },
  ]);

  const handleMarkChange = (id, newMarks) => {
    setMarksData(prev => prev.map(student => 
      student.id === id ? { ...student, marks: newMarks } : student
    ));
  };

  return (
    <div className="exams-module">
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <select 
          value={selectedExam} 
          onChange={(e) => setSelectedExam(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option>Unit Test 1</option>
          <option>Half Yearly</option>
          <option>Final Exam</option>
        </select>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <option>Class 10</option>
          <option>Class 9</option>
          <option>Class 8</option>
        </select>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '15px 20px' }}>Roll No</th>
              <th style={{ padding: '15px 20px' }}>Student Name</th>
              <th style={{ padding: '15px 20px' }}>Marks Obtained</th>
              <th style={{ padding: '15px 20px' }}>Max Marks</th>
              <th style={{ padding: '15px 20px' }}>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 20px' }}>{student.roll}</td>
                <td style={{ padding: '15px 20px' }}>{student.name}</td>
                <td style={{ padding: '15px 20px' }}>
                  <input 
                    type="number" 
                    value={student.marks} 
                    onChange={(e) => handleMarkChange(student.id, e.target.value)}
                    style={{ width: '80px', padding: '8px', borderRadius: '8px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </td>
                <td style={{ padding: '15px 20px' }}>{student.total}</td>
                <td style={{ padding: '15px 20px', fontWeight: 'bold', color: '#60a5fa' }}>
                  {((student.marks / student.total) * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button style={{ marginTop: '25px', padding: '12px 30px', borderRadius: '12px', background: '#a855f7', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
        Save Marks Entry
      </button>
    </div>
  );
};

export default Exams;
