import React, { useState, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const PetBuddy = () => {
    const [hunger, setHunger] = useState(50);
    const [happiness, setHappiness] = useState(50);
    const [petState, setPetState] = useState('idle'); // idle, eating, playing, bathing
    const [petIcon, setPetIcon] = useState('🐻');

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9; // Cartoon voice
        utter.rate = 1.1;
        synth.speak(utter);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setHunger(prev => Math.max(0, prev - 1));
            setHappiness(prev => Math.max(0, prev - 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const feedPet = () => {
        setPetState('eating');
        setHunger(prev => Math.min(100, prev + 20));
        speak("Yum yum! Mera pet bhar gaya!");
        setTimeout(() => setPetState('idle'), 2000);
    };

    const playWithPet = () => {
        setPetState('playing');
        setHappiness(prev => Math.min(100, prev + 20));
        speak("Yeee! Maza aa gaya! Main bahut khush hoon!");
        setTimeout(() => setPetState('idle'), 2000);
    };

    const bathePet = () => {
        setPetState('bathing');
        speak("Saaaaf ho gaya! Shukkriya!");
        setTimeout(() => setPetState('idle'), 2000);
    };

    return (
        <div className="pet-buddy-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#ec4899', fontSize: '3rem', marginBottom: '40px' }}>🐶 Pet Buddy (Bholu Ka Dost)</h1>

            <div className="glass-panel" style={{ padding: '60px', borderRadius: '40px', border: '2px solid #ec4899', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ fontSize: '15rem' }} className={petState === 'playing' ? 'anim-bounce' : petState === 'eating' ? 'anim-wiggle' : 'anim-bounce'}>
                        {petState === 'bathing' ? '🧼' : petIcon}
                    </div>
                </div>

                <div style={{ width: '100%', maxWidth: '400px', marginTop: '40px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>Bhook (Hunger)</span>
                            <span>{hunger}%</span>
                        </div>
                        <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${hunger}%`, background: '#fbbf24', transition: 'width 0.5s' }} />
                        </div>
                    </div>
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <span>Khushi (Happiness)</span>
                            <span>{happiness}%</span>
                        </div>
                        <div style={{ height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${happiness}%`, background: '#ec4899', transition: 'width 0.5s' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                    <button className="magic-btn" onClick={feedPet} disabled={petState !== 'idle'}>
                        <span style={{ fontSize: '2.5rem', display: 'block' }}>🍎</span>
                        Khaana (Feed)
                    </button>
                    <button className="magic-btn" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }} onClick={playWithPet} disabled={petState !== 'idle'}>
                        <span style={{ fontSize: '2.5rem', display: 'block' }}>⚽</span>
                        Khelona (Play)
                    </button>
                    <button className="magic-btn" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }} onClick={bathePet} disabled={petState !== 'idle'}>
                        <span style={{ fontSize: '2.5rem', display: 'block' }}>🚿</span>
                        Nahlayo (Bathe)
                    </button>
                </div>
            </div>

            <style>{`
                .magic-btn {
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    border: none;
                    border-radius: 30px;
                    color: white;
                    cursor: pointer;
                    padding: 20px 40px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    transition: all 0.3s;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .magic-btn:hover:not(:disabled) {
                    transform: scale(1.1);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                }
                .magic-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default PetBuddy;
