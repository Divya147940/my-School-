import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../utils/mockApi';

const ScheduleLiveClass = () => {
  const { user, secureApi } = useAuth();
  const [formData, setFormData] = useState({
    teacher_id: user?.id || 'T-Unknown',
    teacher_name: user?.name || 'Faculty',
    class_name: user?.assignedClass ? `Class ${user.assignedClass}` : 'Class 10',
    subject: user?.subject || 'Mathematics',
    meeting_link: '',
    start_time: '',
    topic: ''
  });
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [activeView, setActiveView] = useState('schedule'); // 'schedule' | 'list'
  const [successMsg, setSuccessMsg] = useState('');
  const [liveNow, setLiveNow] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');

  useEffect(() => {
    fetchAllClasses();
    const interval = setInterval(fetchAllClasses, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllClasses = async () => {
    setFetchLoading(true);
    try {
      // Use mockApi instead of real backend
      const results = mockApi.getLiveClasses();
      results.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      setScheduledClasses(results);

      // Check if any class is live right now
      const now = new Date();
      const live = results.find(cls => {
        const start = new Date(cls.start_time);
        const diff = (now - start) / 60000; // minutes
        return diff >= 0 && diff <= 90;
      });
      setLiveNow(live || null);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setSuccessMsg('❌ Please select both Date and Time.');
      setTimeout(() => setSuccessMsg(''), 3000);
      return;
    }
    const combinedDateTime = `${selectedDate}T${selectedTime}:00`;
    const finalData = { ...formData, start_time: combinedDateTime };
    setLoading(true);
    try {
      // Store in mock data
      mockApi.addLiveClass(finalData);
      
      setSuccessMsg('✅ Live Class Scheduled Successfully!');
      setFormData({ ...formData, meeting_link: '', start_time: '', topic: '' });
      setSelectedDate('');
      setSelectedTime('09:00');
      fetchAllClasses();
      setTimeout(() => setSuccessMsg(''), 4000);
      setActiveView('list');
    } catch (err) {
      console.error('Error scheduling class:', err);
      setSuccessMsg('❌ Server error. Please try again.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getClassStatus = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMins = (now - start) / 60000;
    if (diffMins >= 0 && diffMins <= 90) return 'live';
    if (start > now) return 'upcoming';
    return 'ended';
  };

  const formatTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const statusColors = {
    live: { bg: '#ef444420', color: '#ef4444', label: '🔴 LIVE NOW' },
    upcoming: { bg: '#3b82f620', color: '#3b82f6', label: '⏰ Upcoming' },
    ended: { bg: '#ffffff10', color: '#64748b', label: '✅ Ended' }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Live Now Alert Banner */}
      {liveNow && (
        <div style={{
          background: 'linear-gradient(135deg, #ef444415, #dc262615)',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔴</span>
            <div>
              <div style={{ fontWeight: '700', color: '#ef4444', fontSize: '1rem' }}>
                Class is LIVE RIGHT NOW!
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {liveNow.subject} • {liveNow.class_name} • {liveNow.topic}
              </div>
            </div>
          </div>
          <a
            href={liveNow.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px', borderRadius: '10px',
              background: '#ef4444', color: '#fff',
              textDecoration: 'none', fontWeight: '700',
              fontSize: '0.9rem', whiteSpace: 'nowrap'
            }}
          >
            Open Class 🔗
          </a>
        </div>
      )}

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setActiveView('schedule')}
          style={{
            padding: '10px 24px', borderRadius: '12px', border: 'none',
            background: activeView === 'schedule' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
            color: activeView === 'schedule' ? '#fff' : '#94a3b8',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
          }}
        >
          ➕ Schedule New Class
        </button>
        <button
          onClick={() => setActiveView('list')}
          style={{
            padding: '10px 24px', borderRadius: '12px', border: 'none',
            background: activeView === 'list' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
            color: activeView === 'list' ? '#fff' : '#94a3b8',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s'
          }}
        >
          📋 My Scheduled Classes ({scheduledClasses.length})
        </button>
      </div>

      {/* Schedule Form */}
      {activeView === 'schedule' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '30px', borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '8px', fontSize: '1.2rem' }}>
            📡 Schedule a Live Class
          </h3>
          <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: '24px', fontSize: '0.9rem' }}>
            Fill in the details and share your Google Meet / Zoom link. Students will see it instantly.
          </p>

          {successMsg && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
              background: successMsg.startsWith('✅') ? '#10b98120' : '#ef444420',
              color: successMsg.startsWith('✅') ? '#10b981' : '#ef4444',
              border: `1px solid ${successMsg.startsWith('✅') ? '#10b981' : '#ef4444'}`,
              fontWeight: '600'
            }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Class */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Class 🎓</label>
              <select
                value={formData.class_name}
                onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                style={inputStyle}
              >
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
            </div>

            {/* Subject */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Subject 📚</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={inputStyle}
              >
                {['Mathematics', 'Science', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Sanskrit', 'Physics', 'Chemistry', 'Biology'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Today's Topic 📝</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                style={inputStyle}
                placeholder="e.g. Quadratic Equations - Chapter 4"
                required
              />
            </div>

            {/* Meeting Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>
                🔗 Meeting Link (Google Meet / Zoom / MS Teams)
              </label>
              <input
                type="url"
                value={formData.meeting_link}
                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                style={{ ...inputStyle, borderColor: formData.meeting_link ? '#10b981' : 'rgba(255,255,255,0.1)' }}
                placeholder="https://meet.google.com/abc-defg-hij"
                required
              />
              {formData.meeting_link && (
                <span style={{ fontSize: '0.8rem', color: '#10b981' }}>✅ Link pasted successfully</span>
              )}
            </div>

            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>📅 Date</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            {/* Start Time */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>🕐 Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={inputStyle}
                required
              >
                {[
                  '07:00','07:30','08:00','08:30','09:00','09:30',
                  '10:00','10:30','11:00','11:30','12:00','12:30',
                  '13:00','13:30','14:00','14:30','15:00','15:30',
                  '16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00'
                ].map(t => {
                  const [h, m] = t.split(':');
                  const hr = parseInt(h);
                  const ampm = hr >= 12 ? 'PM' : 'AM';
                  const displayHr = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
                  return (
                    <option key={t} value={t}>
                      {String(displayHr).padStart(2,'0')}:{m} {ampm}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                gridColumn: 'span 2', padding: '16px',
                borderRadius: '14px',
                background: loading ? '#334155' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: '#fff', border: 'none', fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem', letterSpacing: '0.5px',
                transition: 'all 0.2s', marginTop: '8px'
              }}
            >
              {loading ? '⏳ Scheduling...' : '📡 Schedule & Notify Students'}
            </button>
          </form>
        </div>
      )}

      {/* Scheduled Classes List */}
      {activeView === 'list' && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          padding: '30px', borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>📋 All Scheduled Live Classes</h3>
            <button
              onClick={fetchAllClasses}
              style={{
                padding: '8px 16px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: '#94a3b8',
                fontSize: '0.85rem', cursor: 'pointer'
              }}
            >
              🔄 Refresh
            </button>
          </div>

          {fetchLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
              Loading classes...
            </div>
          ) : scheduledClasses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📅</div>
              <p>No classes scheduled yet.</p>
              <button
                onClick={() => setActiveView('schedule')}
                style={{
                  marginTop: '8px', padding: '10px 24px',
                  borderRadius: '10px', background: '#3b82f6',
                  color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '600'
                }}
              >
                ➕ Schedule First Class
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {scheduledClasses.map((cls) => {
                const status = getClassStatus(cls.start_time);
                const sc = statusColors[status];
                return (
                  <div key={cls.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 22px', borderRadius: '16px',
                    background: status === 'live' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${status === 'live' ? '#ef444440' : 'rgba(255,255,255,0.07)'}`,
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '12px',
                        background: sc.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0
                      }}>
                        {status === 'live' ? '🔴' : status === 'upcoming' ? '📡' : '✅'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{
                            fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px',
                            background: sc.bg, color: sc.color, fontWeight: '700'
                          }}>
                            {sc.label}
                          </span>
                          <span style={{
                            fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px',
                            background: '#3b82f620', color: '#3b82f6'
                          }}>
                            {cls.class_name}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontWeight: '700', color: '#f1f5f9', fontSize: '1rem' }}>
                          {cls.subject} — {cls.topic || 'General Discussion'}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                          🕐 {formatTime(cls.start_time)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a
                        href={cls.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '10px 18px', borderRadius: '10px',
                          background: status === 'live' ? '#ef4444' : '#3b82f6',
                          color: '#fff', textDecoration: 'none',
                          fontWeight: '700', fontSize: '0.88rem', whiteSpace: 'nowrap'
                        }}
                      >
                        {status === 'live' ? '🔴 Open Live' : '🔗 Open Link'}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

export default ScheduleLiveClass;
