import React from 'react';
import './AchievementGallery.css';

const AchievementGallery = () => {
    const achievements = [
        {
            id: 1,
            name: 'Aman Gupta',
            class: '10A',
            achievement: '1st Prize in Inter-School Science Fair',
            type: 'Science',
            image: '🏆',
            date: 'March 2026'
        },
        {
            id: 2,
            name: 'Priya Singh',
            class: '9B',
            achievement: 'District Level Badminton Champion',
            type: 'Sports',
            image: '🏸',
            date: 'February 2026'
        },
        {
            id: 3,
            name: 'Kabir Khan',
            class: '12C',
            achievement: '98% in CBSE Board Pre-Mock',
            type: 'Academic',
            image: '📜',
            date: 'March 2026'
        },
        {
            id: 4,
            name: 'Sara Verma',
            class: '8A',
            achievement: 'National Talent Search Finalist',
            type: 'Academic',
            image: '🌟',
            date: 'Jan 2026'
        }
    ];

    return (
        <div className="gallery-container">
            <header className="gallery-header">
                <h2>🏆 Hall of Fame: NSGI Achievers</h2>
                <p>Highlighting excellence in Academics, Sports, and Innovation.</p>
            </header>

            <div className="achievements-grid">
                {achievements.map((item) => (
                    <div className="achievement-card" key={item.id}>
                        <div className="achievement-icon-box" data-type={item.type}>
                            <span className="ach-icon">{item.image}</span>
                        </div>
                        <div className="achievement-info">
                            <span className="ach-type-badge">{item.type}</span>
                            <h3 className="ach-student-name">{item.name}</h3>
                            <p className="ach-class">Class {item.class}</p>
                            <h4 className="ach-title">{item.achievement}</h4>
                            <p className="ach-date">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="submit-achievement-teaser">
                <h3>Got an Achievement?</h3>
                <p>Submit your story to be featured in the Hall of Fame.</p>
                <button>Submit Story</button>
            </div>
        </div>
    );
};

export default AchievementGallery;
