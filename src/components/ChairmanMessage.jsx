import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ChairmanMessage.css';
import chairmanImg from '../assets/chairman.png';

const ChairmanMessage = () => {
    const { t } = useLanguage();
    return (
        <section className="chairman-section">
            <div className="chairman-container">
                <div className="chairman-image-wrapper">
                    <img src={chairmanImg} alt="Chairman" className="chairman-image" />
                </div>
                <div className="chairman-content">
                    <h2 className="chairman-heading">{t('chairman_heading')}</h2>
                    <blockquote className="chairman-quote">
                        "{t('chairman_quote')}"
                    </blockquote>
                    <p className="chairman-text">
                        {t('chairman_text')}
                    </p>
                    <Link to="/about" className="chairman-btn">{t('read_more')}</Link>
                </div>
            </div>
        </section>
    );
};

export default ChairmanMessage;
