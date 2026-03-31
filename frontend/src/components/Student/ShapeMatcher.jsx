import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import './ShapeMatcher.css';

const ShapeMatcher = () => {
    const [shapes, setShapes] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [matchedShapes, setMatchedShapes] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('Match the shape to its outline! ✨');

    useEffect(() => {
        const data = mockApi.loadData()?.toddlerActivities?.shapeChallenge || [];
        setShapes(data);
        if (data.length > 0) {
            setCurrentTask(data[Math.floor(Math.random() * data.length)]);
        }
    }, []);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (indianVoice) utterance.voice = indianVoice;
        utterance.pitch = 1.3;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const handleShapeClick = (shape) => {
        if (!currentTask) return;

        if (shape.id === currentTask.id) {
            setFeedback(`Perfect! That's a ${shape.shape}! 🌟`);
            speak(`Perfect! That is a ${shape.shape}`);
            setScore(s => s + 10);
            setMatchedShapes(prev => [...prev, shape.id]);
            
            setTimeout(() => {
                const remaining = shapes.filter(s => !matchedShapes.includes(s.id) && s.id !== shape.id);
                if (remaining.length > 0) {
                    const next = remaining[Math.floor(Math.random() * remaining.length)];
                    setCurrentTask(next);
                    setFeedback(`Now find the ${next.shape}!`);
                    speak(`Now find the ${next.shape}`);
                } else {
                    setFeedback('Wow! You matched all the shapes! 🏆');
                    speak('Wow! You matched all the shapes! You are a superstar!');
                    setTimeout(() => {
                        setMatchedShapes([]);
                        setScore(0);
                        const startOver = shapes[Math.floor(Math.random() * shapes.length)];
                        setCurrentTask(startOver);
                        setFeedback('Let\'s play again! Match the shape! ✨');
                    }, 3000);
                }
            }, 1500);
        } else {
            setFeedback(`Oops! That's not a ${currentTask.shape}. Try again! 🧐`);
            speak(`Oops! That is not a ${currentTask.shape}. Try again!`);
        }
    };

    return (
        <div className="shape-matcher">
            <div className="matcher-header">
                <h2>Shape Matcher 🟦🟡🔺⭐</h2>
                <div className="score-display">Stars: {Array(Math.floor(score/10)).fill('⭐').join('')}</div>
            </div>

            <div className={`feedback-panel glass-panel ${feedback.includes('Perfect') ? 'success' : ''}`}>
                {feedback}
            </div>

            <div className="game-area">
                <div className="target-container">
                    <span className="target-label">Find this shape:</span>
                    <div className="target-silhouette">
                        {currentTask?.silhouette}
                    </div>
                </div>

                <div className="options-grid">
                    {shapes.map(shape => (
                        <div 
                            key={shape.id} 
                            className={`shape-option ${matchedShapes.includes(shape.id) ? 'matched' : ''}`}
                            onClick={() => !matchedShapes.includes(shape.id) && handleShapeClick(shape)}
                        >
                            <span className="shape-icon">{shape.icon}</span>
                            <span className="shape-name">{shape.shape}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShapeMatcher;
