import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const DigitalDiary = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(mockApi.getDiary());
  }, []);

  const [newEntry, setNewEntry] = useState({ topic: '', progress: 50, remarks: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    mockApi.addDiaryEntry(newEntry);
    setEntries(mockApi.getDiary());
    setNewEntry({ topic: '', progress: 50, remarks: '' });
  };

  return (
    <div className="diary-module">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
        {/* New Entry Form */}
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Today's Lesson Plan</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Topic Covered</label>
              <input 
                required 
                value={newEntry.topic} 
                onChange={e => setNewEntry({...newEntry, topic: e.target.value})}
                placeholder="e.g. Introduction to Calculus"
                style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Syllabus Progress ({newEntry.progress}%)</label>
              <input 
                type="range" min="0" max="100" 
                value={newEntry.progress} 
                onChange={e => setNewEntry({...newEntry, progress: e.target.value})}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label>Teaching Remarks</label>
              <textarea 
                value={newEntry.remarks} 
                onChange={e => setNewEntry({...newEntry, remarks: e.target.value})}
                placeholder="How was the class?"
                style={{ padding: '10px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              Save Entry
            </button>
          </form>
        </div>

        {/* Diary History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Previous Logs</h3>
          {entries.map(entry => (
            <div key={entry.id} style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{entry.topic}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{entry.date}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${entry.progress}%`, height: '100%', background: '#10b981' }}></div>
              </div>
              <p style={{ fontSize: '0.9rem', margin: 0, opacity: 0.8 }}>{entry.remarks}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalDiary;
