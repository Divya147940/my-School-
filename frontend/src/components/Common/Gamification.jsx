import React, { useState, useEffect } from 'react';
import GamificationEngine from '../../utils/GamificationEngine';
import './Gamification.css';

const Gamification = ({ studentName }) => {
    const [stats, setStats] = useState(GamificationEngine.getStats());
    const [isLevelingUp, setIsLevelingUp] = useState(false);

    useEffect(() => {
        const handleUpdate = (e) => {
            setStats(e.detail);
        };

        const handleLevelUp = () => {
            setIsLevelingUp(true);
            setTimeout(() => setIsLevelingUp(false), 5000);
        };

        window.addEventListener('gamificationUpdate', handleUpdate);
        window.addEventListener('levelUp', handleLevelUp);

        return () => {
            window.removeEventListener('gamificationUpdate', handleUpdate);
            window.removeEventListener('levelUp', handleLevelUp);
        };
    }, []);

    const { level, xp, nextLevelXp, badges } = stats;
    const progress = (xp / nextLevelXp) * 100;

    return (
        <div className={`gamification-card glass-panel ${isLevelingUp ? 'level-up-glow' : ''}`}>
            {isLevelingUp && (
                <div className="level-up-banner">
                    <span className="sparkle">✨</span>
                    LEVEL UP! Lvl {level}
                    <span className="sparkle">✨</span>
                </div>
            )}
            
            <div className="gamification-header">
                <div className="level-badge">Lvl {level}</div>
                <div className="student-rank">#4 in Class 10A</div>
            </div>
            
            <div className="profile-section">
                <div className="avatar-wrapper">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentName}`} alt="avatar" />
                    <div className="online-indicator"></div>
                </div>
                <div className="xp-info">
                    <div className="xp-text">
                        <span>XP {xp} / {nextLevelXp}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="xp-bar-bg">
                        <div className="xp-bar-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="badges-mini-gallery">
                {badges.map((badge, index) => (
                    <div key={index} className="mini-badge" title={badge.name}>
                        {badge.icon}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gamification;
