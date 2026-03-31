import React from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const SpaceExplorer = () => {
    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const planets = [
        { i: '🌕', n: 'Chandamama (Moon)', msg: "Chandamama door ke... ye hai moon!", color: '#fbbf24' },
        { i: '🌍', n: 'Prithvi (Earth)', msg: "Ye hamari Prithvi hai! Green aur Blue!", color: '#3b82f6' },
        { i: '☀️', n: 'Suraj (Sun)', msg: "Suraj dada bahut garm hain! Hot hot!", color: '#f97316' },
        { i: '🪐', n: 'Shani (Saturn)', msg: "Shani ke paas ek badi si ring hai!", color: '#8b5cf6' }
    ];

    return (
        <div className="space-explorer-container" style={{ textAlign: 'center', padding: '20px', background: '#0f172a', borderRadius: '40px', minHeight: '600px', overflow: 'hidden', position: 'relative' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#fff', fontSize: '3rem', marginBottom: '60px' }}>🚀 Space Explorer</h1>

            <div className="stars-bg" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
                {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} style={{ 
                        position: 'absolute', 
                        left: `${Math.random() * 100}%`, 
                        top: `${Math.random() * 100}%`, 
                        width: '2px', 
                        height: '2px', 
                        background: '#fff', 
                        borderRadius: '50%',
                        animation: `pulse ${Math.random() * 2 + 1}s infinite`
                    }} />
                ))}
            </div>

            <div className="planet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                {planets.map((p, i) => (
                    <div 
                        key={i} 
                        className="module-card anim-bounce" 
                        style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '40px', border: `3px solid ${p.color}`, cursor: 'pointer' }}
                        onClick={() => speak(p.msg)}
                    >
                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{p.i}</div>
                        <h3 style={{ fontSize: '2rem', color: p.color }}>{p.n}</h3>
                        <p style={{ opacity: 0.7 }}>Tap to see magic!</p>
                    </div>
                ))}
            </div>

            <div style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '10rem' }} className="anim-bounce">
                🚀
            </div>

            <style>{`
                .module-card:hover {
                    transform: scale(1.1);
                    background: rgba(255,255,255,0.1);
                    box-shadow: 0 0 30px currentColor;
                }
            `}</style>
        </div>
    );
};

export default SpaceExplorer;
