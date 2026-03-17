import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
    const { lang, toggleLanguage } = useLanguage();

    return (
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
            <span className="lang-icon">🌐</span>
            <span className="lang-text">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>
    );
};

export default LanguageToggle;
