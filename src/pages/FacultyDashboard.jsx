import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Attendance from '../components/Faculty/Attendance';
import Homework from '../components/Faculty/Homework';
import Timetable from '../components/Faculty/Timetable';
import Exams from '../components/Faculty/Exams';
import LeaveRequest from '../components/Faculty/LeaveRequest';
import DigitalDiary from '../components/Faculty/DigitalDiary';
import SalarySlip from '../components/Faculty/SalarySlip';
import Transport from '../components/Faculty/Transport';
import Library from '../components/Faculty/Library';
import ELearningHub from '../components/ELearningHub';
import QuizSystem from '../components/QuizSystem';
import ReportCardGenerator from '../components/Faculty/ReportCardGenerator';
import QRAttendance from '../components/Common/QRAttendance';
import ScheduleLiveClass from '../components/Faculty/ScheduleLiveClass';
import CommandPalette from '../components/CommandPalette';
import SchoolCalendar from '../components/Common/SchoolCalendar';
import AttendanceOps from '../components/Faculty/AttendanceOps';
import StudentManagement from '../components/Faculty/StudentManagement';
import FeeCollector from '../components/Common/FeeCollector';
import LessonDiary from '../components/Common/LessonDiary';
import './FacultyDashboard.css';

const classPerformanceData = [
  { class: '9A', avg: 82, color: '#3b82f6' },
  { class: '9B', avg: 78, color: '#8b5cf6' },
  { class: '10A', avg: 90, color: '#14b8a6' },
  { class: '10B', avg: 85, color: '#f59e0b' },
];

const syllabusData = [
  { name: 'Completed', value: 75, color: '#10b981' },
  { name: 'Remaining', value: 25, color: 'var(--glass-border)' },
];

const FacultyDashboard = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const navItems = [
    { name: t('overview'), icon: '🏠' },
    { name: language === 'hi' ? 'ई-उपस्थिति' : 'E-Attendance', icon: '📲' },
    { name: t('faceScan'), icon: '👤' },
    { name: t('attendance'), icon: '📝' },
    { name: language === 'hi' ? 'लाइव क्लास' : 'Live Classes', icon: '🎥' },
    { name: t('calendar'), icon: '📅' },
    { name: language === 'hi' ? 'परीक्षा' : 'Examinations', icon: '✍️' },
    { name: language === 'hi' ? 'रिर्पोट कार्ड जनरेटर' : 'Report Card Generator', icon: '📊' },
    { name: language === 'hi' ? 'क्विज़ बनाएँ' : 'Create Quizzes', icon: '🧠' },
    { name: language === 'hi' ? 'समय सारणी' : 'Timetable', icon: '📅' },
    { name: language === 'hi' ? 'सैलरी स्लिप' : 'Salary Slips', icon: '💳' },
    { name: language === 'hi' ? 'ई-लर्निंग (अपलोड)' : 'E-Learning (Upload)', icon: '🎥' },
    { name: language === 'hi' ? 'होमवर्क' : 'Homework', icon: '📚' },
    { name: language === 'hi' ? 'छुट्टी आवेदन' : 'Leave Request', icon: '✉️' },
    { name: language === 'hi' ? 'डिजिटल डायरी' : 'Digital Diary', icon: '📓' },
    { name: t('registerStudent'), icon: '🪪' },
    { name: t('collectFee'), icon: '💰' },
    { name: t('lessonDiary'), icon: '📝' },
    { name: language === 'hi' ? 'सेटिंग्स' : 'Settings', icon: '⚙️' }
  ];

  const stats = [
    { label: 'Classes Today', value: '4', icon: '🏫', color: '#3b82f6' },
    { label: 'Avg Attendance', value: '92%', icon: '👥', color: '#10b981' },
    { label: 'Assignments', value: '12', icon: '📁', color: '#f59e0b' },
    { label: 'Next Lecture', value: '10:30 AM', icon: '⏰', color: '#8b5cf6' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card glass-panel card-vibe">
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

            <div className="analytics-grid">
              <div className="analytics-card glass-panel">
                <h3 className="section-title">Class Performance (Average %)</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={classPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="class" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="avg" radius={[10, 10, 0, 0]}>
                        {classPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="analytics-card glass-panel">
                <h3 className="section-title">Syllabus Completion</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={syllabusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {syllabusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ textAlign: 'center', marginTop: '-40px', fontWeight: '800', color: '#10b981' }}>75% Done</div>
                </div>
              </div>
            </div>

            <div className="feature-section glass-panel">
              <h3 className="section-title">Today's Schedule</h3>
              <div className="schedule-list">
                <div className="schedule-item">
                  <div className="schedule-time">09:00 AM</div>
                  <div className="schedule-info">
                    <h4>Mathematics - 10A</h4>
                    <p>Chapter 4: Quadratic Equations</p>
                  </div>
                  <div className="schedule-status">Ongoing</div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-time">10:30 AM</div>
                  <div className="schedule-info">
                    <h4>Science - 9B</h4>
                    <p>Lab Session: Acids & Bases</p>
                  </div>
                  <div className="schedule-status">Next</div>
                </div>
              </div>
            </div>

            <div className="feature-section glass-panel">
              <h3 className="section-title">Recent Activity</h3>
              <ul className="activity-list" style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '15px', padding: '15px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <b>Aman Gupta</b> marked as present in Class 10A.
                </li>
                <li style={{ marginBottom: '15px', padding: '15px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  New Homework <b>"Trigonometry Basics"</b> uploaded for Class 10.
                </li>
              </ul>
            </div>
          </div>
        );
      case 'E-Attendance':
        return <div className="feature-section"><QRAttendance user={{ name: 'Professor Divyanshi', role: 'faculty' }} /></div>;
      case 'Face Attendance':
      case 'फेस अटेंडेंस':
        return <div className="feature-section"><AttendanceOps /></div>;
      case 'Attendance':
        return (
          <div className="feature-section">
            <h3 className="section-title">Digital Attendance Register</h3>
            <Attendance />
          </div>
        );
      case 'Live Classes':
        return (
          <div className="feature-section">
            <ScheduleLiveClass />
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
      case 'Salary Slips':
        return <div className="feature-section"><SalarySlip /></div>;
      case 'Create Quizzes':
        return <div className="feature-section"><QuizSystem userType="faculty" /></div>;
      case 'E-Learning (Upload)':
        return <div className="feature-section"><ELearningHub userType="faculty" /></div>;
      case 'Examinations':
        return (
          <div className="feature-section">
            <h3 className="section-title">Examination & Results Entry</h3>
            <Exams />
          </div>
        );
      case 'Report Card Generator':
        return (
          <div className="feature-section">
            <h3 className="section-title">Digital Result Builder</h3>
            <ReportCardGenerator />
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
      case 'Register New Student':
      case 'नया छात्र पंजीकृत करें':
        return <div className="feature-section"><StudentManagement /></div>;
      case 'Collect Student Fees':
      case 'छात्र शुल्क जमा करें':
        return <div className="feature-section"><FeeCollector userRole="faculty" userName="Professor Divyanshi" /></div>;
      case 'Daily Lesson Diary':
      case 'दैनिक पाठ डायरी':
        return <div className="feature-section"><LessonDiary mode="faculty" teacherId="TEA2026-02" teacherName="Professor Divyanshi" /></div>;
      case 'School Calendar':
        return <div className="feature-section"><SchoolCalendar /></div>;
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
    <div className={`faculty-dashboard ${theme === 'light' ? 'light-mode' : ''}`}>
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
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Professor Divyanshi</p>
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
