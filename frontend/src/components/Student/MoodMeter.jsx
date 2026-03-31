import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const MoodMeter = () => {
    const [selectedMood, setSelectedMood] = useState(null);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const moods = [
        { i: '😊', n: 'Happy', msg: "Vaah! Aap khush ho, main bhi khush hoon! Naacho!" },
        { i: '😢', n: 'Sad', msg: "Udaas mat ho! Chalo main aapko ek joke sunata hoon: Ek baar ek hathi ne..." },
        { i: '😴', n: 'Sleepy', msg: "Arey! Thake hue ho? Thoda aaram karo, phir kheleinge!" },
        { i: '🤩', n: 'Excited', msg: "Super! Itni energy! Chalo kuch magic karte hain!" }
    ];

    return (
        <div className="mood-meter-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#ec4899', fontSize: '3rem', marginBottom: '60px' }}>🌈 Mera Mood (Mood Meter)</h1>

            <div className="glass-panel" style={{ padding: '60px', borderRadius: '40px', border: '2px solid #ec4899', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ fontSize: '2rem', marginBottom: '40px' }}>Aaj aap kaisa feel kar rahe ho? 🧐</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
                    {moods.map(m => (
                        <div 
                            key={m.n} 
                            className="module-card anim-bounce"
                            style={{ 
                                padding: '40px', 
                                background: selectedMood === m.n ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)', 
                                borderRadius: '30px', 
                                border: `3px solid ${selectedMood === m.n ? '#ec4899' : 'rgba(255,255,255,0.1)'}`,
                                cursor: 'pointer'
                            }}
                            onClick={() => { setSelectedMood(m.n); speak(m.msg); }}
                        >
                            <div style={{ fontSize: '8rem', marginBottom: '15px' }}>{m.i}</div>
                            <h3 style={{ fontSize: '2rem' }}>{m.n}</h3>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMood && (
                <div style={{ marginTop: '50px' }} className="anim-wiggle">
                    <div style={{ fontSize: '10rem' }}>🐻</div>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>Bholu keh raha hai: {moods.find(m => m.n === selectedMood).msg}</p>
                </div>
            )}

            <style>{`
                .module-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 10px 30px rgba(236, 72, 153, 0.3);
                }
            `}</style>
        </div>
    );
};

export default MoodMeter;
