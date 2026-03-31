import React from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const StarAwards = () => {
    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const badges = [
        { id: 1, n: 'Super Singer', i: '🎤', unlocked: true, msg: "Aap toh rockstar ho! Super Singer!" },
        { id: 2, n: 'Fast Learner', i: '🚀', unlocked: true, msg: "Bahut tez! Fast Learner award!" },
        { id: 3, n: 'Kind Heart', i: '❤️', unlocked: false, msg: "Sabki help karo aur ye badge pao!" },
        { id: 4, n: 'Magic Artist', i: '🎨', unlocked: true, msg: "Wow! Kya drawing hai! Magic Artist!" },
        { id: 5, n: 'Healthy Hero', i: '🍎', unlocked: false, msg: "Sahi khana khao aur ye badge pao!" }
    ];

    return (
        <div className="star-awards-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#fbbf24', fontSize: '3rem', marginBottom: '60px' }}>🏆 Junior Star Awards</h1>

            <div className="badge-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
                {badges.map(b => (
                    <div 
                        key={b.id} 
                        className={`badge-card ${b.unlocked ? 'anim-bounce' : 'locked'}`}
                        style={{ 
                            padding: '30px', 
                            background: b.unlocked ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)', 
                            borderRadius: '30px', 
                            border: `3px solid ${b.unlocked ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                            cursor: 'pointer',
                            position: 'relative',
                            filter: b.unlocked ? 'none' : 'grayscale(1)'
                        }}
                        onClick={() => b.unlocked ? speak(b.msg) : speak("Abhi ye band hai! Mehnat karo!")}
                    >
                        <div style={{ fontSize: '6rem', marginBottom: '15px' }}>{b.i}</div>
                        <h3 style={{ color: b.unlocked ? '#fff' : 'rgba(255,255,255,0.3)' }}>{b.n}</h3>
                        {!b.unlocked && <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '2rem' }}>🔒</div>}
                        {b.unlocked && <div className="shimmer-effect" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)', animation: 'shimmer 2s infinite' }} />}
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .badge-card:hover {
                    transform: scale(1.1) rotate(2deg);
                    box-shadow: 0 0 30px rgba(251, 191, 36, 0.4);
                }
            `}</style>
        </div>
    );
};

export default StarAwards;
