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
import InquiryTracker from '../components/Admin/InquiryTracker';
import FeeCollector from '../components/Common/FeeCollector';
import LessonDiary from '../components/Common/LessonDiary';
import CommandPalette from '../components/CommandPalette';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Common/Toaster';
import Skeleton from '../components/Common/Skeleton';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout, secureApi } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [backupHistory, setBackupHistory] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [isBackingUp, setIsBackingUp] = useState(false);

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
    { name: 'Fee management', icon: '💰' },
    { name: 'Leads & Inquiries', icon: '📥' },
    { name: 'Staff Payroll', icon: '💳' },
    { name: 'ID Cards', icon: '🆔' },
    { name: 'Elite Controls', icon: '🌟' },
    { name: 'Leave Approvals', icon: '✅' },
    { name: 'Student Records', icon: '📁' },
    { name: 'Notifications', icon: '📢' },
    { name: 'Bulk Send', icon: '🚀' },
    { name: 'Site Management', icon: '🌐' },
    { name: 'Review Manager', icon: '✍️' },
    { name: 'Report Cards', icon: '📜' },
    { name: 'Attendance Ops', icon: '⏲️' },
    { name: 'Manage Faculty', icon: '👨‍🏫' },
    { name: 'Fee Ledger', icon: '📑' },
    { name: 'Activity Tracker', icon: '🕵️' },
    { name: 'Security Audit', icon: '🚨' },
    { name: 'System Backup', icon: '🛡️' },
    { name: 'Settings', icon: '⚙️' }
  ];



  const renderContent = () => {
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
      case 'Fee management':
        return <div className="feature-box"><FeeManagement /></div>;
      case 'Leads & Inquiries':
        return <div className="feature-box"><InquiryTracker /></div>;
      case 'Staff Payroll':
        return <div className="feature-box"><StaffPayroll /></div>;
      case 'ID Cards':
        return <div className="feature-box"><IDCardGenerator /></div>;
      case 'Elite Controls':
        return (
          <div className="feature-box">
            <h3 className="box-title">Super-Elite Module Management</h3>
            <div className="elite-controls-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="control-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                    <h4>📣 Announcement Ticker</h4>
                    <input type="text" defaultValue="🚀 ADMISSIONS OPEN 2026-27..." style={{ width: '100%', padding: '10px', marginTop: '10px' }} />
                    <button style={{ marginTop: '10px', padding: '8px 15px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '5px' }}>Update Ticker</button>
                </div>
                <div className="control-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                    <h4>🛒 Smart Store Inventory</h4>
                    <p>Manage uniforms and books catalog.</p>
                    <button style={{ padding: '8px 15px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '5px' }}>Manage Catalog</button>
                </div>
                <div className="control-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                    <h4>🏥 Health Records</h4>
                    <p>Verified medical entries for students.</p>
                    <button style={{ padding: '8px 15px', background: '#f59e0b', border: 'none', color: '#fff', borderRadius: '5px' }}>Verify Records</button>
                </div>
                <div className="control-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                    <h4>📂 Document Vault</h4>
                    <p>Upload official certificates and reports.</p>
                    <button style={{ padding: '8px 15px', background: '#6366f1', border: 'none', color: '#fff', borderRadius: '5px' }}>Upload Docs</button>
                </div>
            </div>
          </div>
        );
      case 'Leave Approvals':
        return <div className="feature-box"><h3 className="box-title">Pending Leave Requests</h3><LeaveApprovals /></div>;
      case 'Student Records':
        return <div className="feature-box"><RecordManagement /></div>;
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
                    const data = JSON.stringify(localStorage.getItem('NSGI_MOCK_DATA'));
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `NSGI_Backup_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    addToast("Local JSON Exported!", "success");
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
          <div className="overview-content">
            <div className="feature-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 className="box-title" style={{ margin: 0 }}>🚨 ADVANCED SECURITY AUDIT LOGS</h3>
                <button 
                  onClick={fetchSecurityLogs}
                  style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid #3b82f630', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  🔄 REFRESH AUDIT
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid #10b98130' }}>
                  <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>ACTIVE SESSIONS</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{Math.floor(Math.random() * 5) + 1}</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f630' }}>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>PROTECTION LEVEL</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#3b82f6' }}>MAXIMIZED 🔥</div>
                </div>
                <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid #f59e0b30' }}>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}>SECURITY SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>99/100</div>
                </div>
              </div>

              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Event</th>
                      <th>User ID</th>
                      <th>IP Address</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityLogs.length > 0 ? securityLogs.map((log) => (
                      <tr key={log.id}>
                        <td style={{ fontSize: '0.8rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                        <td style={{ fontWeight: 'bold' }}>{log.type}</td>
                        <td>{log.user}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{log.ip}</td>
                        <td>
                          <span className={`badge badge-${log.type.includes('SUCCESS') ? 'paid' : 'pending'}`}>
                            {log.type.includes('SUCCESS') ? 'Authorized' : 'Refused'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          No security events recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
          <div className="user-profile">
            <div className="avatar" style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>AD</div>
          </div>
        </header>

        {renderContent()}
      </main>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={setIsPaletteOpen}
        portalName="Admin"
        navItems={navItems.map(item => ({
          ...item,
          action: () => setActiveTab(item.name)
        }))}
      />
    </div>
  );
};

export default AdminDashboard;
