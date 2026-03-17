import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const portals = [
  {
    type: 'Student',
    icon: '🎓',
    description: 'Access your classes, assignments, and results.',
    path: '/student-dashboard'
  },
  {
    type: 'Parent',
    icon: '👨‍👩‍👧',
    description: "Monitor your child's progress, fees, and school updates.",
    path: '/parent-dashboard'
  },
  {
    type: 'Faculty',
    icon: '👨‍🏫',
    description: 'Manage classes, student records, and schedules.',
    path: '/faculty-dashboard'
  },
  {
    type: 'Admin',
    icon: '🔐',
    description: 'Full system control, fee management, and reports.',
    path: '/admin-dashboard'
  }
];

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to NSGI</h1>
        <p>Select your portal to continue</p>
      </div>
      
      <div className="portal-grid">
        {portals.map((portal) => (
          <Link key={portal.type} to={portal.path} className="portal-card">
            <div className="portal-icon">{portal.icon}</div>
            <h3>{portal.type} Portal</h3>
            <p>{portal.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Login;
