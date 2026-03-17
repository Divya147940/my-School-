import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import StudentAttendance from '../components/Student/StudentAttendance';
import StudentResults from '../components/Student/StudentResults';
import StudentTimetable from '../components/Student/StudentTimetable';
import StudentLeave from '../components/Student/StudentLeave';
import StudentDiary from '../components/Student/StudentDiary';
import ParentFees from '../components/Parent/ParentFees';
import ParentNotifications from '../components/Parent/ParentNotifications';
import Library from '../components/Faculty/Library';
import Transport from '../components/Faculty/Transport';
import CommandPalette from '../components/CommandPalette';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [childInfo, setChildInfo] = useState({
    name: 'Aman Gupta',
    class: '10A',
    roll: 'S101',
    attendance: '95%',
    lastResult: 'A+',
    dueFees: '₹5,000'
  });

  const navItems = [
    { name: 'Overview', icon: '🏠' },
    { name: 'Attendance', icon: '📝' },
    { name: 'Fees & Receipts', icon: '💰' },
    { name: 'Results', icon: '🏆' },
    { name: 'Timetable', icon: '📅' },
    { name: 'Apply Leave', icon: '✉️' },
    { name: 'Digital Diary', icon: '📔' },
    { name: 'Library', icon: '📚' },
    { name: 'Live Bus', icon: '🚌' },
    { name: 'Notifications', icon: '📢' }
  ];

  useEffect(() => {
    const feeRecord = mockApi.getFees().find(f => f.student === 'Aman Gupta');
    if (feeRecord) {
      setChildInfo(prev => ({
        ...prev,
        dueFees: `₹${feeRecord.total - feeRecord.paid}`
      }));
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="parent-stats-grid">
              <div className="parent-card">
                <div className="card-title">Attendance Status</div>
                <div className="card-value" style={{ color: '#10b981' }}>{childInfo.attendance}</div>
              </div>
              <div className="parent-card">
                <div className="card-title">Last Exam Grade</div>
                <div className="card-value" style={{ color: '#3b82f6' }}>{childInfo.lastResult}</div>
              </div>
              <div className="parent-card">
                <div className="card-title">Pending Fees</div>
                <div className="card-value" style={{ color: childInfo.dueFees === '₹0' ? '#10b981' : '#ef4444' }}>{childInfo.dueFees}</div>
              </div>
            </div>

            <div className="feature-box">
              <h3 className="box-title">Recent Activity for {childInfo.name}</h3>
              <p style={{ color: '#94a3b8' }}>• Marked Present today at 08:35 AM.</p>
              <p style={{ color: '#94a3b8' }}>• New Mathematics homework assigned.</p>
              <p style={{ color: '#94a3b8' }}>• Monthly fee receipt generated.</p>
            </div>
          </div>
        );
      case 'Attendance':
        return <div className="feature-box"><h3 className="box-title">Ward Attendance Record</h3><StudentAttendance /></div>;
      case 'Fees & Receipts':
        return <div className="feature-box"><ParentFees /></div>;
      case 'Results':
        return <div className="feature-box"><h3 className="box-title">Academic Performance</h3><StudentResults /></div>;
      case 'Timetable':
        return <div className="feature-box"><h3 className="box-title">Class Schedule</h3><StudentTimetable /></div>;
      case 'Apply Leave':
        return <div className="feature-box"><h3 className="box-title">Request Leave for Ward</h3><StudentLeave /></div>;
      case 'Notifications':
        return <div className="feature-box"><ParentNotifications /></div>;
      case 'Digital Diary':
        return <div className="feature-box"><h3 className="box-title">Daily Teaching Updates</h3><StudentDiary /></div>;
      case 'Library':
        return <div className="feature-box"><h3 className="box-title">Child's Library History</h3><Library /></div>;
      case 'Live Bus':
        return <div className="feature-box"><h3 className="box-title">Live Transport Tracking</h3><Transport /></div>;
      default:
        return (
          <div className="feature-box">
            <h3 className="box-title">{activeTab}</h3>
            <p>Welcome to the {activeTab} section for your child. Implementation in progress...</p>
          </div>
        );
    }
  };

  return (
    <div className="parent-dashboard">
      <nav className="parent-sidebar">
        <div className="sidebar-header">
          <h2>Parent Portal</h2>
        </div>
        <ul className="nav-menu">
          {navItems.map((item) => (
            <li key={item.name} className="nav-item">
              <a
                href="#"
                className={`nav-link ${activeTab === item.name ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setActiveTab(item.name); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <a href="/login" className="nav-link" style={{ color: '#ef4444' }}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </a>
        </div>
      </nav>

      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>Parent Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Monitoring: **{childInfo.name}** (Class {childInfo.class})</p>
          </div>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold' }}>Mr. Rajkumar Gupta</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Parent</div>
            </div>
            <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>RG</div>
          </div>
        </header>

        {renderContent()}
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={setIsPaletteOpen}
        portalName="Parent"
        navItems={navItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />
    </div>
  );
};

export default ParentDashboard;
