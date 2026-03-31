import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageToggle.css';

const LanguageToggle = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button className="lang-toggle-btn" onClick={toggleLanguage}>
            <span className="lang-icon">🌐</span>
            <span className="lang-text">{language === 'en' ? 'हिन्दी' : 'English'}</span>
        </button>
    );
};

export default LanguageToggle;
