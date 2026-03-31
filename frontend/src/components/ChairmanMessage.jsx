import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './ChairmanMessage.css';
import chairmanImg from '../assets/chairman.png';

const ChairmanMessage = () => {
    const { t } = useLanguage();
    return (
        <section className="chairman-section">
            <div className="chairman-card">
                <div className="chairman-image-area">
                    <div className="chairman-image-circle">
                        <img src={chairmanImg} alt="Chairman" className="chairman-img-fluid" />
                    </div>
                </div>
                <div className="chairman-text-area">
                    <h2 className="chairman-card-title">{t('chairman_heading')}</h2>
                    <blockquote className="chairman-card-quote">
                        "{t('chairman_quote')}"
                    </blockquote>
                    <p className="chairman-card-description">
                        {t('chairman_text')}
                    </p>
                    <Link to="/chairman-message" className="chairman-card-btn">
                        {t('read_more')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ChairmanMessage;
