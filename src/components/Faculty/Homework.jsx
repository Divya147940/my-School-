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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Active Assignments</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 25px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ Create New Assignment'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '20px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Assignment Title</label>
              <input 
                required 
                value={newAssignment.title} 
                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Subject</label>
              <input 
                required 
                value={newAssignment.subject} 
                onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Class</label>
              <select 
                value={newAssignment.class} 
                onChange={e => setNewAssignment({...newAssignment, class: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option>Class 10</option>
                <option>Class 9</option>
                <option>Class 8</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Due Date</label>
              <input 
                type="date" 
                required 
                value={newAssignment.dueDate} 
                onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              />
            </div>
          </div>
          <button type="submit" style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold' }}>
            Publish Assignment
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {assignments.map(asm => (
          <div key={asm.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.8rem', background: '#60a5fa20', color: '#60a5fa', padding: '4px 10px', borderRadius: '10px' }}>{asm.subject}</span>
              <span style={{ fontSize: '0.8rem', background: asm.status === 'Active' ? '#10b98120' : '#ef444420', color: asm.status === 'Active' ? '#10b981' : '#ef4444', padding: '4px 10px', borderRadius: '10px' }}>{asm.status}</span>
            </div>
            <h4 style={{ margin: '0 0 10px 0' }}>{asm.title}</h4>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span>Target: {asm.class}</span>
              <span>Due: {asm.dueDate}</span>
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>View Submissions</button>
              <button style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homework;
