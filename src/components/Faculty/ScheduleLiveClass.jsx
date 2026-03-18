import React, { useState } from 'react';

const ScheduleLiveClass = () => {
  const [formData, setFormData] = useState({
    teacher_id: 1, // Demo teacher ID
    class_name: 'Class 10',
    subject: 'Mathematics',
    meeting_link: '',
    start_time: '',
    topic: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/live-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Live Class Scheduled Successfully!');
        setFormData({ ...formData, meeting_link: '', start_time: '', topic: '' });
      } else {
        alert('Failed to schedule class');
      }
    } catch (err) {
      console.error('Error scheduling class:', err);
    }
  };

  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Schedule Live Class</h3>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Class</label>
          <select 
            value={formData.class_name}
            onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 8">Class 8</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Subject</label>
          <input 
            type="text" 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="e.g. Algebra"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Topic</label>
          <input 
            type="text" 
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="What will be covered today?"
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Meeting Link (Google Meet / Zoom)</label>
          <input 
            type="url" 
            value={formData.meeting_link}
            onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            placeholder="https://meet.google.com/..."
            required
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Start Time</label>
          <input 
            type="datetime-local" 
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            required
          />
        </div>
        <button 
          type="submit" 
          style={{ gridColumn: 'span 2', padding: '15px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Schedule Now
        </button>
      </form>
    </div>
  );
};

export default ScheduleLiveClass;
