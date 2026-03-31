import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const MagicNote = () => {
    const [isOpen, setIsOpen] = useState(false);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const teacherMessage = "Mera Pyara Bacha! Aapne aaj bahut acha kaam kiya hai. Main aapse bahut khush hoon! Keep it up! ✨❤️";

    const handleOpen = () => {
        setIsOpen(true);
        speak(teacherMessage);
    };

    return (
        <div className="magic-note-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#8b5cf6', fontSize: '3rem', marginBottom: '60px' }}>📢 Teacher's Magic Note</h1>

            <div className="glass-panel" style={{ padding: '60px', borderRadius: '40px', border: '2px solid #8b5cf6', maxWidth: '600px', margin: '0 auto', cursor: 'pointer' }} onClick={handleOpen}>
                {!isOpen ? (
                    <div className="anim-bounce">
                        <div style={{ fontSize: '12rem', marginBottom: '20px' }}>✉️</div>
                        <h2 style={{ fontSize: '2.5rem', color: '#fff' }}>Aapke liye ek Shubh Sandesh!</h2>
                        <p style={{ opacity: 0.7 }}>Tap to open magic mail!</p>
                    </div>
                ) : (
                    <div className="anim-wiggle">
                        <div style={{ fontSize: '12rem', marginBottom: '20px' }}>📜</div>
                        <h2 style={{ fontSize: '2rem', color: '#fbbf24', lineHeight: '1.5' }}>"{teacherMessage}"</h2>
                        <div style={{ marginTop: '30px', fontSize: '1.5rem', color: '#fff' }}>- Aapki Teacher 👩‍🏫</div>
                        <button className="magic-btn" style={{ marginTop: '30px' }} onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>Close Mail</button>
                    </div>
                )}
            </div>

            <style>{`
                .magic-btn {
                    padding: 15px 30px;
                    border-radius: 20px;
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    font-weight: bold;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default MagicNote;
