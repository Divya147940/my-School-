import React from 'react';
import { Link } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './Login.css';

const portals = [
  {
    type: 'Student',
    icon: '🎓',
    title: 'Student Portal',
    description: 'Access your classes, assignments, and results.',
    path: '/student-dashboard',
    color: 'var(--accent-blue)'
  },
  {
    type: 'Parent',
    icon: '👨‍👩‍👧',
    title: 'Parent Portal',
    description: "Monitor your child's progress, fees, and updates.",
    path: '/parent-dashboard',
    color: 'var(--accent-purple)'
  },
  {
    type: 'Faculty',
    icon: '👨‍🏫',
    title: 'Faculty Portal',
    description: 'Manage classes, student records, and schedules.',
    path: '/faculty-dashboard',
    color: 'var(--accent-blue)'
  },
  {
    type: 'Admin',
    icon: '🔐',
    title: 'Admin Portal',
    description: 'Full system control and management tools.',
    path: '/admin-dashboard',
    color: 'var(--accent-purple)'
  }
];

const Login = () => {
  const sectionRef = useScrollReveal({ threshold: 0.1 });

  return (
    <div className="login-page" ref={sectionRef}>
      <div className="login-overlay-bg"></div>
      
      <div className="login-content">
        <div className="login-header reveal-on-scroll">
          <div className="school-logo-placeholder">SJ</div>
          <h1>Identity Gateway</h1>
          <p>Select your destination to access the NSGI ecosystem</p>
        </div>
        
        <div className="portal-grid">
          {portals.map((portal, i) => (
            <Link 
              key={portal.type} 
              to={portal.path} 
              className="portal-card reveal-on-scroll"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="portal-glow" style={{ backgroundColor: portal.color }}></div>
              <div className="portal-icon">{portal.icon}</div>
              <div className="portal-info">
                <h3>{portal.title}</h3>
                <p>{portal.description}</p>
              </div>
              <div className="portal-arrow">→</div>
            </Link>
          ))}
        </div>

        <div className="login-footer reveal-on-scroll" style={{ transitionDelay: '0.4s' }}>
          <p>© 2026 Shri Jageshwar Memorial Educational Institute. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
