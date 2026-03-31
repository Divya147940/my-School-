import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

// All possible classes in the school
const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  '9B', '10A', '10B', '12C', 'AI Class', 'Class 10-A', 'Class 9-B'
];

const AdminStudentDirectory = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);

  useEffect(() => {
    // Load students from mockApi + any locally generated ones
    const registryStudents = mockApi.getStudents();

    // Also include teacher-attendance system students (from Attendance.jsx)
    const teacherMap = [
      { id: 1, name: 'Divyanshi Verma', class: 'AI Class' },
      { id: 2, name: 'Rahul Sharma', class: 'Class 10-A' },
      { id: 3, name: 'Priya Singh', class: 'Class 9-B' },
    ];

    const generatedStudents = [];
    teacherMap.forEach(teacher => {
      for (let i = 1; i <= 40; i++) {
        const baseId = teacher.id * 1000;
        generatedStudents.push({
          id: `GEN-${baseId + i}`,
          name: `Student ${baseId + i}`,
          class: teacher.class,
          rollNo: i,
          parentName: '-',
          contact: '-',
          source: 'attendance'
        });
      }
    });

    // Merge — registry students take priority, generated fill in the rest
    const merged = [
      ...registryStudents.map(s => ({ ...s, source: 'registry' })),
      ...generatedStudents.filter(gs =>
        !registryStudents.some(rs => rs.name === gs.name && rs.class === gs.class)
      )
    ];

    setAllStudents(merged);

    // Compute unique classes
    const classes = [...new Set(merged.map(s => s.class).filter(Boolean))].sort();
    setAvailableClasses(classes);
  }, []);

  const filteredStudents = allStudents.filter(s => {
    const matchClass = !selectedClass || s.class === selectedClass;
    const matchSearch = !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.id && s.id.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    return matchClass && matchSearch;
  });

  const classCounts = availableClasses.reduce((acc, cls) => {
    acc[cls] = allStudents.filter(s => s.class === cls).length;
    return acc;
  }, {});

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px'
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
          🎓 Student Directory
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Class-wise view of all enrolled students — Total: <strong style={{ color: '#3b82f6' }}>{allStudents.length}</strong>
        </p>
      </div>

      {/* Class Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <div
          onClick={() => setSelectedClass('')}
          style={{
            ...cardStyle,
            marginBottom: 0,
            cursor: 'pointer',
            border: !selectedClass ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
            background: !selectedClass ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#3b82f6' }}>{allStudents.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>All Classes</div>
        </div>
        {availableClasses.map(cls => (
          <div
            key={cls}
            onClick={() => setSelectedClass(cls)}
            style={{
              ...cardStyle,
              marginBottom: 0,
              cursor: 'pointer',
              border: selectedClass === cls ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              background: selectedClass === cls ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#10b981' }}>{classCounts[cls]}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{cls}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by name or ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />
        <select
          value={selectedClass}
          onChange={e => setSelectedClass(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">All Classes</option>
          {availableClasses.map(cls => (
            <option key={cls} value={cls}>{cls} ({classCounts[cls]})</option>
          ))}
        </select>
      </div>

      {/* Results Count */}
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '16px' }}>
        Showing <strong style={{ color: '#f8fafc' }}>{filteredStudents.length}</strong> student{filteredStudents.length !== 1 ? 's' : ''}
        {selectedClass ? ` in ${selectedClass}` : ''}
      </p>

      {/* Student Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Roll No.</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Student ID</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Name</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Class</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Parent / Guardian</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map((s, idx) => (
              <tr
                key={s.id || idx}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{s.rollNo || idx + 1}</td>
                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {s.id}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: `hsl(${(s.name.charCodeAt(0) * 40) % 360}, 60%, 35%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: '800', color: '#fff', flexShrink: 0
                    }}>
                      {s.name.charAt(0)}
                    </div>
                    {s.name}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700',
                    background: 'rgba(59,130,246,0.12)', color: '#3b82f6',
                    border: '1px solid rgba(59,130,246,0.25)'
                  }}>
                    {s.class || '-'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.parentName || '-'}</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.contact || '-'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
                  No students found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStudentDirectory;
