import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const AIStoryland = () => {
    const [storyStep, setStoryStep] = useState(0);
    const [storyLog, setStoryLog] = useState([]);
    const [isFinished, setIsFinished] = useState(false);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9; // Cartoon voice
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const storyPaths = [
        {
            q: "Chalo ek kahani shuru karte hain! Ek chota sa haathi jungle mein tha... use bhook lagi thi! Wo kya khaye?",
            options: [
                { i: '🍌', l: 'Kela (Banana)', next: 1, msg: "Haathi ne kela khaya! Yum yum!" },
                { i: '🥥', l: 'Nariyal (Coconut)', next: 1, msg: "Haathi ne nariyal toda! Crack!" }
            ]
        },
        {
            q: "Khana khane ke baad, haathi ko ek dost mila! Kaun tha wo?",
            options: [
                { i: '🐒', l: 'Bandar (Monkey)', next: 2, msg: "Bandar ke saath haathi ne dance kiya!" },
                { i: '🦁', l: 'Sher (Lion)', next: 2, msg: "Sher ne haathi ko rasta bataya!" }
            ]
        },
        {
            q: "Dost ke saath haathi kahan gaya?",
            options: [
                { i: '🌊', l: 'Nadi (River)', next: -1, msg: "Dono ne nadi mein khoob masti ki! Chapaak!" },
                { i: '🏠', l: 'Ghar (Home)', next: -1, msg: "Haathi apne ghar chala gaya! Bye bye!" }
            ]
        }
    ];

    const handleChoice = (opt) => {
        speak(opt.msg);
        setStoryLog([...storyLog, opt]);
        if (opt.next === -1) {
            setIsFinished(true);
            speak("Kahani khatam! Aapne bahut achi kahani banayi!");
        } else {
            setStoryStep(opt.next);
        }
    };

    const resetStory = () => {
        setStoryStep(0);
        setStoryLog([]);
        setIsFinished(false);
        speak("Chalo phir se shuru karte hain!");
    };

    return (
        <div className="storyland-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#8b5cf6', fontSize: '3rem', marginBottom: '40px' }}>📖 AI Storyland</h1>

            {!isFinished ? (
                <div className="glass-panel" style={{ padding: '40px', borderRadius: '40px', border: '2px solid #8b5cf6' }}>
                    <div style={{ fontSize: '10rem', marginBottom: '30px' }} className="anim-bounce">
                        {storyStep === 0 ? '🐘' : storyLog[storyLog.length - 1].i}
                    </div>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: '1.6', color: '#fff' }}>
                        {storyPaths[storyStep].q}
                    </p>
                    <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginTop: '40px' }}>
                        {storyPaths[storyStep].options.map((opt, i) => (
                            <button key={i} className="magic-btn" style={{ fontSize: '2rem', padding: '30px' }} onClick={() => handleChoice(opt)}>
                                <span style={{ fontSize: '4rem', display: 'block' }}>{opt.i}</span>
                                {opt.l}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-panel" style={{ padding: '60px', borderRadius: '40px' }}>
                    <h2 style={{ fontSize: '3rem', color: '#fbbf24' }}>Wow! Badi Sunder Kahani! 🌟</h2>
                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', margin: '40px 0', fontSize: '5rem' }}>
                        <span>🐘</span> {storyLog.map((s, i) => <span key={i}>➡️ {s.i}</span>)}
                    </div>
                    <button className="magic-btn" onClick={resetStory}>Nayi Kahani Shuru Karo</button>
                </div>
            )}

            <style>{`
                .magic-btn {
                    background: linear-gradient(135deg, #8b5cf6, #ec4899);
                    border: none;
                    border-radius: 30px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
                }
                .magic-btn:hover {
                    transform: scale(1.1) rotate(2deg);
                    box-shadow: 0 15px 30px rgba(139, 92, 246, 0.5);
                }
            `}</style>
        </div>
    );
};

export default AIStoryland;
