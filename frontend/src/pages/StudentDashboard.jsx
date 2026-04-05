import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
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
import StudentSelfAttendance from '../components/Student/StudentSelfAttendance';
import StudentAttendanceAudit from '../components/Common/StudentAttendanceAudit';
import CertificateGenerator from '../components/Common/CertificateGenerator';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Common/Toaster';
import Skeleton from '../components/Common/Skeleton';
import AIDoubtSolver from '../components/Student/AIDoubtSolver';
import NotificationCenter from '../components/Common/NotificationCenter';
import Gamification from '../components/Common/Gamification';
import Leaderboard from '../components/Student/Leaderboard';
import Campus3D from '../components/Common/Campus3D';
import AdaptiveTutor from '../components/Student/AdaptiveTutor';
import CertificateVault from '../components/Common/CertificateVault';
import JuniorActivityCenter from '../components/Student/JuniorActivityCenter';
import JuniorMagicStudio from '../components/Student/JuniorMagicStudio';
import JuniorBabyWorld from '../components/Student/JuniorBabyWorld';
import JuniorDiscoveryHub from '../components/Student/JuniorDiscoveryHub';
import JuniorBrainBoost from '../components/Student/JuniorBrainBoost';
import JuniorDashboardAnimations from '../components/Common/JuniorDashboardAnimations';
import MessageInbox from '../components/Communication/MessageInbox';
import DataMask from '../components/Common/DataMask';
import { maskAadhar, maskPhone } from '../utils/securityUtils';
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
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [pendingAssignmentsCount, setPendingAssignmentsCount] = useState(0);

  useEffect(() => {
    if (user) {
      const msgs = mockApi.getMessages({ 
        role: 'student', 
        userId: user.id || 'STU2026-001', 
        className: user.class || '10A' 
      });
      setRecentMessages(msgs.slice(0, 3));

      // Standardized fetching for assignments count
      const asms = mockApi.getAssignments().filter(a => 
        (a.class === user.class || a.class === `Class ${user.class}`) && a.status !== 'Completed'
      );
      setPendingAssignmentsCount(asms.length);
    }
  }, [user]);

  const juniorClasses = ['Class 0', 'Class 1', 'Class 2', 'Class 3', 'Nursery', 'LKG', 'UKG', '0', '1', '2', '3'];
  const isJunior = juniorClasses.includes(user?.class);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      addToast(`Hi ${user?.name || 'Student'}, ready to learn?`, 'info');
    }, 1200);
    return () => clearTimeout(timer);
  }, [addToast, user]);

  const navItems = [
    { name: 'Overview', icon: '🏠' },
    { name: 'Schedule', icon: '📅' },
    { name: 'Junior Center', icon: isJunior ? '🎡' : '🎨', juniorOnly: true },
    { name: 'Magic Studio', icon: isJunior ? '🎨' : '✨', juniorOnly: true },
    { name: 'Baby Hub', icon: isJunior ? '🍼' : '👶', juniorOnly: true },
    { name: 'Discovery Hub', icon: isJunior ? '🔬' : '🧪', juniorOnly: true },
    { name: 'Brain Boost Hub', icon: '🧠', juniorOnly: true },
    { name: 'My Courses', icon: isJunior ? '🌈' : '📚' },
    { name: 'Live Classes', icon: isJunior ? '📺' : '🎥' },
    { name: 'Self Attendance', icon: '👤✨' },
    { name: 'Attendance', icon: isJunior ? '⭐' : '📝' },
    { name: 'Assignments', icon: isJunior ? '🦄' : '📚' },
    { name: 'Results', icon: isJunior ? '🎉' : '🏆' },
    { name: 'Online Quizzes', icon: isJunior ? '🧩' : '🧠' },
    { name: 'School Calendar', icon: isJunior ? '📅' : '📅' },
    { name: 'Digital ID', icon: isJunior ? '🏷️' : '🆔' },
    { name: 'Hall of Fame', icon: isJunior ? '🎖️' : '🌟' },
    { name: 'Achievement Awards', icon: isJunior ? '📜' : '📜' },
    { name: 'Smart Store', icon: isJunior ? '🍭' : '🛒' },
    { name: 'Health Record', icon: isJunior ? '🩺' : '🏥' },
    { name: 'Doc Vault', icon: isJunior ? '📁' : '📂' },
    { name: 'Timetable', icon: isJunior ? '⏰' : '📅' },
    { name: 'E-Learning', icon: isJunior ? '📽️' : '🎥' },
    { name: 'Live Bus', icon: isJunior ? '🚌' : '🚌' },
    { name: 'Digital Diary', icon: isJunior ? '📒' : '📝' },
    { name: 'Performance Analytics', icon: isJunior ? '🚀' : '📈' },
    { name: 'Leave', icon: isJunior ? '📭' : '✉️' },
    { name: 'AI Doubt Solver', icon: isJunior ? '🤖' : '🧠💡' },
    { name: 'Extra Resources', icon: isJunior ? '💡' : '💡' },
    { name: 'Blockchain Vault', icon: isJunior ? '🛡️' : '🛡️' },
    { name: 'Inbox', icon: '💬' }
  ];

  const studentInfo = {
    name: user?.name || 'Student',
    class: user?.class || 'N/A',
    roll: user?.rollNumber || 'S101',
    attendance: '95%',
    avgGrade: 'A',
    pendingFees: '₹0',
    level: 12,
    xp: 3750,
    nextLevelXp: 5000,
    badges: [
      { name: 'Early Bird', icon: '🌅' },
      { name: 'Math Wizard', icon: '🧙‍♂️' },
      { name: 'Perfect Week', icon: '📅' },
      { name: 'Top 5', icon: '🏆' }
    ]
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.juniorOnly) {
      return isJunior;
    }
    // If it's a junior, hide some complex analytics/vaults
    if (isJunior) {
      const skipForKids = ['Blockchain Vault', 'Performance Analytics', 'Health Record', 'Doc Vault'];
      return !skipForKids.includes(item.name);
    }
    return true;
  });

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
            {isJunior && (
                <div style={{ 
                    background: theme === 'dark' ? 'linear-gradient(90deg, #1e293b, #0f172a)' : 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', 
                    padding: '24px', 
                    borderRadius: '24px', 
                    marginBottom: '30px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(139,92,246,0.3)'
                }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#fff' }}>Hiiii {studentInfo.name.split(' ')[0]}! 👋</h2>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)' }}>Choose your magic activity for today!</p>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#fff' }}>✨ Magic Words</span>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#fff' }}>🎨 Coloring</span>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#fff' }}>🚀 Space Adventure</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveTab('Junior Center')}
                        style={{ padding: '15px 30px', borderRadius: '18px', background: '#8b5cf6', color: '#fff', border: 'none', fontWeight: '950', cursor: 'pointer', boxShadow: '0 5px 20px rgba(139,92,246,0.4)', fontSize: '1rem' }}
                    >
                        Junior World 🎡✨
                    </button>
                </div>
            )}
            <div className="premium-row responsive-grid-2" style={{ marginBottom: '30px' }}>
              <Gamification 
                studentName={studentInfo.name}
              />
              <div className="quick-stats glass-panel" style={{ padding: '25px', borderRadius: '24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-blue)' }}>
                        <DataMask value={studentInfo.attendance} maskFunc={(v) => 'XX%'} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Attendance</div>
                </div>
                <div style={{ height: '40px', width: '1px', background: 'var(--glass-border)' }}></div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>{studentInfo.avgGrade}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Avg Grade</div>
                </div>
              </div>
            </div>

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
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{pendingAssignmentsCount} Active</div>
                <div style={{ color: 'var(--text-secondary)' }}>Assignments</div>
              </div>
              <div className="student-stat-card glass-panel card-vibe">
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>Paid</div>
                <div style={{ color: 'var(--text-secondary)' }}>Fee Status</div>
              </div>
            </div>

            {/* NEW: RECENT ANNOUNCEMENTS WIDGET */}
            <div className="announcements-section glass-panel" style={{ marginBottom: '30px', padding: '30px', borderRadius: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="section-title" style={{ margin: 0 }}>Latest School Announcements</h3>
                    <button 
                        onClick={() => setActiveTab('Inbox')}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        View All Messages 💬
                    </button>
                </div>
                <div className="announcements-list" style={{ display: 'grid', gap: '15px' }}>
                    {recentMessages.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '10px' }}>No new announcements for your class.</p>
                    ) : (
                        recentMessages.map(msg => (
                            <div key={msg.id} className="announcement-item" style={{ 
                                padding: '15px', 
                                background: 'rgba(255,255,255,0.03)', 
                                borderRadius: '16px', 
                                border: '1px solid var(--glass-border)',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '15px'
                            }}>
                                <div style={{ fontSize: '1.5rem' }}>{msg.senderRole === 'admin' ? '📢' : '👨‍🏫'}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: msg.senderRole === 'admin' ? 'var(--accent-purple)' : 'var(--accent-blue)' }}>
                                            {msg.senderName} • {msg.senderRole.toUpperCase()}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(msg.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#fff' }}>{msg.content}</p>
                                    {msg.attachment && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--accent-blue)' }}>📄 {msg.attachment}</div>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="analytics-grid responsive-grid-2">
              <div className="analytics-card glass-panel table-responsive">
                <h3 className="section-title">Attendance Trends</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorAttend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
      case 'Self Attendance':
        return <div className="feature-section"><StudentSelfAttendance /></div>;
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
      case 'Quiz hbb':
        return <div className="feature-section"><QuizSystem /></div>;
      case 'Junior Center':
        return <div className="feature-section"><JuniorActivityCenter /></div>;
      case 'Magic Studio':
        return <div className="feature-section"><JuniorMagicStudio /></div>;
      case 'Baby Hub':
        return <div className="feature-section"><JuniorBabyWorld /></div>;
      case 'Discovery Hub':
        return <div className="feature-section"><JuniorDiscoveryHub /></div>;
      case 'Brain Boost Hub':
        return <div className="feature-section"><JuniorBrainBoost /></div>;
      case 'Live Bus':
        return <div className="feature-section"><BusTracker /></div>;
      case 'Digital Diary':
        return <div className="feature-section"><StudentDiary /></div>;
      case 'Performance Analytics':
        return (
          <div className="overview-content">
            <div className="analytics-grid responsive-grid-2">
              <div className="analytics-card glass-panel table-responsive">
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
            <div style={{ marginTop: '30px' }}>
              <AdaptiveTutor skillData={skillData} />
            </div>

            <div style={{ marginTop: '30px' }}>
              <Leaderboard />
            </div>
          </div>
        );
      case 'Leave':
        return <div className="feature-section"><StudentLeave /></div>;
      case 'AI Doubt Solver':
        return <div className="feature-section"><AIDoubtSolver /></div>;
      case 'Extra Resources':
        return (
          <div className="responsive-grid-2" style={{ gap: '30px' }}>
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
      case 'Blockchain Vault':
        return <div className="feature-section"><CertificateVault /></div>;
      case 'Inbox':
        return <div className="feature-section"><MessageInbox studentId={user?.id || 'STU2026-001'} studentClass={user?.class || '10A'} studentName={user?.name || 'Aman Gupta'} /></div>;
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
    <div className={`student-dashboard ${theme === 'light' ? 'light-mode' : ''} ${isJunior ? 'junior-mode' : ''}`}>
      {isJunior && theme === 'dark' && (
          <style>{`
            .junior-mode {
                background: #020617 !important;
                color: #fff !important;
            }
            .junior-mode .student-sidebar {
                background: linear-gradient(180deg, #020617 0%, #0f172a 100%) !important;
                border-right: 1px solid rgba(255,255,255,0.1) !important;
            }
            .junior-mode .nav-link.active {
                background: rgba(139, 92, 246, 0.2) !important;
                color: #8b5cf6 !important;
                border-radius: 20px !important;
                border-left: 4px solid #8b5cf6 !important;
                transform: scale(1.05);
            }
            .junior-mode .glass-panel {
                background: rgba(255,255,255,0.05) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                backdrop-filter: blur(15px);
                color: #fff !important;
            }
            .junior-mode h1, .junior-mode h2, .junior-mode h3 {
                font-family: 'Outfit', 'Comic Sans MS', cursive !important;
                color: #fff !important;
                text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
            }
            .junior-mode .progress-circle {
                border-width: 8px !important;
            }
          `}</style>
      )}
      <nav className="student-sidebar">
        <div className="sidebar-header">
          <h2>Student Hub</h2>
        </div>
        <ul className="nav-menu">
          {filteredNavItems.map((item) => (
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
            <p style={{ color: 'var(--text-secondary)' }}>
                Welcome back, {studentInfo.name} | Roll: <DataMask value={studentInfo.roll} maskFunc={(v) => 'S***'} />
            </p>
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="tour-trigger glass-panel" 
              onClick={() => setIsTourOpen(true)}
              style={{ padding: '10px 20px', cursor: 'pointer', border: '1px solid var(--accent-blue)', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-blue)', fontWeight: '700' }}
            >
              <span style={{ marginRight: '8px' }}>🌐</span> 3D Tour
            </button>
            <button 
              className="notif-trigger glass-panel" 
              onClick={() => setIsNotifOpen(true)}
              style={{ padding: '10px 15px', position: 'relative', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', borderRadius: '12px', color: 'inherit' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '50px', fontWeight: '800' }}>3</span>
            </button>
            <div className="search-trigger glass-panel" onClick={() => setIsPaletteOpen(true)} style={{ cursor: 'pointer', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', borderRadius: '12px' }}>
              <span>🔍</span>
              <span className="search-hint">Press <kbd>Ctrl K</kbd> to search</span>
            </div>
            <div className="user-profile">
              <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AG</div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
      <Campus3D isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={setIsPaletteOpen}
        portalName="Student"
        navItems={filteredNavItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />
    </div>
  );
};

export default StudentDashboard;
