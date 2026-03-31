import React, { useState, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const BalYoga = () => {
    const [isInhaling, setIsInhaling] = useState(true);
    const [balloonSize, setBalloonSize] = useState(1);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIsInhaling(prev => !prev);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isInhaling) {
            speak("Saans andar lo... hmm...");
            setBalloonSize(1.5);
        } else {
            speak("Saans bahar chhodo... aah...");
            setBalloonSize(1);
        }
    }, [isInhaling]);

    return (
        <div className="bal-yoga-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#8b5cf6', fontSize: '3rem', marginBottom: '60px' }}>🧘 Bal Yoga (Breathing Balloon)</h1>

            <div className="glass-panel" style={{ padding: '80px', borderRadius: '50%', width: '400px', height: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(139, 92, 246, 0.1)', border: '2px solid rgba(139, 92, 246, 0.3)', position: 'relative' }}>
                <div style={{ 
                    width: '200px', 
                    height: '200px', 
                    background: 'radial-gradient(circle, #ec4899, #8b5cf6)', 
                    borderRadius: '50%', 
                    transform: `scale(${balloonSize})`, 
                    transition: 'transform 4s ease-in-out',
                    boxShadow: '0 0 50px rgba(139,92,246,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem'
                }}>
                    🎈
                </div>
                
                {/* Visual Breath Indicators */}
                <div style={{ position: 'absolute', top: '20px', fontSize: '2rem', opacity: isInhaling ? 1 : 0.3, transition: 'opacity 0.5s' }}>⬆️ Saans Andar (In)</div>
                <div style={{ position: 'absolute', bottom: '20px', fontSize: '2rem', opacity: !isInhaling ? 1 : 0.3, transition: 'opacity 0.5s' }}>⬇️ Saans Bahar (Out)</div>
            </div>

            <p style={{ marginTop: '60px', fontSize: '2rem', color: '#fff', fontWeight: 'bold' }}>
                Balloon ke saath saath saans lo! 🌬️✨
            </p>
        </div>
    );
};

export default BalYoga;
