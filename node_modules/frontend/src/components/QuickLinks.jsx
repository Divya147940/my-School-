import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockApi } from '../utils/mockApi';
import './QuickLinks.css';

const quickLinks = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        title: 'Results',
        desc: 'Our Latest Results',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
        ),
        title: 'Downloads',
        desc: 'Download Study Material',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'Have Suggestions?',
        desc: 'Give your suggestion and ask your Query.',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
        ),
        title: 'Print Media',
        desc: 'See our latest Media',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
        title: 'News & Blog',
        desc: 'See Our Latest Updates.',
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
        ),
        title: 'Job Seekers',
        desc: 'Best Platform for Job Seekers.',
    },
];

const QuickLinks = () => {
    const [newsItems, setNewsItems] = useState(mockApi.getNews() || []);
    const [currentNews, setCurrentNews] = useState(0);
    const { t } = useLanguage();

    useEffect(() => {
        if (!newsItems || newsItems.length === 0) return;
        const interval = setInterval(() => {
            setCurrentNews((prev) => (prev + 1) % newsItems.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [newsItems?.length]);

    return (
        <section className="quicklinks-section">
            <div className="quicklinks-container">
                {/* News & Events Panel */}
                <div className="news-panel">
                    <div className="news-header">
                        <span className="news-icon">🔔</span>
                        <h3>{t('latest_updates') || 'News & Events'}</h3>
                    </div>
                    <div className="news-list">
                        {newsItems.length > 0 ? newsItems.map((item, index) => {
                            const dateParts = item.date ? item.date.split(' ') : ['01', 'Jan'];
                            return (
                                <div key={index} className={`news-item ${index === currentNews ? 'active' : ''}`}>
                                    <div className="news-date">
                                        <span className="date-num">{dateParts[0]}</span>
                                        <span className="date-month">{dateParts.slice(1).join(' ')}</span>
                                    </div>
                                    <p className="news-title">{item.title}</p>
                                </div>
                            );
                        }) : (
                            <div className="news-item">
                                <p className="news-title" style={{ opacity: 0.5 }}>No recent updates</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Link Cards Grid */}
                <div className="quicklinks-grid">
                    {quickLinks.map((link, index) => {
                        const targets = ["/admissions", "/academics", "/contact", "/gallery", "/", "/careers"];
                        return (
                            <Link to={targets[index] || "/"} key={index} className="quicklink-card">
                                <div className="quicklink-icon">{link.icon}</div>
                                <h4 className="quicklink-title-badge">{link.title}</h4>
                                <p className="quicklink-desc">{link.desc}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default QuickLinks;
