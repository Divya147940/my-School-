import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockApi } from '../../utils/mockApi';

const LiveClasses = () => {
  const { secureApi, user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'live' | 'upcoming'

  // Get student's class — use user context or default to Class 10
  const studentClass = user?.class_name || user?.class || 'Class 10';

  useEffect(() => {
    fetchClasses();
    // Auto-refresh every 30 seconds to catch newly scheduled classes
    const interval = setInterval(fetchClasses, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchClasses = async () => {
    try {
      // Use real backend API instead of mockApi
      const res = await secureApi.get(`/live-classes/${studentClass}`);
      if (res.data && Array.isArray(res.data)) {
        const sorted = res.data.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setClasses(sorted);
      }
    } catch (err) {
      console.error('Error fetching live classes:', err);
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

  const getTimeLabel = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMins = Math.round((start - now) / 60000);

    if (diffMins < 0) {
      const elapsedMins = Math.abs(diffMins);
      if (elapsedMins <= 90) return `Started ${elapsedMins} min ago`;
      return 'Ended';
    }
    if (diffMins < 60) return `Starts in ${diffMins} min`;
    if (diffMins < 1440) {
      const hrs = Math.round(diffMins / 60);
      return `Starts in ${hrs} hr${hrs > 1 ? 's' : ''}`;
    }
    return start.toLocaleString('en-IN', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleJoin = (cls) => {
    setJoiningId(cls.id);
    setTimeout(() => {
      window.open(cls.meeting_link, '_blank', 'noopener,noreferrer');
      setJoiningId(null);
    }, 800);
  };

  const liveClasses = classes.filter(c => getClassStatus(c.start_time) === 'live');
  const upcomingClasses = classes.filter(c => getClassStatus(c.start_time) === 'upcoming');
  const endedClasses = classes.filter(c => getClassStatus(c.start_time) === 'ended');

  const filteredClasses = filter === 'live'
    ? liveClasses
    : filter === 'upcoming'
      ? upcomingClasses
      : classes;

  const subjectColors = {
    Mathematics: '#3b82f6', Science: '#10b981', English: '#f59e0b',
    Hindi: '#ef4444', History: '#8b5cf6', Geography: '#14b8a6',
    'Computer Science': '#06b6d4', Sanskrit: '#f97316',
    Physics: '#3b82f6', Chemistry: '#10b981', Biology: '#22c55e'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        padding: '24px 28px', borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
            📡 Live Classes
          </h3>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>
            {studentClass} • {liveClasses.length > 0
              ? `🔴 ${liveClasses.length} class live right now!`
              : `${upcomingClasses.length} upcoming classes`}
          </p>
        </div>
        <button
          onClick={fetchClasses}
          style={{
            padding: '8px 16px', borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: '#94a3b8',
            fontSize: '0.82rem', cursor: 'pointer'
          }}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Live Now — Big Banner */}
      {liveClasses.length > 0 && liveClasses.map(cls => (
        <div key={cls.id} style={{
          background: 'linear-gradient(135deg, #ef444418, #b91c1c18)',
          border: '1.5px solid #ef4444',
          borderRadius: '20px', padding: '24px 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '16px',
          animation: 'livePulse 2.5s ease-in-out infinite'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Animated dot */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: '#ef444425',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem'
              }}>📡</div>
              <div style={{
                position: 'absolute', top: '-4px', right: '-4px',
                width: '14px', height: '14px', borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 0 4px #ef444430',
                animation: 'dotPulse 1.5s ease-in-out infinite'
              }} />
            </div>
            <div>
              <div style={{
                display: 'inline-block', padding: '2px 12px',
                borderRadius: '20px', background: '#ef444430',
                color: '#ef4444', fontSize: '0.78rem', fontWeight: '800',
                letterSpacing: '1px', marginBottom: '6px'
              }}>
                🔴 LIVE RIGHT NOW
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f1f5f9' }}>
                {cls.subject} — {cls.topic || 'Live Session'}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
                Teacher: {cls.teacher_name || 'Faculty'} • {getTimeLabel(cls.start_time)}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleJoin(cls)}
            disabled={joiningId === cls.id}
            style={{
              padding: '14px 28px', borderRadius: '14px',
              background: joiningId === cls.id
                ? '#7f1d1d'
                : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#fff', border: 'none',
              fontWeight: '800', fontSize: '1rem',
              cursor: joiningId === cls.id ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px #ef444440',
              transition: 'all 0.2s',
              minWidth: '140px'
            }}
          >
            {joiningId === cls.id ? '⏳ Joining...' : '🚀 JOIN NOW'}
          </button>
        </div>
      ))}

      {/* Filter Tabs */}
      {classes.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: `All (${classes.length})` },
            { key: 'live', label: `🔴 Live (${liveClasses.length})` },
            { key: 'upcoming', label: `⏰ Upcoming (${upcomingClasses.length})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                padding: '8px 18px', borderRadius: '10px',
                border: 'none',
                background: filter === tab.key ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                color: filter === tab.key ? '#fff' : '#94a3b8',
                fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Classes List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📡</div>
          <p>Loading your live classes...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px',
          background: 'rgba(30,41,59,0.4)', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>
            {filter === 'live' ? '📵' : '📅'}
          </div>
          <p style={{ margin: 0, fontSize: '1rem' }}>
            {filter === 'live'
              ? 'No class is live right now. Check upcoming classes!'
              : 'No live classes scheduled yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredClasses.map((cls) => {
            const status = getClassStatus(cls.start_time);
            const isLive = status === 'live';
            const isEnded = status === 'ended';
            const accentColor = subjectColors[cls.subject] || '#3b82f6';

            return (
              <div
                key={cls.id}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: '16px',
                  padding: '18px 22px', borderRadius: '16px',
                  background: isLive ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isLive ? '#ef444430' : 'rgba(255,255,255,0.07)'}`,
                  opacity: isEnded ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {/* Left: Icon + Info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: `${accentColor}20`,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0
                  }}>
                    {isLive ? '🔴' : isEnded ? '✅' : '📖'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.75rem', padding: '2px 10px',
                        borderRadius: '6px', fontWeight: '700',
                        background: isLive ? '#ef444420' : isEnded ? '#ffffff10' : '#3b82f620',
                        color: isLive ? '#ef4444' : isEnded ? '#64748b' : '#3b82f6'
                      }}>
                        {isLive ? '🔴 LIVE' : isEnded ? '✅ Ended' : '⏰ Upcoming'}
                      </span>
                      <span style={{
                        fontSize: '0.75rem', padding: '2px 10px',
                        borderRadius: '6px', background: `${accentColor}20`, color: accentColor
                      }}>
                        {cls.subject}
                      </span>
                    </div>
                    <div style={{ fontWeight: '700', color: '#f1f5f9', fontSize: '0.98rem' }}>
                      {cls.topic || 'General Discussion'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '3px' }}>
                      👩‍🏫 {cls.teacher_name || 'Faculty'} &nbsp;•&nbsp; 🕐 {getTimeLabel(cls.start_time)}
                    </div>
                  </div>
                </div>

                {/* Right: Join Button */}
                {!isEnded && (
                  <button
                    onClick={() => handleJoin(cls)}
                    disabled={joiningId === cls.id}
                    style={{
                      padding: '11px 22px', borderRadius: '12px',
                      background: isLive
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#fff', border: 'none',
                      fontWeight: '700', fontSize: '0.9rem',
                      cursor: joiningId === cls.id ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: isLive ? '0 4px 15px #ef444430' : '0 4px 15px #3b82f630',
                      transition: 'all 0.2s', minWidth: '120px'
                    }}
                  >
                    {joiningId === cls.id
                      ? '⏳ Opening...'
                      : isLive
                        ? '🚀 Join Now'
                        : '🔗 Open Link'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50% { box-shadow: 0 0 20px 4px rgba(239,68,68,0.15); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default LiveClasses;
