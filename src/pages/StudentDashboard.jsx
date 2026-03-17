import React, { useState } from 'react';
import StudentAttendance from '../components/Student/StudentAttendance';
import StudentAssignments from '../components/Student/StudentAssignments';
import StudentResults from '../components/Student/StudentResults';
import StudentTimetable from '../components/Student/StudentTimetable';
import StudentLeave from '../components/Student/StudentLeave';
import StudentDiary from '../components/Student/StudentDiary';
import Library from '../components/Faculty/Library'; // Reusing visual component
import Transport from '../components/Faculty/Transport'; // Reusing visual component
import ELearningHub from '../components/ELearningHub';
import BusTracking from '../components/BusTracking';
import QuizSystem from '../components/QuizSystem';
import AchievementGallery from '../components/Common/AchievementGallery';
import SmartStore from '../components/Common/SmartStore';
import HealthTracker from '../components/Common/HealthTracker';
import DocumentVault from '../components/Common/DocumentVault';
import QRAttendance from '../components/Common/QRAttendance';
import CommandPalette from '../components/CommandPalette';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: '🏠' },
    { name: 'Scan Attendance', icon: '📲' },
    { name: 'Attendance', icon: '📝' },
    { name: 'Assignments', icon: '📚' },
    { name: 'Results', icon: '🏆' },
    { name: 'Online Quizzes', icon: '🧠' },
    { name: 'Hall of Fame', icon: '🌟' },
    { name: 'Smart Store', icon: '🛒' },
    { name: 'Health Record', icon: '🏥' },
    { name: 'Doc Vault', icon: '📂' },
    { name: 'Timetable', icon: '📅' },
    { name: 'E-Learning', icon: '🎥' },
    { name: 'Live Bus', icon: '🚌' },
    { name: 'Digital Diary', icon: '📝' },
    { name: 'Leave', icon: '✉️' },
    { name: 'Extra Resources', icon: '💡' }
  ];

  const studentInfo = {
    name: 'Aman Gupta',
    class: '10A',
    roll: 'S101',
    attendance: '95%',
    avgGrade: 'A',
    pendingFees: '₹0'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="student-stats">
              <div className="student-stat-card">
                <div className="progress-circle" style={{ borderColor: '#10b981' }}>{studentInfo.attendance}</div>
                <div style={{ color: '#94a3b8' }}>Attendance</div>
              </div>
              <div className="student-stat-card">
                <div className="progress-circle">{studentInfo.avgGrade}</div>
                <div style={{ color: '#94a3b8' }}>Academic Grade</div>
              </div>
              <div className="student-stat-card">
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2 Active</div>
                <div style={{ color: '#94a3b8' }}>Assignments</div>
              </div>
              <div className="student-stat-card">
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>No Pending</div>
                <div style={{ color: '#94a3b8' }}>Fee Status</div>
              </div>
            </div>

            <div className="feature-section" style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h3 className="section-title">Schedule Today</h3>
              <div style={{ color: '#94a3b8' }}>
                <p>09:00 AM - Mathematics (Mr. Verma)</p>
                <p>10:00 AM - Science (Mrs. Sharma)</p>
              </div>
            </div>
          </div>
        );
      case 'Scan Attendance':
        return <div className="feature-section"><QRAttendance user={{ name: studentInfo.name, role: 'student' }} /></div>;
      case 'Attendance':
        return <div className="feature-section"><StudentAttendance /></div>;
      case 'Assignments':
        return <div className="feature-section"><StudentAssignments /></div>;
      case 'Results':
        return <div className="feature-section"><StudentResults /></div>;
      case 'Online Quizzes':
        return <div className="feature-box"><QuizSystem userType="student" /></div>;
      case 'Hall of Fame':
        return <div className="feature-section"><AchievementGallery /></div>;
      case 'Smart Store':
        return <div className="feature-section"><SmartStore /></div>;
      case 'Health Record':
        return <div className="feature-section"><HealthTracker /></div>;
      case 'Doc Vault':
        return <div className="feature-section"><DocumentVault /></div>;
      case 'Timetable':
        return <div className="feature-section"><StudentTimetable /></div>;
      case 'E-Learning':
        return <div className="feature-section"><ELearningHub userType="student" /></div>;
      case 'Live Bus':
        return <div className="feature-section"><BusTracking /></div>;
      case 'Digital Diary':
        return <div className="feature-section"><StudentDiary /></div>;
      case 'Leave':
        return <div className="feature-section"><StudentLeave /></div>;
      case 'Extra Resources':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="feature-section">
              <h3 className="section-title">Digital Library</h3>
              <Library />
            </div>
            <div className="feature-section">
              <h3 className="section-title">Transport Details</h3>
              <Transport />
            </div>
          </div>
        );
      default:
        return (
          <div className="feature-section" style={{ background: 'rgba(30, 41, 59, 0.3)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 className="section-title">{activeTab}</h3>
            <p>Welcome to your {activeTab} section. Implementation in progress...</p>
          </div>
        );
    }
  };

  return (
    <div className="student-dashboard">
      <nav className="student-sidebar">
        <div className="sidebar-header">
          <h2>Student Hub</h2>
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
            <h1>Dashboard</h1>
            <p style={{ color: '#94a3b8' }}>Welcome back, {studentInfo.name} (Class {studentInfo.class})</p>
          </div>
          <div className="user-profile">
            <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AG</div>
          </div>
        </header>

        {renderContent()}
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={setIsPaletteOpen}
        portalName="Student"
        navItems={navItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />
    </div>
  );
};

export default StudentDashboard;
