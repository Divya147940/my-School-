import React, { useState, useEffect, useCallback } from 'react';

// Teacher → class mapping (matches Attendance.jsx)
const TEACHER_CLASS_MAP = [
  { id: 1, teacherName: 'Divyanshi Verma', className: 'AI Class' },
  { id: 2, teacherName: 'Rahul Sharma', className: 'Class 10-A' },
  { id: 3, teacherName: 'Priya Singh', className: 'Class 9-B' },
];

const TOTAL_STUDENTS_PER_CLASS = 40;
const TODAY = new Date().toISOString().split('T')[0];

const AdminAttendanceDashboard = () => {
  const [classData, setClassData] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);

  const loadAttendanceData = useCallback(() => {
    const result = TEACHER_CLASS_MAP.map(t => {
      // Check if teacher has checked in today (key used in Attendance.jsx)
      const savedRaw = localStorage.getItem(`attendance_${t.id}`);
      let checkedIn = false;
      let checkInTime = null;

      if (savedRaw) {
        try {
          const { time, marked } = JSON.parse(savedRaw);
          checkedIn = !!marked;
          checkInTime = time ? new Date(time) : null;
        } catch (e) { /* ignore */ }
      }

      // Load today's detailed attendance (saved by our enhanced Attendance.jsx)
      const detailKey = `attendance_detail_${t.id}_${TODAY}`;
      const detailRaw = localStorage.getItem(detailKey);
      let students = [];
      let presentCount = 0;
      let absentCount = 0;

      if (detailRaw) {
        try {
          students = JSON.parse(detailRaw);
          presentCount = students.filter(s => s.status === 'Present').length;
          absentCount = students.filter(s => s.status === 'Absent').length;
        } catch (e) { /* ignore */ }
      } else if (checkedIn) {
        // If teacher checked in but no detailed data saved yet — default all present
        presentCount = TOTAL_STUDENTS_PER_CLASS;
        absentCount = 0;
      }

      const total = checkedIn ? TOTAL_STUDENTS_PER_CLASS : 0;
      const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

      return {
        ...t,
        checkedIn,
        checkInTime,
        total,
        presentCount,
        absentCount,
        percentage,
        students
      };
    });

    setClassData(result);
    setLastRefresh(new Date());
  }, []);

  useEffect(() => {
    loadAttendanceData();
    const interval = setInterval(loadAttendanceData, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [loadAttendanceData]);

  const totalPresent = classData.reduce((sum, c) => sum + c.presentCount, 0);
  const totalAbsent = classData.reduce((sum, c) => sum + c.absentCount, 0);
  const totalStudents = classData.reduce((sum, c) => sum + c.total, 0);
  const overallPct = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
  const classesReported = classData.filter(c => c.checkedIn).length;

  const getColor = (pct) => {
    if (pct >= 90) return '#10b981';
    if (pct >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const cardStyle = (active) => ({
    background: active ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
    border: active ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
            📊 Today's Attendance Dashboard
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            📅 {today}
          </p>
        </div>
        <button
          onClick={loadAttendanceData}
          style={{
            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
            background: 'rgba(59,130,246,0.1)', color: '#3b82f6',
            border: '1px solid rgba(59,130,246,0.3)', fontWeight: '600', fontSize: '0.85rem'
          }}
        >
          🔄 Refresh — {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </button>
      </div>

      {/* Overall Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Present', value: totalPresent, color: '#10b981', icon: '✅' },
          { label: 'Total Absent', value: totalAbsent, color: '#ef4444', icon: '❌' },
          { label: 'Overall %', value: `${overallPct}%`, color: getColor(overallPct), icon: '📈' },
          { label: 'Classes Reported', value: `${classesReported} / ${TEACHER_CLASS_MAP.length}`, color: '#3b82f6', icon: '🏫' },
        ].map(card => (
          <div key={card.label} style={{
            background: `rgba(${card.color === '#10b981' ? '16,185,129' : card.color === '#ef4444' ? '239,68,68' : card.color === '#3b82f6' ? '59,130,246' : '245,158,11'}, 0.08)`,
            border: `1px solid ${card.color}30`,
            borderRadius: '16px', padding: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{card.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Class-wise Cards */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: '#94a3b8' }}>
        CLASS-WISE BREAKDOWN
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {classData.map(cls => (
          <div
            key={cls.id}
            style={cardStyle(selectedClass === cls.id)}
            onClick={() => setSelectedClass(selectedClass === cls.id ? null : cls.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>{cls.className}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                  Teacher: {cls.teacherName}
                </div>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                background: cls.checkedIn ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                color: cls.checkedIn ? '#10b981' : '#64748b',
                border: `1px solid ${cls.checkedIn ? '#10b98130' : '#64748b30'}`
              }}>
                {cls.checkedIn ? '✓ Reported' : '⏳ Pending'}
              </span>
            </div>

            {cls.checkedIn ? (
              <>
                {/* Progress Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '4px',
                      width: `${cls.percentage}%`,
                      background: `linear-gradient(90deg, ${getColor(cls.percentage)}, ${getColor(cls.percentage)}aa)`,
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#10b981', fontWeight: '700' }}>✅ {cls.presentCount} Present</span>
                  <span style={{ color: '#ef4444', fontWeight: '700' }}>❌ {cls.absentCount} Absent</span>
                  <span style={{ color: getColor(cls.percentage), fontWeight: '800' }}>{cls.percentage}%</span>
                </div>

                {cls.checkInTime && (
                  <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748b' }}>
                    Marked at: {cls.checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748b', fontSize: '0.85rem' }}>
                Attendance not marked yet for today.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Absentee List for Selected Class */}
      {selectedClass && (() => {
        const cls = classData.find(c => c.id === selectedClass);
        if (!cls || !cls.checkedIn) return null;
        const absentees = cls.students.filter(s => s.status === 'Absent');
        return (
          <div style={{
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '16px', padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '16px', color: '#ef4444' }}>
              ❌ Absentees — {cls.className} ({absentees.length} students)
            </h3>
            {absentees.length === 0 ? (
              <p style={{ color: '#10b981', fontWeight: '600' }}>🎉 All students are present today!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {absentees.map(s => (
                  <div key={s.id} style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '10px', padding: '10px 14px', fontSize: '0.85rem', color: '#fca5a5'
                  }}>
                    ❌ {s.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* No data state */}
      {classesReported === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.08)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: '#64748b', marginBottom: '8px' }}>No Attendance Recorded Yet</h3>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>
            Teachers have not marked today's attendance yet. Data will appear here once they save it.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminAttendanceDashboard;
