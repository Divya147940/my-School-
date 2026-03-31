import React, { useState, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorActivityCenter.css';

const CartoonFlashcards = () => {
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sceneActive, setSceneActive] = useState(false);

    const ALPHABET = [
        { l: 'A', n: 'Apple', e: '🍎', s: 'A for Apple! The apple is rolling...', c: '#ef4444', anim: 'rolling-apple' },
        { l: 'B', n: 'Ball', e: '⚽', s: 'B for Ball! Look at it bounce!', c: '#3b82f6', anim: 'bouncing-ball' },
        { l: 'C', n: 'Cat', e: '🐱', s: 'C for Cat! The cat says Meow!', c: '#f59e0b', anim: 'sneaky-cat' },
        { l: 'D', n: 'Dog', e: '🐶', s: 'D for Dog! Such a happy puppy!', c: '#fbbf24', anim: 'wagging-dog' },
        { l: 'E', n: 'Elephant', e: '🐘', s: 'E for Elephant! He is so big!', c: '#6366f1', anim: 'walking-elephant' },
        { l: 'F', n: 'Fish', e: '🐟', s: 'F for Fish! Swimming in the water.', c: '#10b981', anim: 'swimming-fish' },
        { l: 'G', n: 'Grapes', e: '🍇', s: 'G for Grapes! Sweet and juicy!', c: '#a855f7', anim: 'swinging-grapes' },
        { l: 'H', n: 'Horse', e: '🐎', s: 'H for Horse! Galloping away!', c: '#f97316', anim: 'galloping-horse' },
        { l: 'I', n: 'Ice Cream', e: '🍦', s: 'I for Ice Cream! It is melting!', c: '#fbcfe8', anim: 'melting-icecream' },
        { l: 'J', n: 'Joker', e: '🤡', s: 'J for Joker! He is laughing!', c: '#f43f5e', anim: 'laughing-joker' },
        { l: 'K', n: 'Kite', e: '🪁', s: 'K for Kite! Flying high!', c: '#06b6d4', anim: 'flying-kite' },
        { l: 'L', n: 'Lion', e: '🦁', s: 'L for Lion! The King of Jungle Roars!', c: '#f59e0b', anim: 'roaring-lion' }
    ];

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const playScene = (item) => {
        setSelectedLetter(item);
        setIsPlaying(true);
        setSceneActive(true);
        speak(item.s);
        
        // Auto-close scene after animation
        setTimeout(() => {
            setIsPlaying(false);
            // setSceneActive(false); // Keep it open for user to see
        }, 5000);
    };

    return (
        <div className="cartoon-adventure-container" style={{ minHeight: '90vh', background: '#0f172a', padding: '20px', color: '#fff' }}>
            <JuniorDashboardAnimations />
            
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', background: 'linear-gradient(to right, #f43f5e, #fbbf24, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '900' }}>Cartoon Movie Adventure 🎬</h1>
                <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)' }}>Click a letter to start the movie!</p>
            </header>

            <main>
                {!sceneActive ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                        {ALPHABET.map(item => (
                            <div 
                                key={item.l} 
                                onClick={() => playScene(item)}
                                className="card-vibe" 
                                style={{ 
                                    padding: '30px', 
                                    borderRadius: '30px', 
                                    background: 'rgba(255,255,255,0.05)', 
                                    border: `2px solid ${item.c}`,
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    transition: '0.3s all'
                                }}
                            >
                                <div style={{ fontSize: '4rem' }}>{item.l}</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: item.c }}>{item.n}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="movie-theatre" style={{ position: 'relative', width: '90%', maxWidth: '900px', margin: '0 auto', background: '#000', borderRadius: '40px', border: '10px solid #1e293b', overflow: 'hidden', boxShadow: `0 0 50px ${selectedLetter?.c}44` }}>
                        <div style={{ padding: '20px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, color: selectedLetter?.c }}>{selectedLetter?.l} for {selectedLetter?.n}</h2>
                            <button onClick={() => setSceneActive(false)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Close ✕</button>
                        </div>
                        
                        <div className="animatic-stage" style={{ height: '500px', background: 'linear-gradient(to bottom, #0ea5e9, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            {/* Cartoon Scene Container */}
                            <div style={{ fontSize: '15rem', zIndex: 2 }} className={isPlaying ? selectedLetter?.anim : ''}>
                                {selectedLetter?.e}
                            </div>
                            
                            {/* Environmental Animations */}
                            <div className="cartoon-grass" style={{ position: 'absolute', bottom: 0, width: '100%', height: '100px', background: '#22c55e' }}></div>
                            <div className="cartoon-clouds" style={{ position: 'absolute', top: '50px', width: '100%', display: 'flex', justifyContent: 'space-around', opacity: 0.6 }}>
                                <div className="floating-cloud" style={{ fontSize: '4rem' }}>☁️</div>
                                <div className="floating-cloud" style={{ fontSize: '3rem', marginTop: '20px' }}>☁️</div>
                                <div className="floating-cloud" style={{ fontSize: '4rem' }}>☁️</div>
                            </div>
                        </div>

                        <div style={{ padding: '30px', textAlign: 'center', background: '#1e293b' }}>
                            <p style={{ fontSize: '1.5rem', fontStyle: 'italic', color: '#fff' }}>"{selectedLetter?.s}"</p>
                            <button 
                                onClick={() => playScene(selectedLetter)}
                                style={{ marginTop: '20px', padding: '15px 40px', borderRadius: '50px', background: selectedLetter?.c, color: '#fff', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                            >
                                Play Again ▶️
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes rolling-apple {
                    0% { transform: translateX(-300px) rotate(0deg); }
                    50% { transform: translateX(0) rotate(180deg); }
                    100% { transform: translateX(300px) rotate(360deg); }
                }
                @keyframes bouncing-ball {
                    0%, 100% { transform: translateY(-200px); }
                    50% { transform: translateY(150px) scaleY(0.8); }
                }
                @keyframes sneaky-cat {
                    0% { transform: translateX(-400px); opacity: 0; }
                    20% { transform: translateX(-100px); opacity: 1; }
                    50% { transform: translateY(-20px) rotate(10deg); }
                    80% { transform: translateX(100px); opacity: 1; }
                    100% { transform: translateX(400px); opacity: 0; }
                }
                @keyframes wagging-dog {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(5deg) scale(1.1); }
                }
                @keyframes walking-elephant {
                    0% { transform: translateX(-300px) skewX(-5deg); }
                    50% { transform: translateX(0) skewX(5deg); }
                    100% { transform: translateX(300px) skewX(-5deg); }
                }
                @keyframes swimming-fish {
                    0% { transform: translateX(-300px) translateY(0); }
                    25% { transform: translateX(-150px) translateY(-20px); }
                    50% { transform: translateX(0) translateY(20px); }
                    75% { transform: translateX(150px) translateY(-20px); }
                    100% { transform: translateX(300px) translateY(0); }
                }
                @keyframes swinging-grapes {
                    0%, 100% { transform: rotate(-15deg); }
                    50% { transform: rotate(15deg); }
                }
                @keyframes galloping-horse {
                    0%, 100% { transform: translateX(-100px) translateY(0) rotate(0); }
                    25% { transform: translateX(0) translateY(-50px) rotate(10deg); }
                    75% { transform: translateX(100px) translateY(-50px) rotate(-10deg); }
                }

                @keyframes melting-icecream {
                    0% { transform: scale(1) translateY(0); }
                    100% { transform: scaleY(0.5) translateY(50px); opacity: 0.8; }
                }
                @keyframes laughing-joker {
                    0%, 100% { transform: scale(1) rotate(0); }
                    50% { transform: scale(1.2) rotate(10deg); }
                }
                @keyframes flying-kite {
                    0% { transform: translate(-200px, 100px) rotate(-20deg); }
                    50% { transform: translate(0, -150px) rotate(20deg); }
                    100% { transform: translate(200px, -200px) rotate(-10deg); }
                }
                @keyframes roaring-lion {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.4); filter: drop-shadow(0 0 20px #f59e0b); }
                }

                .rolling-apple { animation: rolling-apple 3s infinite linear; }
                .bouncing-ball { animation: bouncing-ball 1.5s infinite ease-in; }
                .sneaky-cat { animation: sneaky-cat 4s infinite ease-in-out; }
                .wagging-dog { animation: wagging-dog 0.5s infinite alternate; }
                .walking-elephant { animation: walking-elephant 5s infinite linear; }
                .swimming-fish { animation: swimming-fish 4s infinite ease-in-out; }
                .swinging-grapes { animation: swinging-grapes 2s infinite ease-in-out; transform-origin: top; }
                .galloping-horse { animation: galloping-horse 1s infinite linear; }
                .melting-icecream { animation: melting-icecream 3s infinite alternate ease-in-out; }
                .laughing-joker { animation: laughing-joker 0.5s infinite; }
                .flying-kite { animation: flying-kite 4s infinite linear; }
                .roaring-lion { animation: roaring-lion 1.5s infinite ease-out; }

                .floating-cloud {
                    animation: floatCloud 10s infinite alternate ease-in-out;
                }
                @keyframes floatCloud {
                    from { transform: translateX(-20px); }
                    to { transform: translateX(20px); }
                }
            `}</style>
        </div>
    );
};

export default CartoonFlashcards;
