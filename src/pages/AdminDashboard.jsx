import React, { useState } from 'react';
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
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
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
    { name: 'ID Cards', icon: '🪪' },
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
    { name: 'System Backup', icon: '🛡️' },
    { name: 'Settings', icon: '⚙️' }
  ];

  const stats = [
    { label: 'Total Students', value: '1,240', icon: '👥', color: '#3b82f6' },
    { label: 'Total Revenue', value: '₹4.2L', icon: '📈', color: '#10b981' },
    { label: 'Pending Leaves', value: '08', icon: '⏳', color: '#f59e0b' },
    { label: 'Active Staff', value: '64', icon: '👔', color: '#f43f5e' }
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
                  <tr>
                    <td>Aman Gupta</td>
                    <td>10A</td>
                    <td>₹5,000</td>
                    <td><span className="badge badge-paid">Paid</span></td>
                  </tr>
                  <tr>
                    <td>Priya Singh</td>
                    <td>9B</td>
                    <td>₹5,000</td>
                    <td><span className="badge badge-pending">Pending</span></td>
                  </tr>
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
          <div className="feature-box" style={{ maxWidth: '600px' }}>
            <h3 className="box-title">🛡️ System Data Protection</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Export your entire school database as a JSON file for backup, or move your data to another computer.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button 
                onClick={() => {
                  const data = JSON.stringify(localStorage.getItem('NSGI_MOCK_DATA'));
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `NSGI_Backup_${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  addToast("Database exported successfully!", "success");
                }}
                style={{ padding: '15px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b98150', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📥 DOWNLOAD FULL BACKUP
              </button>

              <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h4 style={{ marginBottom: '10px' }}>📤 Restore from Backup</h4>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const content = JSON.parse(event.target.result);
                        localStorage.setItem('NSGI_MOCK_DATA', typeof content === 'string' ? content : JSON.stringify(content));
                        addToast("Database restored! Reloading...", "success");
                        setTimeout(() => window.location.reload(), 1500);
                      } catch (err) {
                        addToast("Invalid backup file.", "error");
                      }
                    };
                    reader.readAsText(file);
                  }}
                  style={{ width: '100%', color: 'var(--text-secondary)' }}
                />
              </div>

              <button 
                onClick={() => {
                  if (window.confirm("WARNING: This will delete ALL data. Proceed?")) {
                    localStorage.removeItem('NSGI_MOCK_DATA');
                    window.location.reload();
                  }
                }}
                style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ⚠️ RESET SYSTEM DATABASE
              </button>
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
