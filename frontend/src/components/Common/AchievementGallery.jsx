import { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import './AchievementGallery.css';

const AchievementGallery = () => {
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        setAchievements(mockApi.getAchievers());
    }, []);

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
                            <span className="ach-icon">
                                {item.image && (item.image.startsWith('http') || item.image.startsWith('data:')) ? 
                                    <img src={item.image} alt={item.name} className="ach-photo-img" /> : 
                                    <span className="ach-emoji">{item.image || '🏆'}</span>
                                }
                            </span>
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
