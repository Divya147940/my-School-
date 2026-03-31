import React from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
    const topStudents = [
        { rank: 1, name: 'Tushar Sharma', xp: 4500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tushar', badge: '🏆' },
        { rank: 2, name: 'Priya Verma', xp: 4250, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', badge: '🥈' },
        { rank: 3, name: 'Rahul Dev', xp: 3900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', badge: '🥉' },
        { rank: 4, name: 'Aman Gupta', xp: 3750, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman', badge: '🔥', current: true },
        { rank: 5, name: 'Sneha Kapur', xp: 3600, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', badge: '⭐' }
    ];

    return (
        <div className="leaderboard-container glass-panel">
            <h3 className="section-title">Class Leaderboard 🏆</h3>
            <div className="leaderboard-list">
                {topStudents.map((stu) => (
                    <div key={stu.rank} className={`leaderboard-item ${stu.current ? 'current-player' : ''}`}>
                        <div className="rank-badge">{stu.rank}</div>
                        <img src={stu.avatar} alt={stu.name} className="leader-avatar" />
                        <div className="leader-info">
                            <span className="leader-name">{stu.name} {stu.badge}</span>
                            <span className="leader-xp">{stu.xp} XP</span>
                        </div>
                        {stu.current && <div className="you-tag">YOU</div>}
                    </div>
                ))}
            </div>
            <button className="view-full-btn">See Full School Rankings</button>
        </div>
    );
};

export default Leaderboard;
