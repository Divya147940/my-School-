import React from 'react';
import './TopBar.css';
import logo from '../assets/school-logo.png';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-container">
        {/* Logo & School Name */}
        <div className="topbar-brand">
          <img src={logo} alt="Shri Jageshwar Memorial Logo" className="topbar-logo" />
          <div className="topbar-brand-text">
            <h1 className="topbar-title">SHRI JAGESHWAR MEMORIAL</h1>
            <h2 className="topbar-subtitle">EDUCATIONAL INSTITUTE</h2>
            <p className="topbar-tagline">Shaping futures through quality education</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="topbar-contacts">
          <div className="topbar-contact-item">
            <div className="topbar-icon phone-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1.003 1.003 0 011.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <div className="topbar-contact-text">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">+91 9792799550</span>
            </div>
          </div>

          <div className="topbar-contact-item">
            <div className="topbar-icon email-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
            <div className="topbar-contact-text">
              <span className="contact-label">Email:</span>
              <span className="contact-value">divyanshiverma@gmal.com</span>
            </div>
          </div>

          <div className="topbar-contact-item">
            <div className="topbar-icon address-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
              </svg>
            </div>
            <div className="topbar-contact-text">
              <span className="contact-label">Address:</span>
              <span className="contact-value">Laxman Ganj, Tiloi, Amethi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
