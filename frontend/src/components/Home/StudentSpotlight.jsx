import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import './StudentSpotlight.css';

const StudentSpotlight = () => {
    const { language } = useLanguage();
    const [spotlight, setSpotlight] = useState(null);

    useEffect(() => {
        setSpotlight(mockApi.getSpotlight());
    }, []);

    if (!spotlight) return null;

    return (
        <div className="student-spotlight-wrapper glass-panel reveal-content">
            <div className="spotlight-badge">
                <span className="star-icon">🌟</span>
                {language === 'hi' ? 'महीने का सितारा' : spotlight.title || 'Star of the Month'}
            </div>
            
            <div className="spotlight-content">
                <div className="student-image-container">
                    <div className="glow-ring ring-1"></div>
                    <div className="glow-ring ring-2"></div>
                    <img 
                        src={spotlight.photo || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400'} 
                        alt={spotlight.name} 
                        className="student-photo"
                    />
                </div>

                <div className="student-details">
                    <h2 className="student-name">{spotlight.name}</h2>
                    <div className="achievement-tags">
                        {(spotlight.achievements || ['Academic Excellence']).map((tag, i) => (
                            <span key={i} className="tag-pill">{tag}</span>
                        ))}
                    </div>
                    <p className="student-story">
                        "{spotlight.description}"
                    </p>
                    <div className="spotlight-footer">
                        <span className="quote-mark">“</span>
                        <p className="motivational-line">
                            {language === 'hi' ? 'हर बच्चा एक सितारा है, बस उसे चमकने का मौका चाहिए।' : 'Every child is a star, they just need an opportunity to shine.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentSpotlight;
