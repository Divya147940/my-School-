import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [aboutDropdown, setAboutDropdown] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        setAboutDropdown(false); // Close dropdown when menu toggles
    };

    const toggleAboutDropdown = (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            setAboutDropdown(!aboutDropdown);
        }
    };

    const closeMenu = () => {
        setMenuOpen(false);
        setAboutDropdown(false);
    };

    const isActive = (path) => location.pathname === path;

    const { t, language } = useLanguage();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link to="/" className={`nav-link ${isActive('/') ? 'active-link' : ''}`} onClick={closeMenu}>{t('home')}</Link></li>

                    <li className={`nav-item dropdown ${aboutDropdown ? 'dropdown-active' : ''}`}>
                        <Link
                            to="/about"
                            className={`nav-link dropdown-toggle ${isActive('/about') || isActive('/vision-mission') || isActive('/social-work') ? 'active-link' : ''}`}
                            onClick={toggleAboutDropdown}
                        >
                            {t('about')} <span className="arrow-icon">▼</span>
                        </Link>
                        <ul className="dropdown-menu">
                            <li><Link to="/about" onClick={closeMenu}>{language === 'hi' ? 'एनएसजीआई के बारे में' : 'About NSGI'}</Link></li>
                            <li><Link to="/about" onClick={closeMenu}>{language === 'hi' ? 'अध्यक्ष का संदेश' : 'Chairman Message'}</Link></li>
                            <li><Link to="/vision-mission" onClick={closeMenu}>{language === 'hi' ? 'दृष्टि एवं लक्ष्य' : 'Vision & Mission'}</Link></li>
                            <li><Link to="/facilities" onClick={closeMenu}>{t('facilities')}</Link></li>
                            <li><Link to="/achievements" onClick={closeMenu}>{language === 'hi' ? 'उपलब्धियां' : 'Achievements'}</Link></li>
                            <li><Link to="/social-work" onClick={closeMenu}>{language === 'hi' ? 'सामाजिक कार्य' : 'Social Work'}</Link></li>
                        </ul>
                    </li>

                    <li><Link to="/academics" className={`nav-link ${isActive('/academics') ? 'active-link' : ''}`} onClick={closeMenu}>{t('academics')}</Link></li>
                    <li><Link to="/admissions" className={`nav-link ${isActive('/admissions') ? 'active-link' : ''}`} onClick={closeMenu}>{language === 'hi' ? 'प्रवेश' : 'Admissions'}</Link></li>
                    <li><Link to="/faculty" className={`nav-link ${isActive('/faculty') ? 'active-link' : ''}`} onClick={closeMenu}>{language === 'hi' ? 'शिक्षक' : 'Faculty'}</Link></li>
                    <li><Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active-link' : ''}`} onClick={closeMenu}>{t('gallery')}</Link></li>
                    
                    <li className="nav-item dropdown">
                        <a href="#" className={`nav-link dropdown-toggle ${isActive('/virtual-tour') || isActive('/school-map') ? 'active-link' : ''}`} onClick={(e) => { e.preventDefault(); }}>
                            {language === 'hi' ? 'एक्सप्लोर' : 'Explore'} <span className="arrow-icon">▼</span>
                        </a>
                        <ul className="dropdown-menu">
                            <li><Link to="/virtual-tour" onClick={closeMenu}>{language === 'hi' ? '360° वर्चुअल टूर' : '360° Virtual Tour'}</Link></li>
                            <li><Link to="/school-map" onClick={closeMenu}>{language === 'hi' ? 'कैंपस मैप' : 'Campus Map'}</Link></li>
                        </ul>
                    </li>

                    <li><Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active-link' : ''}`} onClick={closeMenu}>{t('contact')}</Link></li>
                    <li><Link to="/login" className={`nav-link ${isActive('/login') ? 'active-link' : ''}`} onClick={closeMenu}>{t('login')}</Link></li>
                </ul>

                <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
                    <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
