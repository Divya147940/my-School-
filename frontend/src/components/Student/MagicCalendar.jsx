import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const MagicCalendar = () => {
    const [selectedDay, setSelectedDay] = useState(null);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const days = Array.from({ length: 30 }, (_, i) => ({
        d: i + 1,
        s: ['🎁', '🍕', '🎡', '🎈', '🎸', '🍦', '🍩', '🚲', '🛹', '🛸'][i % 10],
        msg: `Aaj ka surprise toh bahut badiya hai! Dekho kya mila! ✨`
    }));

    const handleTap = (day) => {
        setSelectedDay(day.d);
        speak(day.msg);
    };

    return (
        <div className="magic-calendar-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#06b6d4', fontSize: '3rem', marginBottom: '60px' }}>📅 Magical Calendar</h1>

            <div className="calendar-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)', 
                gap: '15px', 
                maxWidth: '800px', 
                margin: '0 auto',
                background: 'rgba(255,255,255,0.05)',
                padding: '30px',
                borderRadius: '40px',
                border: '2px solid rgba(255,255,255,0.1)'
            }}>
                {days.map(day => (
                    <div 
                        key={day.d} 
                        className="day-card anim-bounce"
                        style={{ 
                            padding: '20px', 
                            background: selectedDay === day.d ? 'linear-gradient(135deg, #06b6d4, #3b82f6)' : 'rgba(255,255,255,0.1)', 
                            borderRadius: '15px', 
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#fff',
                            transition: 'all 0.3s'
                        }}
                        onClick={() => handleTap(day)}
                    >
                        {selectedDay === day.d ? day.s : day.d}
                    </div>
                ))}
            </div>

            {selectedDay && (
                <div style={{ marginTop: '40px', fontSize: '10rem' }} className="anim-rotate">
                    {days.find(d => d.d === selectedDay).s}
                </div>
            )}

            <style>{`
                .day-card:hover {
                    transform: scale(1.1);
                    background: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default MagicCalendar;
