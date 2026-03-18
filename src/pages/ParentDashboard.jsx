import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import StudentAttendance from '../components/Student/StudentAttendance';
import StudentResults from '../components/Student/StudentResults';
import StudentTimetable from '../components/Student/StudentTimetable';
import StudentLeave from '../components/Student/StudentLeave';
import StudentDiary from '../components/Student/StudentDiary';
import ParentFees from '../components/Parent/ParentFees';
import FeeInvoice from '../components/Parent/FeeInvoice';
import ParentNotifications from '../components/Parent/ParentNotifications';
import Library from '../components/Faculty/Library';
import Transport from '../components/Faculty/Transport';
import BusTracking from '../components/BusTracking';
import AchievementGallery from '../components/Common/AchievementGallery';
import SmartStore from '../components/Common/SmartStore';
import HealthTracker from '../components/Common/HealthTracker';
import DocumentVault from '../components/Common/DocumentVault';
import PTMScheduler from '../components/Common/PTMScheduler';
import CommandPalette from '../components/CommandPalette';
import SchoolCalendar from '../components/Common/SchoolCalendar';
import IDCard from '../components/Common/IDCard';
import HallOfFame from '../components/Common/HallOfFame';
import BusTracker from '../components/Common/BusTracker';
import './ParentDashboard.css';

const ParentDashboard = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
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
    { name: t('overview'), icon: '🏠' },
    { name: t('attendance'), icon: '📝' },
    { name: t('fees'), icon: '💰' },
    { name: language === 'hi' ? 'पीटीएम शेड्यूलर' : 'PTM Scheduler', icon: '🗓️' },
    { name: t('calendar'), icon: '📅' },
    { name: t('idcard'), icon: '🪪' },
    { name: t('results'), icon: '🏆' },
    { name: t('halloffame'), icon: '🌟' },
    { name: language === 'hi' ? 'स्मार्ट स्टोर' : 'Smart Store', icon: '🛒' },
    { name: language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Record', icon: '🏥' },
    { name: language === 'hi' ? 'दस्तावेज़' : 'Doc Vault', icon: '📂' },
    { name: language === 'hi' ? 'समय सारणी' : 'Timetable', icon: '📅' },
    { name: language === 'hi' ? 'ई-लर्निंग' : 'E-Learning', icon: '🎥' },
    { name: language === 'hi' ? 'छुट्टी आवेदन' : 'Apply Leave', icon: '✉️' },
    { name: language === 'hi' ? 'डिजिटल डायरी' : 'Digital Diary', icon: '📔' },
    { name: language === 'hi' ? 'लाइब्रेरी' : 'Library', icon: '📚' },
    { name: t('bus'), icon: '🚌' },
    { name: t('notifications'), icon: '📢' }
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
              <div className="parent-card glass-panel card-vibe">
                <div className="card-title">Attendance Status</div>
                <div className="card-value" style={{ color: '#10b981' }}>{childInfo.attendance}</div>
              </div>
              <div className="parent-card glass-panel card-vibe">
                <div className="card-title">Last Exam Grade</div>
                <div className="card-value" style={{ color: 'var(--accent-blue)' }}>{childInfo.lastResult}</div>
              </div>
              <div className="parent-card glass-panel card-vibe">
                <div className="card-title">Pending Fees</div>
                <div className="card-value" style={{ color: childInfo.dueFees === '₹0' ? '#10b981' : '#ef4444' }}>{childInfo.dueFees}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
               <div className="feature-box glass-panel">
                <h3 className="section-title">Recent Activity for {childInfo.name}</h3>
                <div className="activity-item" style={{ padding: '15px', background: 'var(--glass-bg)', borderRadius: '12px', marginBottom: '15px', border: '1px solid var(--glass-border)' }}>
                   <p style={{ margin: 0, fontWeight: '600' }}>Marked Present today at 08:35 AM.</p>
                </div>
                <div className="activity-item" style={{ padding: '15px', background: 'var(--glass-bg)', borderRadius: '12px', marginBottom: '15px', border: '1px solid var(--glass-border)' }}>
                   <p style={{ margin: 0, fontWeight: '600' }}>New Mathematics homework assigned.</p>
                </div>
              </div>

              <div className="feature-box glass-panel">
                <h3 className="section-title">Upcoming PTM</h3>
                <div style={{ background: 'var(--accent-blue)', padding: '20px', borderRadius: '20px', color: '#fff', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Saturday, 25th March</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', margin: '5px 0' }}>Term 2 Discussion</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>02:30 PM - Room 102</div>
                </div>
                <button className="glass-panel" style={{ width: '100%', marginTop: '15px', padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: '700' }}>Set Reminder</button>
              </div>
            </div>
          </div>
        );
      case 'Attendance':
        return <div className="feature-section"><h3 className="section-title">Ward Attendance Record</h3><StudentAttendance /></div>;
      case 'Fees & Receipts':
        return (
          <div className="feature-section">
            <h3 className="section-title">School Fee Management</h3>
            <ParentFees />
          </div>
        );
      case 'PTM Scheduler':
        return <div className="feature-section"><PTMScheduler userType="parent" /></div>;
      case 'Results':
        return <div className="feature-section"><h3 className="section-title">Academic Performance</h3><StudentResults studentName={childInfo.name} /></div>;
      case 'Hall of Fame':
        return <div className="feature-section"><AchievementGallery /></div>;
      case 'Smart Store':
        return <div className="feature-section"><SmartStore /></div>;
      case 'Health Record':
        return <div className="feature-section"><HealthTracker /></div>;
      case 'Doc Vault':
        return <div className="feature-section"><DocumentVault /></div>;
      case 'Timetable':
        return <div className="feature-section"><h3 className="section-title">Class Schedule</h3><StudentTimetable /></div>;
      case 'E-Learning':
        return <div className="feature-section"><ELearningHub userType="parent" /></div>;
      case 'Apply Leave':
        return <div className="feature-section"><h3 className="section-title">Request Leave for Ward</h3><StudentLeave /></div>;
      case 'Notifications':
        return <div className="feature-section"><ParentNotifications /></div>;
      case 'School Calendar':
        return <div className="feature-section"><SchoolCalendar /></div>;
      case 'Ward Digital ID':
        return <div className="feature-section"><IDCard studentData={{ name: 'Aman Gupta', class: '10A', rollNo: '2026001', dob: '15/08/2010', bloodGroup: 'B+' }} /></div>;
      case 'Hall of Fame':
        return <div className="feature-section"><HallOfFame /></div>;
      case 'Digital Diary':
        return <div className="feature-section"><h3 className="section-title">Daily Teaching Updates</h3><StudentDiary /></div>;
      case 'Library':
        return <div className="feature-section"><h3 className="section-title">Child's Library History</h3><Library /></div>;
      case 'Live Bus':
        return <div className="feature-section"><BusTracker /></div>;
      default:
        return (
          <div className="feature-section glass-panel">
            <h3 className="section-title">{activeTab}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome to the {activeTab} section for your child. Implementation in progress...</p>
          </div>
        );
    }
  };

  return (
    <div className={`parent-dashboard ${theme === 'light' ? 'light-mode' : ''}`}>
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
            <h1>Guardians Hub</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Monitoring: **{childInfo.name}** (Class {childInfo.class})</p>
          </div>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 'bold' }}>Mr. Rajkumar Gupta</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parent Account</div>
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
