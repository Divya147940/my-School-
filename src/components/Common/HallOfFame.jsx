import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useTheme } from '../../context/ThemeContext';
import './HallOfFame.css';

const HallOfFame = () => {
  const { theme } = useTheme();
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    setLeaders(mockApi.getLeaderboard().sort((a, b) => b.points - a.points));
  }, []);

  return (
    <div className={`hall-of-fame-container ${theme === 'light' ? 'light-mode' : ''}`}>
      <div className="hof-header">
        <h2 className="section-title">🏆 NSGI Hall of Fame</h2>
        <p className="section-subtitle">Celebrating our top achievers and merit leaders.</p>
      </div>

      <div className="hof-podium">
        {leaders.slice(0, 3).map((student, idx) => (
          <div key={student.id} className={`podium-card podium-${idx + 1} glass-panel shadow-glow`}>
            <div className="rank-badge">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
            <div className="avatar-large">{student.name.charAt(0)}</div>
            <h3>{student.name}</h3>
            <div className="merit-points">{student.points} PTS</div>
            <div className="badges-list">
              {student.badges.map((b, i) => <span key={i} className="badge-tag">{b}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="hof-list feature-box glass-panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Merit Points</th>
              <th>Recent Badges</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((student, idx) => (
              <tr key={student.id}>
                <td># {idx + 1}</td>
                <td><strong>{student.name}</strong></td>
                <td><span className="points-pill">{student.points}</span></td>
                <td>
                  <div className="table-badges">
                    {student.badges.map((b, i) => <span key={i} className="small-badge">{b.split(' ')[0]}</span>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HallOfFame;
