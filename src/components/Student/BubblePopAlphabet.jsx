import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../../utils/mockApi';
import './BubblePopAlphabet.css';

const BubblePopAlphabet = () => {
    const [alphabet, setAlphabet] = useState([]);
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [lastPopped, setLastPopped] = useState(null);

    useEffect(() => {
        const data = mockApi.loadData()?.phonicsData || [];
        setAlphabet(data);
    }, []);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (indianVoice) utterance.voice = indianVoice;
        utterance.pitch = 1.6;
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
    };

    const createBubble = useCallback(() => {
        if (alphabet.length === 0) return;
        const letterData = alphabet[Math.floor(Math.random() * alphabet.length)];
        const newBubble = {
            id: Date.now() + Math.random(),
            x: Math.random() * 80 + 10,
            y: 110,
            size: Math.random() * 40 + 80,
            speed: Math.random() * 1 + 0.5,
            ...letterData
        };
        setBubbles(prev => [...prev, newBubble]);
    }, [alphabet]);

    useEffect(() => {
        const interval = setInterval(createBubble, 2000);
        return () => clearInterval(interval);
    }, [createBubble]);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -20));
        }, 50);
        return () => clearInterval(moveInterval);
    }, []);

    const popBubble = (bubble) => {
        setBubbles(prev => prev.filter(b => b.id !== bubble.id));
        setScore(s => s + 5);
        setLastPopped(bubble);
        speak(`${bubble.letter} as in ${bubble.word}`);
        
        // Play pop sound
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37a.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => {});
        
        setTimeout(() => setLastPopped(null), 3000);
    };

    return (
        <div className="bubble-pop-alphabet">
            <div className="bubble-header">
                <h2>Bubble Pop Alphabet 🫧🅰️🍎</h2>
                <div className="score-badge">Popped: {score}</div>
            </div>

            <div className="bubble-playground">
                {bubbles.map(bubble => (
                    <div 
                        key={bubble.id} 
                        className="alphabet-bubble"
                        style={{ 
                            left: `${bubble.x}%`, 
                            top: `${bubble.y}%`,
                            width: `${bubble.size}px`,
                            height: `${bubble.size}px`,
                            background: `radial-gradient(circle at 30% 30%, white 0%, ${bubble.color}40 30%, ${bubble.color}80 100%)`,
                            boxShadow: `0 0 20px ${bubble.color}40`,
                            borderColor: bubble.color
                        }}
                        onClick={() => popBubble(bubble)}
                    >
                        <span className="bubble-letter">{bubble.letter}</span>
                    </div>
                ))}
            </div>

            {lastPopped && (
                <div className="pop-reveal glass-panel" style={{ borderTop: `5px solid ${lastPopped.color}` }}>
                    <div className="reveal-emoji">{lastPopped.emoji}</div>
                    <div className="reveal-text">
                        <span className="reveal-letter" style={{ color: lastPopped.color }}>{lastPopped.letter}</span>
                        <span className="reveal-word"> is for {lastPopped.word}!</span>
                    </div>
                </div>
            )}
            
            {!lastPopped && bubbles.length === 0 && (
                <div className="waiting-message">Wait for the bubbles to float up! 🎈</div>
            )}
        </div>
    );
};

export default BubblePopAlphabet;
