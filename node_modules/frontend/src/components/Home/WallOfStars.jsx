import React from 'react';
import './WallOfStars.css';
import { useLanguage } from '../../context/LanguageContext';

const WallOfStars = () => {
    const { language } = useLanguage();
    
    const stars = [
        { name: "Aarav Sharma", rank: "1st Rank (Boards)", class: "Class 12", quote: "Excellence is not an act, but a habit.", color: "#fbbf24" },
        { name: "Sanya Patel", rank: "Sports Star", class: "Class 10", quote: "Perseverance transforms dreams into reality.", color: "#3b82f6" },
        { name: "Ishaan Singh", rank: "National Quiz Winner", class: "Class 11", quote: "Knowledge is the real power.", color: "#8b5cf6" },
        { name: "Meera Reddy", rank: "Arts Excellence", class: "Class 9", quote: "Every child is an artist.", color: "#ec4899" }
    ];

    return (
        <div className="wall-of-stars-container">
            <div className="parallax-bg-text">CHAMPIONS</div>
            <h2 className="section-title-gold">
                {language === 'hi' ? 'हमारे प्रतिभाशाली सितारे' : 'Our Shining Stars'} 🌟
            </h2>
            
            <div className="stars-scroll-wrapper">
                <div className="stars-track">
                    {/* Duplicate for infinite loop effect if needed, but here we use a smooth flex scroll */}
                    {stars.map((star, i) => (
                        <div key={i} className="star-card glass-panel" style={{ '--accent': star.color }}>
                            <div className="star-rank-badge">{star.rank}</div>
                            <div className="star-avatar">
                                <div className="avatar-glow"></div>
                                <span className="star-icon">★</span>
                            </div>
                            <h3 className="star-name">{star.name}</h3>
                            <span className="star-class">{star.class}</span>
                            <p className="star-quote">{star.quote}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="parallax-footer">
                <div className="floating-particle p1"></div>
                <div className="floating-particle p2"></div>
                <div className="floating-particle p3"></div>
            </div>
        </div>
    );
};

export default WallOfStars;
