import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import FeeManagement from '../components/Admin/FeeManagement';
import LeaveApprovals from '../components/Admin/LeaveApprovals';
import StaffPayroll from '../components/Admin/StaffPayroll';
import AdminNotifications from '../components/Admin/AdminNotifications';
import RecordManagement from '../components/Admin/RecordManagement';
import BulkSMS from '../components/Admin/BulkSMS';
import IDCardGenerator from '../components/Admin/IDCardGenerator';
import Library from '../components/Faculty/Library';
import Transport from '../components/Faculty/Transport';
import SiteManagement from '../components/Admin/SiteManagement';
import ReportCardGenerator from '../components/Faculty/ReportCardGenerator';
import AttendanceControl from '../components/Admin/AttendanceControl';
import ReviewManager from '../components/Admin/ReviewManager';
import FacultyManagement from '../components/Admin/FacultyManagement';
import AdminStudentDirectory from '../components/Admin/AdminStudentDirectory';
import AdminAttendanceDashboard from '../components/Admin/AdminAttendanceDashboard';
import InquiryTracker from '../components/Admin/InquiryTracker';
import FeeCollector from '../components/Common/FeeCollector';
import StudentFeeLedger from '../components/Admin/StudentFeeLedger';
import LessonDiary from '../components/Common/LessonDiary';
import StudentAttendanceAudit from '../components/Common/StudentAttendanceAudit';
import JuniorActivityCenter from '../components/Student/JuniorActivityCenter';
import CommandPalette from '../components/CommandPalette';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Common/Toaster';
import Skeleton from '../components/Common/Skeleton';
import NotificationCenter from '../components/Common/NotificationCenter';
import CommunicationPortal from '../components/Communication/CommunicationPortal';
import SecurityDashboard from '../components/Admin/SecurityDashboard';
import SecurityPinModal from '../components/Common/SecurityPinModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, secureApi } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [backupHistory, setBackupHistory] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [pinModal, setPinModal] = useState({ isOpen: false, onVerified: null, actionName: '' });

  const triggerSecureAction = (action, name) => {
    setPinModal({
      isOpen: true,
      onVerified: action,
      actionName: name
    });
  };

  const fetchBackupHistory = async () => {
    try {
      const res = await secureApi('http://localhost:5001/api/admin/backup-history');
      if (res.ok) {
        const data = await res.json();
        setBackupHistory(data);
      }
    } catch (e) { console.error('History fetch failed', e); }
  };

  const fetchSecurityLogs = async () => {
    try {
      const res = await secureApi('http://localhost:5001/api/admin/security-logs');
      if (res.ok) {
        const data = await res.json();
        setSecurityLogs(data);
      }
    } catch (e) { console.error('Security logs fetch failed', e); }
  };

  useEffect(() => {
    fetchBackupHistory();
    fetchSecurityLogs();
  }, []);

  useEffect(() => {
    // Simulate initial loading and fetch real data
    const timer = setTimeout(() => {
      const systemStats = mockApi.getSystemStats();
      const txns = mockApi.getRecentTransactions(5);
      setStats(systemStats);
      setRecentTransactions(txns);
      setLoading(false);
      addToast(`Welcome back, ${user?.name || 'Admin'}!`, 'success');
    }, 1200);
    return () => clearTimeout(timer);
  }, [addToast, user]);

  const navItems = [
    { name: 'Overview', icon: '💎' },
    { name: 'Student Directory', icon: '🎓' },
    { name: "Today's Attendance", icon: '📊' },
    { name: 'Fee management', icon: '💰' },
    { name: 'Leads & Inquiries', icon: '📥' },
    { name: 'Staff Payroll', icon: '💳' },
    { name: 'Elite Controls', icon: '🌟' },
    { name: 'Student Records', icon: '📁' },
    { name: 'Communication Hub', icon: '💬' },
    { name: 'Notifications', icon: '📢' },
    { name: 'Bulk Send', icon: '🚀' },
    { name: 'Site Management', icon: '🌐' },
    { name: 'Review Manager', icon: '✍️' },
    { name: 'Report Cards', icon: '📜' },
    { name: 'Attendance Ops', icon: '⏲️' },
    { name: 'Manage Faculty', icon: '👨‍🏫' },
    { name: 'Fee Ledger', icon: '📑' },
    { name: 'Student Fee Audit', icon: '🔍' },
    { name: 'Attendance Audit', icon: '📊' },
    { name: 'Activity Tracker', icon: '🕵️' },
    { name: 'Junior World Preview', icon: '🎨' },
    { name: 'Security Audit', icon: '🚨' },
    { name: 'System Backup', icon: '🛡️' },
    { name: 'Settings', icon: '⚙️' }
  ];



  const renderContent = () => {
    const dbStatus = mockApi.getAuditLogs(); // This triggers getDB internally which sets tampered flag
    // We need to re-fetch the raw db state to see the flag
    const rawDB = JSON.parse(localStorage.getItem('NSGI_MOCK_DATA') || '{}');
    if (rawDB.tamper_detected) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000', color: '#ff4444', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>⚠️ SYSTEM COMPROMISED</h1>
                <h2 style={{ letterSpacing: '5px', marginBottom: '30px' }}>IRON SHIELD: TAMPER DETECTED</h2>
                <div style={{ border: '1px solid #ff4444', padding: '30px', borderRadius: '20px', background: 'rgba(255,0,0,0.1)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Manual database manipulation detected via browser console / developer tools.</p>
                    <p style={{ color: '#fff' }}>For security reasons, this portal has been LOCKED.</p>
                </div>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ marginTop: '40px', padding: '15px 30px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🚨 RESET SECURE DATABASE</button>
            </div>
        );
    }

    if (loading) {
      return (
        <div className="overview-content">
          <div className="admin-stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="admin-card">
                <Skeleton width="100%" height="80px" borderRadius="15px" />
              </div>
            ))}
          </div>
          <div className="feature-box" style={{ marginTop: '20px' }}>
            <Skeleton width="100%" height="300px" borderRadius="15px" />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          <div className="overview-content">
            <div className="admin-stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="admin-card">
                  <div className="card-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="card-value">{stat.value}</div>
                  <div className="card-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="feature-box">
              <h3 className="box-title">Recent Fee Collections</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.length > 0 ? recentTransactions.map((txn) => (
                    <tr key={txn.id}>
                      <td>{txn.studentName}</td>
                      <td>{txn.class || 'N/A'}</td>
                      <td>₹{txn.amount}</td>
                      <td><span className={`badge badge-${txn.status?.toLowerCase() || 'pending'}`}>{txn.status}</span></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>No recent collections found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Student Directory':
        return <div className="feature-box"><AdminStudentDirectory /></div>;
      case "Today's Attendance":
        return <div className="feature-box"><AdminAttendanceDashboard /></div>;
      case 'Fee management':
        return <div className="feature-box"><FeeManagement /></div>;
      case 'Leads & Inquiries':
        return <div className="feature-box"><InquiryTracker /></div>;
      case 'Staff Payroll':
        return <div className="feature-box"><StaffPayroll /></div>;
      case 'Elite Controls':
        return (
          <div className="feature-box">
            <h3 className="box-title">Super-Elite Module Management</h3>
            <div className="elite-controls-list" style={{ maxWidth: '600px' }}>
                <div className="control-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>📣 Announcement Ticker</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '15px', fontSize: '0.9rem' }}>Update the scrolling announcement text on the school website.</p>
                    <input 
                      type="text" 
                      defaultValue="🚀 ADMISSIONS OPEN 2026-27..." 
                      placeholder="Enter announcement text..."
                      style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', fontSize: '1rem', marginBottom: '15px' }} 
                    />
                    <button style={{ width: '100%', padding: '15px', background: 'var(--accent-blue)', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                      Update Ticker
                    </button>
                </div>
            </div>
          </div>
        );
      case 'Student Records':
        return <div className="feature-box"><RecordManagement /></div>;
      case 'Communication Hub':
        return <div className="feature-box"><CommunicationPortal userRole="admin" userId={user?.id || 'ADMIN-01'} userName={user?.name || 'Administrator'} /></div>;
      case 'Notifications':
        return <div className="feature-box"><AdminNotifications /></div>;
      case 'Bulk Send':
        return <div className="feature-box"><BulkSMS /></div>;
      case 'Site Management':
        return <div className="feature-box"><SiteManagement /></div>;
      case 'Report Cards':
        return <div className="feature-box"><ReportCardGenerator /></div>;
      case 'Attendance Ops':
        return <div className="feature-box"><AttendanceControl /></div>;
      case 'Review Manager':
        return <div className="feature-section"><ReviewManager /></div>;
      case 'Manage Faculty':
        return <div className="feature-box"><FacultyManagement /></div>;
      case 'Fee Ledger':
        return <div className="feature-box"><FeeCollector userRole="admin" userName="Principal Admin" /></div>;
      case 'Student Fee Audit':
        return <div className="feature-box"><StudentFeeLedger /></div>;
      case 'Attendance Audit':
        return <div className="feature-box"><StudentAttendanceAudit /></div>;
      case 'Activity Tracker':
        return <div className="feature-box"><LessonDiary mode="admin" /></div>;
      case 'System Backup':
        return (
          <div className="overview-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="feature-box">
              <h3 className="box-title">🛡️ System Data Protection</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Manage local and cloud backups for your entire school database.
              </p>
              
              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '5px', color: '#3b82f6' }}>☁️ Cloud Sync Status</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                  <div className={`status-indicator ${backupHistory[0]?.status === 'Success' ? 'status-online' : 'status-offline'}`}></div>
                  <span>{backupHistory[0]?.status === 'Success' ? 'Healthy (Last Sync: ' + new Date(backupHistory[0].timestamp).toLocaleDateString() + ')' : 'No Recent Cloud Sync'}</span>
                </div>
                <button 
                  onClick={async () => {
                    triggerSecureAction(async () => {
                        setIsBackingUp(true);
                        addToast("Triggering server-side backup...", "info");
                        try {
                          const res = await secureApi('http://localhost:5001/api/admin/run-backup', { method: 'POST' });
                          const result = await res.json();
                          if (result.status === 'success') {
                            addToast("Cloud Backup Success!", "success");
                            fetchBackupHistory();
                          } else throw new Error(result.message);
                        } catch (e) {
                          addToast(e.message, "error");
                        } finally { setIsBackingUp(false); }
                    }, "Initiate Server-Side Cloud Backup");
                  }}
                  disabled={isBackingUp}
                  style={{ width: '100%', marginTop: '15px', padding: '12px', borderRadius: '8px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: isBackingUp ? 'wait' : 'pointer', opacity: isBackingUp ? 0.7 : 1 }}
                >
                  {isBackingUp ? '⌛ BACKING UP...' : '🚀 TRIGGER CLOUD BACKUP'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ marginBottom: '5px' }}>💾 Local Tools</h4>
                <button 
                  onClick={() => {
                    triggerSecureAction(() => {
                        const data = JSON.stringify(localStorage.getItem('NSGI_MOCK_DATA'));
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `NSGI_Backup_${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        addToast("Local JSON Exported!", "success");
                    }, "Export Local Database JSON");
                  }}
                  style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.05)', color: '#10b981', border: '1px solid #10b98130', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  📥 Download JSON Backup
                </button>
                <div style={{ padding: '15px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Restore from JSON file:</p>
                  <input 
                    type="file" 
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          localStorage.setItem('NSGI_MOCK_DATA', event.target.result);
                          addToast("Restore Complete!", "success");
                          setTimeout(() => window.location.reload(), 1000);
                        } catch (err) { addToast("Invalid Backup", "error"); }
                      };
                      reader.readAsText(file);
                    }}
                    style={{ fontSize: '0.8rem', width: '100%' }}
                  />
                </div>
              </div>
            </div>

            <div className="feature-box">
              <h3 className="box-title">📋 Backup History</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupHistory.length > 0 ? backupHistory.slice(0, 10).map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td><span className={`badge badge-${log.status.includes('Success') ? 'paid' : 'pending'}`}>{log.status}</span></td>
                        <td>{log.size || '-'}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>No backup history found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Security Audit':
        return (
          <div className="feature-box">
             <SecurityDashboard />
          </div>
        );
      case 'Junior World Preview':
        return (
          <div className="feature-box" style={{ background: 'transparent', padding: 0 }}>
             <JuniorActivityCenter />
          </div>
        );
      case 'Settings':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div className="feature-box">
              <h3 className="box-title">System Library</h3>
              <Library />
            </div>
            <div className="feature-box">
              <h3 className="box-title">Fleet Transport</h3>
              <Transport />
            </div>
          </div>
        );
      default:
        return (
          <div className="feature-box">
            <h3 className="box-title">{activeTab}</h3>
            <p>Admin {activeTab} module is being initialized...</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2>NSGI Admin</h2>
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
            <h1>Administrative Portal</h1>
            <p style={{ color: '#94a3b8' }}>Management Dashboard</p>
          </div>
          <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              className="notif-trigger glass-panel" 
              onClick={() => setIsNotifOpen(true)}
              style={{ padding: '10px 15px', position: 'relative', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', borderRadius: '12px', color: 'inherit' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '50px', fontWeight: '800' }}>8</span>
            </button>
            <div className="search-trigger glass-panel" onClick={() => setIsPaletteOpen(true)} style={{ cursor: 'pointer', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', borderRadius: '12px' }}>
              <span>🔍</span>
              <span className="search-hint">Press <kbd>Ctrl K</kbd> to search</span>
            </div>
            <div className="user-profile">
              <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={setIsPaletteOpen}
        portalName="Admin"
        navItems={navItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />

      <SecurityPinModal 
        isOpen={pinModal.isOpen} 
        onClose={() => setPinModal({ ...pinModal, isOpen: false })}
        onVerified={pinModal.onVerified}
        actionName={pinModal.actionName}
      />
    </div>
  );
};

export default AdminDashboard;
