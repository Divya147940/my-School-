import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const AlphabetTrain = () => {
    const [currentLetter, setCurrentLetter] = useState('A');
    const [trainPos, setTrainPos] = useState(0);
    const [isMatched, setIsMatched] = useState(false);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5).slice(0, 3);
    if (!options.includes(currentLetter)) options[0] = currentLetter;

    const handleMatch = (l) => {
        if (l === currentLetter) {
            setIsMatched(true);
            speak(`Sahi jawab! ${l} for Apple!`);
            setTimeout(() => {
                const nextIdx = (letters.indexOf(currentLetter) + 1) % letters.length;
                setCurrentLetter(letters[nextIdx]);
                setIsMatched(false);
                setTrainPos(prev => prev + 10);
            }, 2000);
        } else {
            speak("Oh no! Phir se koshish karo!");
        }
    };

    return (
        <div className="alphabet-train-container" style={{ textAlign: 'center', padding: '20px', overflow: 'hidden' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#06b6d4', fontSize: '3rem', marginBottom: '40px' }}>🚂 Alphabet Train</h1>

            <div className="train-track" style={{ height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '40px', position: 'relative', marginBottom: '40px', borderBottom: '10px solid #4ade80' }}>
                <div style={{ 
                    position: 'absolute', 
                    bottom: '20px', 
                    left: `${20 + (trainPos % 60)}%`, 
                    fontSize: '10rem', 
                    transition: 'left 1s ease-in-out',
                    display: 'flex',
                    alignItems: 'center'
                }} className="anim-bounce">
                    🚂
                    <div style={{ 
                        marginLeft: '-20px', 
                        width: '120px', 
                        height: '100px', 
                        background: '#f43f5e', 
                        borderRadius: '15px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '4rem',
                        color: '#fff',
                        fontWeight: 'bold',
                        border: '5px solid #fff'
                    }}>
                        {isMatched ? currentLetter : '?'}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '40px' }}>
                <p style={{ fontSize: '2rem', marginBottom: '30px' }}>Train mein kaunsa letter aayega? 🧐</p>
                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                    {options.map(l => (
                        <button key={l} className="magic-btn" style={{ fontSize: '4rem', padding: '20px 50px' }} onClick={() => handleMatch(l)}>
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                .magic-btn {
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    border: none;
                    border-radius: 20px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .magic-btn:hover {
                    transform: scale(1.1) translateY(-10px);
                    box-shadow: 0 15px 30px rgba(6, 182, 212, 0.4);
                }
            `}</style>
        </div>
    );
};

export default AlphabetTrain;
