import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './AIDoubtSolver.css';

const AIDoubtSolver = () => {
    const { theme } = useTheme();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Study Buddy. Ask me anything about your subjects!", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let aiResponse = "";
            const lowerInput = input.toLowerCase();
            
            if (lowerInput.includes("photosynthesis")) {
                aiResponse = "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. ✨";
            } else if (lowerInput.includes("newton")) {
                aiResponse = "Isaac Newton is best known for his three laws of motion and the law of universal gravitation. 🍎";
            } else if (lowerInput.includes("pi") || lowerInput.includes("circle")) {
                aiResponse = "Pi (π) is approximately 3.14159... It's the ratio of a circle's circumference to its diameter! 📏";
            } else if (lowerInput.includes("gravity") || lowerInput.includes("weight")) {
                aiResponse = "Gravity is the force by which a planet or other body draws objects toward its center. On Earth, gravity keeps us on the ground! 🌍";
            } else if (lowerInput.includes("atom") || lowerInput.includes("molecule")) {
                aiResponse = "Atoms are the basic building blocks of matter. Molecules are formed when two or more atoms bond together! ⚛️";
            } else {
                aiResponse = "That's an interesting question about " + input + "! Based on my data, I can help you explore more. Would you like a detailed explanation? 📚";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'ai' }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className={`ai-doubt-solver-container glass-panel ${theme === 'light' ? 'light-mode' : ''}`}>
            <div className="ai-solver-header">
                <div className="ai-badge">AI</div>
                <h3>Doubt Solver</h3>
                <p>Instant explanations for all your subjects</p>
            </div>

            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="message-bubble ai typing">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                    type="text" 
                    placeholder="Ask a question (e.g., 'What is gravity?')..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="send-btn">Ask AI</button>
            </form>
        </div>
    );
};

export default AIDoubtSolver;
