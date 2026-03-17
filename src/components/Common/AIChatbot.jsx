import React, { useState } from 'react';
import './AIChatbot.css';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hello! I am your NSGI Assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const knowledgeBase = {
        'marks': 'You can view marks in the "Results" or "Examinations" tab of your dashboard.',
        'fee': 'Fees can be managed under the "Fees" tab. Admin can view overall collections.',
        'attendance': 'Attendance is marked by Faculty and can be viewed by Students/Parents in their respective portals.',
        'exam': 'The exam schedule is available in the "Timetable" or "Examinations" section.',
        'help': 'I can help you navigate the portal. Try asking about marks, fees, or attendance.',
        'hi': 'Hello! How can I assist you with the school portal today?',
        'hello': 'Hi there! Need help with your dashboard?'
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simple bot logic
        setTimeout(() => {
            const query = input.toLowerCase();
            let botResponse = "I'm sorry, I don't have information on that yet. Try asking about 'marks', 'fees', or 'attendance'.";
            
            for (let key in knowledgeBase) {
                if (query.includes(key)) {
                    botResponse = knowledgeBase[key];
                    break;
                }
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 500);
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
            {!isOpen ? (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <span className="bot-icon">🤖</span>
                    <span className="toggle-text">NSGI Assistant</span>
                </button>
            ) : (
                <div className="chatbot-window">
                    <header className="bot-header">
                        <div className="bot-title">
                            <span className="dot online"></span>
                            <h4>NSGI AI Support</h4>
                        </div>
                        <button className="close-bot" onClick={() => setIsOpen(false)}>&times;</button>
                    </header>
                    
                    <div className="bot-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`msg-bubble ${msg.role}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <form className="bot-input-area" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your question..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatbot;
