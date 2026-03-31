import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const JuniorDashboardAnimations = () => {
    const { theme } = useTheme();
    const [stars, setStars] = useState([]);

    // Mouse Trail Logic - Magic Dust
    useEffect(() => {
        const handleMouseMove = (e) => {
            const types = ['⭐', '✨', '🪄', '🔆', '❄️'];
            const newStar = {
                id: Date.now() + Math.random(),
                x: e.clientX,
                y: e.clientY,
                type: types[Math.floor(Math.random() * types.length)],
                size: Math.random() * 25 + 10,
                color: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a855f7', '#fb923c'][Math.floor(Math.random() * 6)],
                rotation: Math.random() * 360
            };
            setStars(prev => [...prev.slice(-25), newStar]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Cleanup stars
    useEffect(() => {
        const timer = setInterval(() => {
            setStars(prev => prev.filter(s => Date.now() - s.id < 1200));
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const MagicBackground = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: theme === 'dark' ? '#020617' : 'transparent',
            zIndex: -2,
            pointerEvents: 'none',
            display: theme === 'dark' ? 'block' : 'none'
        }}>
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0) 0%, rgba(2, 6, 23, 1) 100%)',
                opacity: 0.8
            }}></div>
            <div className="ambient-particles"></div>
        </div>
    );

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -10, overflow: 'hidden' }}>
            <MagicBackground />

            {/* Mouse Trail Stars */}
            {stars.map(star => (
                <div 
                    key={star.id}
                    style={{
                        position: 'fixed',
                        left: star.x,
                        top: star.y,
                        fontSize: `${star.size}px`,
                        color: star.color,
                        textShadow: `0 0 10px ${star.color}, 0 0 20px ${star.color}`,
                        transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
                        animation: 'starMagic 1.2s forwards',
                        pointerEvents: 'none',
                        opacity: 0.8
                    }}
                >
                    {star.type}
                </div>
            ))}

            <style>{`
                @keyframes starMagic {
                    0% { transform: translate(-50%, -50%) scale(0.2) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; scale: 1.2; }
                    100% { transform: translate(-50%, -50%) scale(0.5) rotate(270deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default JuniorDashboardAnimations;
