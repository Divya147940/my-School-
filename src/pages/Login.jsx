import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockApi } from '../utils/mockApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const sectionRef = useScrollReveal({ threshold: 0.1 });
  const [showRecover, setShowRecover] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [recoveredUser, setRecoveredUser] = useState(null);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const portal = portals.find(p => p.type === user.role);
      if (portal) navigate(portal.path);
    }
  }, [isAuthenticated, user, navigate]);

  const handleRecover = () => {
    setError('');
    
    // Validation
    const trimmedContact = contactInfo.trim();
    if (!trimmedContact) {
      setError(language === 'hi' ? 'कृपया जानकारी दर्ज करें' : 'Please enter contact info');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(trimmedContact) && !phoneRegex.test(trimmedContact)) {
      setError(language === 'hi' ? 'मान्य ईमेल या 10-अंकों का नंबर दर्ज करें' : 'Enter valid email or 10-digit number');
      return;
    }

    const user = mockApi.recoverId(trimmedContact);
    if (user) {
      setRecoveredUser(user);
    } else {
      setError(t('noAccount'));
    }
  };

  const closeRecover = () => {
    setShowRecover(false);
    setRecoveredUser(null);
    setContactInfo('');
    setError('');
  };

  const handlePortalLogin = (portal) => {
    // Simulate authentication
    const mockUser = {
      id: portal.type === 'Admin' ? 'ADM-001' : portal.type === 'Faculty' ? 'TEA-001' : 'STU-001',
      name: portal.type === 'Admin' ? 'Admin User' : portal.type === 'Faculty' ? 'Professor Divyanshi' : 'Aman Gupta',
      role: portal.type
    };
    login(mockUser);
    navigate(portal.path);
  };

  return (
    <div className="login-page" ref={sectionRef}>
      <div className="login-overlay-bg"></div>
      
      {/* Recovery Modal */}
      {showRecover && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '15px' }}>{t('recoverTitle')}</h2>
            
            {!recoveredUser ? (
              <>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>{t('enterContact')}</p>
                <input 
                  type="text" 
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. 9876543210 or name@mail.com"
                  style={{ width: '100%', padding: '15px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '20px', textAlign: 'center' }}
                />
                {error && <p style={{ color: '#f43f5e', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <button onClick={closeRecover} style={{ padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>CANCEL</button>
                  <button onClick={handleRecover} style={{ padding: '15px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}>{t('recoverBtn')}</button>
                </div>
              </>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌟</div>
                <h3 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '10px' }}>{t('idFound')}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Hello, <b>{recoveredUser.name}</b></p>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-blue)', marginBottom: '30px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{recoveredUser.type} ID</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-blue)' }}>{recoveredUser.id}</div>
                  {recoveredUser.rollNo && (
                    <div style={{ marginTop: '10px', fontSize: '1rem' }}>Roll No: <b>{recoveredUser.rollNo}</b></div>
                  )}
                </div>
                <button onClick={closeRecover} style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}>GOT IT! 👍</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="login-content">
        <div className="login-header reveal-on-scroll">
          <div className="school-logo-placeholder">SJ</div>
          <h1>{t('studentPortal')}</h1>
          <p>Select your destination to access the NSGI ecosystem</p>
        </div>
        
        <div className="portal-grid">
          {portals.map((portal, i) => (
            <div 
              key={portal.type} 
              onClick={() => handlePortalLogin(portal)}
              className="portal-card reveal-on-scroll"
              style={{ transitionDelay: `${i * 0.1}s`, cursor: 'pointer' }}
            >
              <div className="portal-glow" style={{ backgroundColor: portal.color }}></div>
              <div className="portal-icon">{portal.icon}</div>
              <div className="portal-info">
                <h3>{portal.type === 'Student' ? t('studentPortal') : portal.type === 'Parent' ? t('parentPortal') : portal.type === 'Faculty' ? t('facultyPortal') : portal.title}</h3>
                <p>{portal.description}</p>
              </div>
              <div className="portal-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="login-footer reveal-on-scroll" style={{ transitionDelay: '0.4s', textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => setShowRecover(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '800', fontSize: '1rem', textDecoration: 'underline', marginBottom: '20px' }}
          >
            {t('forgotId')}
          </button>
          <p>© 2026 Shri Jageshwar Memorial Educational Institute. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
