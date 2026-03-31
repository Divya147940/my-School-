import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const HabitHero = () => {
    const [habits, setHabits] = useState([
        { id: 1, n: 'Brush Teath', i: '🪥', done: false, msg: "Shabash! Daant saaf, toh sehat jaaf!" },
        { id: 2, n: 'Wash Hands', i: '🧼', done: false, msg: "Kitanu bhag gaye! Very good!" },
        { id: 3, n: 'Eat Fruit', i: '🍎', done: false, msg: "Yum! Aap toh Super Hero ban gaye!" }
    ]);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const completeHabit = (id) => {
        setHabits(habits.map(h => h.id === id ? { ...h, done: true } : h));
        const h = habits.find(h => h.id === id);
        speak(h.msg);
    };

    return (
        <div className="habit-hero-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#fbbf24', fontSize: '3rem', marginBottom: '40px' }}>🦸‍♂️ Healthy Habit Hero</h1>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '40px', border: '2px solid #fbbf24' }}>
                <p style={{ fontSize: '1.8rem', marginBottom: '40px' }}>Aaj aapne kya magic kiya? ✨</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {habits.map(h => (
                        <div 
                            key={h.id} 
                            onClick={() => !h.done && completeHabit(h.id)}
                            className="module-card anim-bounce"
                            style={{ 
                                padding: '30px', 
                                background: h.done ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)', 
                                borderRadius: '30px', 
                                border: `2px solid ${h.done ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                                cursor: h.done ? 'default' : 'pointer'
                            }}
                        >
                            <div style={{ fontSize: '6rem', marginBottom: '10px' }}>{h.i}</div>
                            <h3 style={{ color: h.done ? '#22c55e' : '#fff' }}>{h.n}</h3>
                            {h.done && <div style={{ fontSize: '2rem' }}>✅ HERO!</div>}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .module-card:hover:not(.done) {
                    transform: scale(1.05);
                    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
                }
            `}</style>
        </div>
    );
};

export default HabitHero;
