import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const Homework = () => {
  const [showForm, setShowForm] = useState(false);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    setAssignments(mockApi.getAssignments());
  }, []);

  const [newAssignment, setNewAssignment] = useState({ title: '', class: 'Class 10', subject: '', dueDate: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const asm = { ...newAssignment, status: 'Active' };
    mockApi.addAssignment(asm);
    setAssignments(mockApi.getAssignments());
    setShowForm(false);
    setNewAssignment({ title: '', class: 'Class 10', subject: '', dueDate: '' });
  };

  return (
    <div className="homework-module">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h3 className="section-title" style={{ margin: 0 }}>Active Assignments</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="glass-panel"
          style={{ padding: '12px 25px', borderRadius: '14px', background: showForm ? '#ef444420' : '#10b98120', color: showForm ? '#ef4444' : '#10b981', border: '1px solid var(--glass-border)', fontWeight: '800', cursor: 'pointer', transition: '0.3s' }}
        >
          {showForm ? 'Cancel' : '+ Create New Assignment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '30px', borderRadius: '24px', marginBottom: '40px', background: 'var(--glass-bg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assignment Title</label>
              <input 
                required 
                placeholder="e.g. Physics Lab Report"
                value={newAssignment.title} 
                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Subject</label>
              <input 
                required 
                placeholder="Physics"
                value={newAssignment.subject} 
                onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Class</label>
              <select 
                value={newAssignment.class} 
                onChange={e => setNewAssignment({...newAssignment, class: e.target.value})}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              >
                <option>Class 10A</option>
                <option>Class 9B</option>
                <option>Class 8C</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Due Date</label>
              <input 
                type="date" 
                required 
                value={newAssignment.dueDate} 
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '30px', width: '100%', padding: '15px', borderRadius: '14px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
            Publish Assignment
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
        {assignments.map(asm => (
          <div key={asm.id} className="glass-panel card-vibe" style={{ padding: '25px', borderRadius: '24px', background: 'var(--glass-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '6px 14px', borderRadius: '10px', textTransform: 'uppercase' }}>{asm.subject}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', background: asm.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: asm.status === 'Active' ? '#10b981' : '#ef4444', padding: '6px 14px', borderRadius: '10px' }}>{asm.status}</span>
            </div>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '800' }}>{asm.title}</h4>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '500' }}>
              <span>Target: {asm.class}</span>
              <span>Due: {asm.dueDate}</span>
            </div>
            <div style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
              <button style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', fontWeight: '700', cursor: 'pointer' }}>View Submissions</button>
              <button style={{ width: '45px', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homework;
