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
import CommandPalette from '../components/CommandPalette';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: '💎' },
    { name: 'Fee management', icon: '💰' },
    { name: 'Staff Payroll', icon: '💳' },
    { name: 'ID Cards', icon: '🪪' },
    { name: 'Elite Controls', icon: '🌟' },
    { name: 'Leave Approvals', icon: '✅' },
    { name: 'Student Records', icon: '📁' },
    { name: 'Notifications', icon: '📢' },
    { name: 'Bulk Send', icon: '🚀' },
    { name: 'Site Management', icon: '🌐' },
    { name: 'Report Cards', icon: '📜' },
    { name: 'Attendance Ops', icon: '⏲️' },
    { name: 'Settings', icon: '⚙️' }
  ];

  const stats = [
    { label: 'Total Students', value: '1,240', icon: '👥', color: '#3b82f6' },
    { label: 'Total Revenue', value: '₹4.2L', icon: '📈', color: '#10b981' },
    { label: 'Pending Leaves', value: '08', icon: '⏳', color: '#f59e0b' },
    { label: 'Active Staff', value: '64', icon: '👔', color: '#f43f5e' }
  ];

  const renderContent = () => {
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
          <a href="/login" className="nav-link" style={{ color: '#ef4444' }}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </a>
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
