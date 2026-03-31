import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './BottomNav.css';

const BottomNav = () => {
    const { t } = useLanguage();

    return (
        <nav className="mobile-bottom-nav">
            <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <div className="bottom-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <span>{t('home') || 'Home'}</span>
            </NavLink>
            <NavLink to="/academics" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <div className="bottom-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                </div>
                <span>{t('academics') || 'Learn'}</span>
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <div className="bottom-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <span>{t('gallery') || 'Gallery'}</span>
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <div className="bottom-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <span>{t('login') || 'Profile'}</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
