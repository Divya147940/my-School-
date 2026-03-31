import React, { useState, useEffect, useRef } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useTheme } from '../../context/ThemeContext';
import './SchoolBot.css';

const SchoolBot = () => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your NSGI Assistant. How can I help you today?", sender: 'bot' }
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

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            const response = mockApi.getBotResponse(input);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestions = [
        "When is the next holiday?",
        "How to pay fees?",
        "Check my attendance",
        "Recent school news"
    ];

    return (
        <div className={`school-bot-wrapper ${isOpen ? 'active' : ''} ${theme === 'light' ? 'light-mode' : ''}`}>
            {!isOpen && (
                <button className="bot-trigger shadow-glow" onClick={() => setIsOpen(true)}>
                    <span className="bot-icon">🤖</span>
                    <span className="bot-label">Ask NSGI</span>
                </button>
            )}

            {isOpen && (
                <div className="bot-window glass-panel shadow-glow">
                    <div className="bot-header">
                        <div className="bot-header-info">
                            <span className="bot-avatar">🤖</span>
                            <div>
                                <h4>NSGI Assistant</h4>
                                <p className="online-status">Online • AI Powered</p>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="bot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
                                <div className="bubble-content">{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble bot">
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length < 3 && (
                        <div className="bot-suggestions">
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => { setInput(s); document.getElementById('bot-form').requestSubmit(); }}>{s}</button>
                            ))}
                        </div>
                    )}

                    <form id="bot-form" className="bot-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your question..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="send-btn">🚀</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SchoolBot;
