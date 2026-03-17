import React from 'react';
import { Link } from 'react-router-dom';
import './TopBar.css';
import logo from '../assets/school-logo.png';

// Elite Institutional Header - Vercel Deployment Trigger
const TopBar = () => {
    return (
        <header className="main-header">
            {/* Upper Elite Bar - For News & Socials */}
            <div className="upper-bar">
                <div className="upper-container">
                    <div className="news-ticker">
                        <span className="news-label">LATEST</span>
                        <p className="news-text">Admissions Open for Session 2024-25 • Excellence in Education Since 1998</p>
                    </div>
                    <div className="upper-links">
                        <a href="#" className="upper-link">Alumni</a>
                        <a href="#" className="upper-link">Careers</a>
                        <Link to="/login" className="upper-link">Portal Login</Link>
                        <div className="social-mini">
                            <a href="#" className="social-icon-mini">FB</a>
                            <a href="#" className="social-icon-mini">IG</a>
                            <a href="#" className="social-icon-mini">YT</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Branding & Contact Bar */}
            <div className="topbar-main">
                <div className="topbar-container">
                    <div className="brand-elite">
                        <div className="logo-box">
                            <img src={logo} alt="Shri Jageshwar Memorial Logo" className="logo-main" />
                        </div>
                        <div className="brand-info">
                            <h1 className="brand-title">SHRI JAGESHWAR MEMORIAL</h1>
                            <h2 className="brand-subtitle">EDUCATIONAL INSTITUTE</h2>
                            <div className="brand-motto">
                                <span className="motto-dot"></span>
                                <p className="motto-text">Shaping futures through quality education</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-nodes">
                        <div className="contact-node">
                            <div className="node-icon call">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div className="node-details">
                                <span className="detail-label">Admission Helpline</span>
                                <a href="tel:+919792799550" className="detail-value">+91 9792799550</a>
                            </div>
                        </div>

                        <div className="contact-node">
                            <div className="node-icon mail">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <div className="node-details">
                                <span className="detail-label">Official Email</span>
                                <a href="mailto:divyanshiverma@gmail.com" className="detail-value">divyanshiverma@gmail.com</a>
                            </div>
                        </div>

                        <div className="contact-node">
                            <div className="node-icon loc">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div className="node-details">
                                <span className="detail-label">Campus Location</span>
                                <address className="detail-value">Laxman Ganj, Tiloi, Amethi</address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
