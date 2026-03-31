import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';

const AIAssistant = () => {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: language === 'hi' ? "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?" : "Hello! I am your NSGI Virtual Assistant. How can I help you today?", id: 1 }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    const knowledgeBase = [
        { q_en: "Registration Fee?", q_hi: "पंजीकरण शुल्क?", a_en: "The registration fee is ₹1000 for all classes. You can pay securely via the Admission portal.", a_hi: "सभी कक्षाओं के लिए पंजीकरण शुल्क ₹1000 है। आप प्रवेश पोर्टल के माध्यम से सुरक्षित रूप से भुगतान कर सकते हैं।" },
        { q_en: "Uniform details?", q_hi: "यूनिफॉर्म विवरण?", a_en: "Summer: White shirt with grey trousers. Winter: Navy blue blazer with school crest.", a_hi: "गर्मी: ग्रे पतलून के साथ सफेद शर्ट। सर्दी: स्कूल क्रेस्ट के साथ नेवी ब्लू ब्लेज़र।" },
        { q_en: "School Timings?", q_hi: "स्कूल का समय?", a_en: "Summer: 7:30 AM to 1:30 PM. Winter: 8:30 AM to 2:30 PM.", a_hi: "गर्मी: सुबह 7:30 से दोपहर 1:30 तक। सर्दी: सुबह 8:30 से दोपहर 2:30 तक।" },
        { q_en: "Our Results?", q_hi: "हमारे परिणाम?", a_en: "We achieved 100% results in Class 10th and 12th Boards for the last 5 years with 40+ merit ranks.", a_hi: "हमने पिछले 5 वर्षों से कक्षा 10वीं और 12वीं बोर्ड में 40+ मेरिट रैंक के साथ 100% परिणाम प्राप्त किए हैं।" }
    ];

    const typeBotResponse = (fullText) => {
        setIsThinking(true);
        setTimeout(() => {
            setIsThinking(false);
            setMessages(prev => [...prev, { type: 'bot', text: fullText, id: Date.now() }]);
        }, 800);
    };

    const handleSuggest = (item) => {
        const userText = language === 'hi' ? item.q_hi : item.q_en;
        const botText = language === 'hi' ? item.a_hi : item.a_en;
        setMessages(prev => [...prev, { type: 'user', text: userText, id: Date.now() }]);
        typeBotResponse(botText);
    };

    const handleSend = (e) => {
        if ((e.key === 'Enter' || e.type === 'click') && inputText.trim()) {
            const userText = inputText.trim();
            setMessages(prev => [...prev, { type: 'user', text: userText, id: Date.now() }]);
            setInputText('');
            typeBotResponse(mockApi.getBotResponse(userText));
        }
    };

    return (
        <div className={`ai-assistant-container ${isOpen ? 'active' : ''}`}>
            {isOpen && (
                <div className="chat-window-premium glass-panel">
                    <div className="chat-header">
                        <div className="bot-info">
                            <div className="bot-avatar-mini">🤖</div>
                            <div>
                                <h4>NSGI Smart Assistant</h4>
                                <span className="online-indicator">Active Now</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    <div className="chat-messages" ref={scrollRef}>
                        {messages.map((m) => (
                            <div key={m.id} className={`message-bubble ${m.type}`}>
                                {m.text}
                            </div>
                        ))}
                        {isThinking && (
                            <div className="message-bubble bot thinking">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                    </div>

                    <div className="chat-suggestions">
                        {knowledgeBase.map((kb, i) => (
                            <button key={i} className="chip" onClick={() => handleSuggest(kb)}>
                                {language === 'hi' ? kb.q_hi : kb.q_en}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input-area">
                        <input 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleSend}
                            placeholder={language === 'hi' ? "संवाद करें..." : "Ask anything..."}
                            className="premium-chat-input"
                        />
                        <button className="send-icon-btn" onClick={handleSend}>➤</button>
                    </div>
                </div>
            )}
            
            <button className={`chat-trigger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <div className="trigger-icon">{isOpen ? '✕' : '🤖'}</div>
                <div className="trigger-ping"></div>
            </button>
        </div>
    );
};

export default AIAssistant;
