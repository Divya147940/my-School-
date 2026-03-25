import React, { useState } from 'react';
import GamificationEngine from '../../utils/GamificationEngine';

const Exams = () => {
  const [selectedExam, setSelectedExam] = useState('Unit Test 1');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [isSaving, setIsSaving] = useState(false);
  
  const [marksData, setMarksData] = useState([
    { id: 1, name: 'Aman Gupta', roll: 'S101', marks: 45, total: 50 },
    { id: 2, name: 'Priya Singh', roll: 'S102', marks: 48, total: 50 },
    { id: 3, name: 'Rohan Verma', roll: 'S103', marks: 38, total: 50 },
  ]);

  const calculateGrade = (marks, total) => {
    const p = (marks / total) * 100;
    if (p >= 90) return { label: 'A+', color: '#10b981', remark: 'Outstanding' };
    if (p >= 75) return { label: 'A', color: '#3b82f6', remark: 'Excellent' };
    if (p >= 60) return { label: 'B', color: '#f59e0b', remark: 'Good' };
    if (p >= 40) return { label: 'C', color: '#94a3b8', remark: 'Average' };
    return { label: 'F', color: '#ef4444', remark: 'Needs Focus' };
  };

  const handleMarkChange = (id, newMarks) => {
    const m = parseInt(newMarks) || 0;
    setMarksData(prev => prev.map(student => {
      if (student.id === id) {
        if (m > student.total) {
            alert(`Error: Marks cannot exceed Max Marks (${student.total})`);
            return student;
        }
        return { ...student, marks: m };
      }
      return student;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
        // Award XP to students with Grade A or A+
        marksData.forEach(student => {
            const grade = calculateGrade(student.marks, student.total);
            if (grade.label === 'A+') GamificationEngine.addXP(500, `Academic Excellence: ${selectedExam}`);
            else if (grade.label === 'A') GamificationEngine.addXP(200, `High Achievement: ${selectedExam}`);
        });

        // mockApi.publishResults({ ...
        setIsSaving(false);
        alert("Results Published! Academic XP awarded to the toppers.");
    }, 1500);
  };

  return (
    <div className="exams-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
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
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '5px 15px', borderRadius: '20px' }}>
              👤 Logged in as: Professor Divyanshi (Class Teacher)
          </div>
      </div>

      <div style={{ background: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: '20px' }}>Roll No</th>
              <th style={{ padding: '20px' }}>Student Name</th>
              <th style={{ padding: '20px' }}>Marks Obtained</th>
              <th style={{ padding: '20px' }}>Gr./Percentage</th>
              <th style={{ padding: '20px' }}>Status/Remark</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((student) => {
              const grade = calculateGrade(student.marks, student.total);
              return (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.3s' }} className="row-hover">
                  <td style={{ padding: '20px', fontWeight: '800' }}>#{student.roll}</td>
                  <td style={{ padding: '20px' }}>{student.name}</td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="number" 
                          value={student.marks} 
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          style={{ width: '70px', padding: '10px', borderRadius: '10px', background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', textAlign: 'center' }}
                        />
                        <span style={{ opacity: 0.5 }}>/ {student.total}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '900', color: grade.color }}>{grade.label}</span>
                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{((student.marks / student.total) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ 
                        padding: '5px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '800',
                        background: `${grade.color}20`,
                        color: grade.color,
                        border: `1px solid ${grade.color}40`
                    }}>
                        {grade.remark}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button 
        onClick={handleSave}
        disabled={isSaving}
        style={{ 
            marginTop: '25px', 
            padding: '16px 40px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, #a855f7, #7c3aed)', 
            color: '#fff', 
            border: 'none', 
            fontWeight: '900', 
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(168, 85, 247, 0.3)',
            transition: 'all 0.3s'
        }}
      >
        {isSaving ? '⏳ Publishing Results...' : '🚀 Publish Marks & Notify Parents'}
      </button>

      <p style={{ marginTop: '15px', color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          ℹ️ Saving will automatically award XP to toppers and alert parents on WhatsApp/Portal.
      </p>
    </div>
  );
};

export default Exams;
