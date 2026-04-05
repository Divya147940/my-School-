import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { useToast } from '../Common/Toaster';

// All possible classes in the school
const ALL_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  '9B', '10A', '10B', '12C', 'AI Class', 'Class 10-A', 'Class 9-B'
];

const AdminStudentDirectory = () => {
  const { secureApi } = useAuth();
  const { addToast } = useToast();
  const [allStudents, setAllStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await secureApi(`${API_URL}/api/students`);
      if (res.ok) {
        const data = await res.json();
        setAllStudents(data);
        
        // Compute unique classes
        const classes = [...new Set(data.map(s => s.class).filter(Boolean))].sort();
        setAvailableClasses(classes);
      }
    } catch (e) {
      console.error("Fetch failed", e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [secureApi]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this student record permanently?")) {
      try {
        const res = await secureApi(`${API_URL}/api/students/${id}`, { method: 'DELETE' });
        if (res.ok) {
          addToast("Student removed from database.", "success");
          fetchStudents();
        }
      } catch (e) {
        addToast("Failed to delete student.", "error");
      }
    }
  };

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
              <th style={{ padding: '14px 16px', textAlign: 'left', color: '#94a3b8', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>Action</th>
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
                <td style={{ padding: '14px 16px', color: '#64748b' }}>{s.roll_no || idx + 1}</td>
                <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {s.unique_id || s.id}
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
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.parent_name || s.parentName || '-'}</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{s.phone || s.contact || '-'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}
                  >🗑️</button>
                </td>
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
