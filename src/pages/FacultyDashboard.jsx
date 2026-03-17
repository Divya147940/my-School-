import React, { useState } from 'react';
import Attendance from '../components/Faculty/Attendance';
import Homework from '../components/Faculty/Homework';
import Timetable from '../components/Faculty/Timetable';
import Exams from '../components/Faculty/Exams';
import LeaveRequest from '../components/Faculty/LeaveRequest';
import DigitalDiary from '../components/Faculty/DigitalDiary';
import Library from '../components/Faculty/Library';
import Transport from '../components/Faculty/Transport';
import CommandPalette from '../components/CommandPalette';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: '📊' },
    { name: 'Attendance', icon: '📝' },
    { name: 'Examinations', icon: '✍️' },
    { name: 'Timetable', icon: '📅' },
    { name: 'Homework', icon: '📚' },
    { name: 'Leave Request', icon: '✉️' },
    { name: 'Digital Diary', icon: '📓' },
    { name: 'Settings', icon: '⚙️' }
  ];

  const stats = [
    { label: 'Classes Today', value: '4', icon: '🏫', color: '#3b82f6' },
    { label: 'Students Present', value: '92%', icon: '👥', color: '#10b981' },
    { label: 'Assignments Pending', value: '12', icon: '📁', color: '#f59e0b' },
    { label: 'Next Lecture', value: '10:30 AM', icon: '⏰', color: '#8b5cf6' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="feature-section">
              <h3 className="section-title">Class Schedule (Monday)</h3>
              <div className="timetable-placeholder">
                <p>Monday | Period 1 | Class 10A | Mathematics</p>
                <p>Monday | Period 2 | Class 9B | Science</p>
              </div>
            </div>

            <div className="feature-section">
              <h3 className="section-title">Recent Activity</h3>
              <ul className="activity-list" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <b>Aman Gupta</b> marker as present in Class 10A.
                </li>
                <li style={{ marginBottom: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  New Homework <b>"Trigonometry Basics"</b> uploaded for Class 10.
                </li>
              </ul>
            </div>
          </div>
        );
      case 'Attendance':
        return (
          <div className="feature-section">
            <h3 className="section-title">Digital Attendance Register</h3>
            <Attendance />
          </div>
        );
      case 'Homework':
        return (
          <div className="feature-section">
            <Homework />
          </div>
        );
      case 'Timetable':
        return (
          <div className="feature-section">
            <Timetable />
          </div>
        );
      case 'Examinations':
        return (
          <div className="feature-section">
            <h3 className="section-title">Examination & Results Entry</h3>
            <Exams />
          </div>
        );
      case 'Leave Request':
        return (
          <div className="feature-section">
            <LeaveRequest />
          </div>
        );
      case 'Digital Diary':
        return (
          <div className="feature-section">
            <h3 className="section-title">Teacher's Digital Log</h3>
            <DigitalDiary />
          </div>
        );
      case 'Settings':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="feature-section">
              <h3 className="section-title">Library Management</h3>
              <Library />
            </div>
            <div className="feature-section">
              <h3 className="section-title">Transport Tracking</h3>
              <Transport />
            </div>
          </div>
        );
      default:
        return (
          <div className="feature-section">
            <h3 className="section-title">{activeTab}</h3>
            <p>This module is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="faculty-dashboard">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>NSGI Portal</h2>
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
            <h1>Faculty Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Welcome back, Professor Divyanshi</p>
          </div>
          <div className="user-profile">
            <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>DV</div>
          </div>
        </header>

        {renderContent()}
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={setIsPaletteOpen}
        portalName="Faculty"
        navItems={navItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />
    </div>
  );
};

export default FacultyDashboard;
