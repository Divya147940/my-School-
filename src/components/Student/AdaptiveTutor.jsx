import React from 'react';
import './AdaptiveTutor.css';

const AdaptiveTutor = ({ skillData }) => {
    if (!skillData || skillData.length === 0) return null;

    // Logic to find lowest skill
    const sortedSkills = [...skillData].sort((a, b) => (a.A / a.fullMark) - (b.A / b.fullMark));
    const focusSkill = sortedSkills[0];

    const recommendations = [
        { id: 1, title: `Mastering ${focusSkill.subject}`, type: 'video', duration: '15 mins', difficulty: 'Beginner' },
        { id: 2, title: `${focusSkill.subject} Practice Quiz`, type: 'quiz', questions: 10, difficulty: 'Intermediate' },
        { id: 3, title: 'Advanced Logic & Reasoning', type: 'reading', pages: 5, difficulty: 'Expert' }
    ];

    return (
        <div className="adaptive-tutor-container glass-panel">
            <div className="tutor-header">
                <h3>Adaptive AI Tutor 🧠</h3>
                <span className="ai-badge">Personalized for you</span>
            </div>

            <div className="analysis-alert">
                <div className="alert-icon">⚡</div>
                <div className="alert-text">
                    <strong>Insight:</strong> Aapka <b>{focusSkill.subject}</b> score thoda low hai ({Math.round(focusSkill.A/focusSkill.fullMark*100)}%). Humne aapke liye ek personalized path tayaar kiya hai.
                </div>
            </div>

            <div className="rec-list">
                {recommendations.map(rec => (
                    <div key={rec.id} className="rec-item">
                        <div className="rec-type-icon">
                            {rec.type === 'video' && '🎥'}
                            {rec.type === 'quiz' && '🧠'}
                            {rec.type === 'reading' && '📖'}
                        </div>
                        <div className="rec-info">
                            <h4>{rec.title}</h4>
                            <div className="rec-meta">
                                <span>{rec.duration || `${rec.questions} Qs` || `${rec.pages} pages`}</span>
                                <span className={`diff-badge ${rec.difficulty.toLowerCase()}`}>{rec.difficulty}</span>
                            </div>
                        </div>
                        <button className="start-btn">Start</button>
                    </div>
                ))}
            </div>
            
            <div className="skill-improvement-chart">
                <p>Predicted Score Improvement: <b>+15%</b> in 2 weeks</p>
            </div>
        </div>
    );
};

export default AdaptiveTutor;
