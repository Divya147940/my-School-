import React, { useState, useEffect, useRef } from 'react';
import './AlumniHallOfFame.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';
import Skeleton from '../Common/Skeleton';
import useScrollReveal from '../../hooks/useScrollReveal';

const AlumniHallOfFame = () => {
    const { language } = useLanguage();
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [transformedTitle, setTransformedTitle] = useState(language === 'hi' ? 'हमारे प्रतिभाशाली सितारे' : 'Our Shining Stars');
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    
    useEffect(() => {
        const data = mockApi.getAlumni();
        setAlumni(Array.isArray(data) ? data : []);
        setLoading(false);
        
        // Hacker Text Reveal Effect
        const originalText = language === 'hi' ? 'हमारे प्रतिभाशाली सितारे' : 'Our Shining Stars';
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let iteration = 0;
        let interval = setInterval(() => {
            setTransformedTitle(originalText.split("").map((letter, index) => {
                if(index < iteration) return originalText[index];
                return letters[Math.floor(Math.random() * 26)];
            }).join(""));
            if(iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
        return () => clearInterval(interval);
    }, [language]);

    // Auto-slide logic
    useEffect(() => {
        if (alumni.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % alumni.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [alumni.length]);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
    };

    if (loading) return (
        <div className="alumni-section">
            <div className="alumni-carousel-container">
                <Skeleton height="400px" borderRadius="30px" />
            </div>
        </div>
    );

    return (
        <section className="alumni-section" ref={sectionRef}>
            {/* Floating Background Orbs */}
            <div className="bg-orb orb-1"></div>
            <div className="bg-orb orb-2"></div>
            <div className="bg-orb orb-3"></div>

            <div className="alumni-header anim-fade-in">
                <span className="alumni-subtitle">{language === 'hi' ? 'हमारी विरासत' : 'OUR LEGACY'}</span>
                <h2 className="alumni-title hacker-text">
                    {transformedTitle}
                </h2>
                <div className="title-underline"></div>
            </div>

            <div className="alumni-carousel-container">
                <div className="alumni-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {alumni.map((person, index) => (
                        <div key={person.id} className="alumni-slide">
                            <div 
                                className="alumni-card glass-panel reveal-on-scroll"
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                style={{ 
                                    '--delay': `${index * 0.1}s`,
                                }}
                            >
                                <div className="alumni-avatar">
                                    {person.image && (person.image.startsWith('http') || person.image.startsWith('data:')) ? (
                                        <img src={person.image} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span className="avatar-icon">{person.image || '🎓'}</span>
                                    )}
                                    <div className="image-shine"></div>
                                </div>
                                <div className="alumni-details">
                                    <h4 className="alumni-name">{person.name}</h4>
                                    <div className="alumni-batch">{person.batch}</div>
                                    <div className="alumni-role">{person.position}</div>
                                    <p className="alumni-quote">"{person.achievement}"</p>
                                </div>
                                <div className="card-decoration"></div>
                                <div className="card-border-glow"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {alumni.length > 1 && (
                    <div className="alumni-dots">
                        {alumni.map((_, index) => (
                            <button
                                key={index}
                                className={`alumni-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AlumniHallOfFame;
