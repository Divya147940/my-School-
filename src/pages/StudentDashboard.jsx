import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import QRAttendance from '../components/Common/QRAttendance';
import LiveClasses from '../components/Student/LiveClasses';
import StudentAttendance from '../components/Student/StudentAttendance';
import StudentAssignments from '../components/Student/StudentAssignments';
import StudentResults from '../components/Student/StudentResults';
import QuizSystem from '../components/QuizSystem';
import AchievementGallery from '../components/Common/AchievementGallery';
import SmartStore from '../components/Common/SmartStore';
import HealthTracker from '../components/Common/HealthTracker';
import DocumentVault from '../components/Common/DocumentVault';
import StudentTimetable from '../components/Student/StudentTimetable';
import ELearningHub from '../components/ELearningHub';
import StudentDiary from '../components/Student/StudentDiary';
import StudentLeave from '../components/Student/StudentLeave';
import Library from '../components/Faculty/Library';
import CommandPalette from '../components/CommandPalette';
import SchoolCalendar from '../components/Common/SchoolCalendar';
import StudentIdCard from '../components/Student/StudentIdCard';
import HallOfFame from '../components/Common/HallOfFame';
import BusTracker from '../components/Common/BusTracker';
import FaceAttendance from '../components/Student/FaceAttendance';
import StudentAttendanceAudit from '../components/Common/StudentAttendanceAudit';
import CertificateGenerator from '../components/Common/CertificateGenerator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Common/Toaster';
import Skeleton from '../components/Common/Skeleton';
import './StudentDashboard.css';

const performanceData = [
  { month: 'Jan', attendance: 92, grade: 85 },
  { month: 'Feb', attendance: 95, grade: 88 },
  { month: 'Mar', attendance: 88, grade: 82 },
  { month: 'Apr', attendance: 98, grade: 94 },
  { month: 'May', attendance: 95, grade: 90 },
];

const gradeDistribution = [
  { subject: 'Math', score: 92, color: '#3b82f6' },
  { subject: 'Science', score: 88, color: '#8b5cf6' },
  { subject: 'English', score: 95, color: '#14b8a6' },
  { subject: 'History', score: 84, color: '#f59e0b' },
  { subject: 'Sanskrit', score: 98, color: '#ef4444' },
];

const skillData = [
  { subject: 'Logic', A: 120, B: 110, fullMark: 150 },
  { subject: 'Creativity', A: 98, B: 130, fullMark: 150 },
  { subject: 'Sports', A: 86, B: 130, fullMark: 150 },
  { subject: 'Civics', A: 99, B: 100, fullMark: 150 },
  { subject: 'Literacy', A: 85, B: 90, fullMark: 150 },
  { subject: 'Tech', A: 65, B: 85, fullMark: 150 },
];

const termProgressData = [
  { name: 'Term 1', marks: 450, total: 500, attendance: 95 },
  { name: 'Term 2', marks: 420, total: 500, attendance: 92 },
  { name: 'Term 3', marks: 480, total: 500, attendance: 98 },
  { name: 'Final', marks: 490, total: 500, attendance: 99 },
];

const StudentDashboard = () => {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      addToast(`Hi ${user?.name || 'Student'}, ready to learn?`, 'info');
    }, 1200);
    return () => clearTimeout(timer);
  }, [addToast, user]);

  const navItems = [
    { name: 'Overview', icon: '🏠' },
    { name: 'Scan Attendance', icon: '📲' },
    { name: 'Face Attendance', icon: '👤' },
    { name: 'Live Classes', icon: '🎥' },
    { name: 'Attendance', icon: '📝' },
    { name: 'Assignments', icon: '📚' },
    { name: 'Results', icon: '🏆' },
    { name: 'Online Quizzes', icon: '🧠' },
    { name: 'School Calendar', icon: '📅' },
    { name: 'Digital ID', icon: '🆔' },
    { name: 'Hall of Fame', icon: '🌟' },
    { name: 'Achievement Awards', icon: '📜' },
    { name: 'Smart Store', icon: '🛒' },
    { name: 'Health Record', icon: '🏥' },
    { name: 'Doc Vault', icon: '📂' },
    { name: 'Timetable', icon: '📅' },
    { name: 'E-Learning', icon: '🎥' },
    { name: 'Live Bus', icon: '🚌' },
    { name: 'Digital Diary', icon: '📝' },
    { name: 'Performance Analytics', icon: '📈' },
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
    if (loading) {
      return (
        <div className="overview-content">
          <div className="student-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="student-stat-card glass-panel">
                <Skeleton width="100%" height="80px" borderRadius="15px" />
              </div>
            ))}
          </div>
          <div className="analytics-grid" style={{ marginTop: '20px' }}>
            <Skeleton width="100%" height="300px" borderRadius="15px" />
            <Skeleton width="100%" height="300px" borderRadius="15px" />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="student-stats">
              <div className="student-stat-card glass-panel card-vibe">
                <div className="progress-circle" style={{ borderColor: '#10b981' }}>{studentInfo.attendance}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Attendance</div>
              </div>
              <div className="student-stat-card glass-panel card-vibe">
                <div className="progress-circle" style={{ borderColor: 'var(--accent-purple)' }}>{studentInfo.avgGrade}</div>
                <div style={{ color: 'var(--text-secondary)' }}>Academic Grade</div>
              </div>
              <div className="student-stat-card glass-panel card-vibe">
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>2 Active</div>
                <div style={{ color: 'var(--text-secondary)' }}>Assignments</div>
              </div>
              <div className="student-stat-card glass-panel card-vibe">
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>Paid</div>
                <div style={{ color: 'var(--text-secondary)' }}>Fee Status</div>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card glass-panel">
                <h3 className="section-title">Attendance Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="attendance" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAttend)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="analytics-card glass-panel">
                <h3 className="section-title">Subject Performance</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="subject" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="score">
                        {gradeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="feature-section glass-panel">
              <h3 className="section-title">Todays Classes</h3>
              <div className="schedule-list">
                <div className="schedule-item">
                  <div className="schedule-time">09:00 AM</div>
                  <div className="schedule-info">
                    <h4>Mathematics</h4>
                    <p>Mr. Verma • Room 102</p>
                  </div>
                  <div className="schedule-status">Upcoming</div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-time">10:00 AM</div>
                  <div className="schedule-info">
                    <h4>Science</h4>
                    <p>Mrs. Sharma • Lab 1</p>
                  </div>
                  <div className="schedule-status">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Scan Attendance':
        return <div className="feature-section"><QRAttendance user={{ name: studentInfo.name, role: 'student' }} /></div>;
      case 'Face Attendance':
        return <div className="feature-section"><FaceAttendance /></div>;
      case 'Live Classes':
        return <div className="feature-section"><LiveClasses /></div>;
      case 'Attendance':
        return <div className="feature-section"><StudentAttendanceAudit initialStudentId={user?.id || 'STU2026-001'} viewMode="student" /></div>;
      case 'Assignments':
        return <div className="feature-section"><StudentAssignments /></div>;
      case 'Results':
        return <div className="feature-section"><StudentResults /></div>;
      case 'Online Quizzes':
        return <div className="feature-box"><QuizSystem userType="student" /></div>;
      case 'School Calendar':
        return <div className="feature-section"><SchoolCalendar /></div>;
      case 'Digital ID':
        return <div className="feature-section"><StudentIdCard /></div>;
      case 'Hall of Fame':
        return <div className="feature-section"><HallOfFame /></div>;
      case 'Achievement Awards':
        return <div className="feature-section"><CertificateGenerator studentName={studentInfo.name} /></div>;
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
        return <div className="feature-section"><BusTracker /></div>;
      case 'Digital Diary':
        return <div className="feature-section"><StudentDiary /></div>;
      case 'Performance Analytics':
        return (
          <div className="overview-content">
            <div className="analytics-grid">
               <div className="analytics-card glass-panel">
                <h3 className="section-title">Academic Skill Map</h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" />
                      <PolarRadiusAxis stroke="var(--text-secondary)" />
                      <Radar name="Aman Gupta" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="analytics-card glass-panel">
                <h3 className="section-title">Term-wise Progression</h3>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    <ComposedChart data={termProgressData}>
                      <CartesianGrid stroke="#f5f5f5" strokeOpacity={0.1} />
                      <XAxis dataKey="name" scale="band" stroke="var(--text-secondary)" />
                      <YAxis stroke="var(--text-secondary)" />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="marks" barSize={40} fill="#413ea0" radius={[10, 10, 0, 0]} />
                      <Line type="monotone" dataKey="attendance" stroke="#ff7300" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="feature-section glass-panel">
               <h3 className="section-title">AI Insight</h3>
               <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontStyle: 'italic' }}>
                 "Great job, Aman! Your performance in Sanskrit and Mathematics is exceptional. Consider focusing more on Tech skills to balance your profile."
               </p>
            </div>
          </div>
        );
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
              <BusTracker />
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
    <div className={`student-dashboard ${theme === 'light' ? 'light-mode' : ''}`}>
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
          <button 
            onClick={(e) => { e.preventDefault(); logout(); }} 
            className="nav-link" 
            style={{ color: '#ef4444', background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <header className="content-header">
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {studentInfo.name} (Class {studentInfo.class})</p>
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
