import React, { useState } from 'react';
import './AIAssistant.css';
import { useLanguage } from '../../context/LanguageContext';

const AIAssistant = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', en: "Hello! How can I help you with school information today?", hi: "नमस्ते! मैं आज स्कूल की जानकारी के साथ आपकी क्या मदद कर सकता हूँ?" }
  ]);

  const knowledgeBase = [
    { q_en: "When will the admission start?", q_hi: "प्रवेश कब शुरू होंगे?", a_en: "Admissions for the 2025-26 session are now open! You can apply online via the Admissions portal.", a_hi: "2025-26 सत्र के लिए प्रवेश अब खुल गए हैं! आप प्रवेश पोर्टल के माध्यम से ऑनलाइन आवेदन कर सकते हैं।" },
    { q_en: "What about sports day?", q_hi: "खेल दिवस कब है?", a_en: "The Annual Sports Meet is scheduled for March 25th, 2025.", a_hi: "वार्षिक खेल प्रतियोगिता 25 मार्च, 2025 को निर्धारित है।" },
    { q_en: "Tell me about fees.", q_hi: "फीस के बारे में बताएं।", a_en: "You can view and pay your fees securely from the Student Dashboard > Fees section.", a_hi: "आप छात्र डैशबोर्ड > फीस अनुभाग से अपनी फीस देख और सुरक्षित रूप से भुगतान कर सकते हैं।" },
    { q_en: "Is bus tracking available?", q_hi: "क्या बस ट्रैकिंग उपलब्ध है?", a_en: "Yes, you can track the school bus in real-time from the 'Live Bus' section in your dashboard.", a_hi: "हाँ, आप अपने डैशबोर्ड में 'लाइव बस' अनुभाग से स्कूल बस को रीयल-टाइम में ट्रैक कर सकते हैं।" }
  ];

  const handleSuggest = (item) => {
    setMessages([...messages, 
      { type: 'user', text: language === 'hi' ? item.q_hi : item.q_en },
      { type: 'bot', en: item.a_en, hi: item.a_hi }
    ]);
  };

  return (
    <div className="ai-assistant-wrapper">
      {isOpen && (
        <div className="ai-chat-window glass-panel">
          <div className="ai-chat-header">
            <span style={{ fontWeight: 800 }}>🤖 NSGI AI Bot</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>
          <div className="ai-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={m.type === 'bot' ? 'message-bot' : 'message-user'}>
                {m.type === 'user' ? m.text : (language === 'hi' ? m.hi : m.en)}
              </div>
            ))}
            <div className="suggested-qs">
              {knowledgeBase.map((kb, i) => (
                <button key={i} className="suggest-btn" onClick={() => handleSuggest(kb)}>
                  {language === 'hi' ? kb.q_hi : kb.q_en}
                </button>
              ))}
            </div>
          </div>
          <div className="ai-chat-footer">
            <input type="text" className="ai-input" placeholder={t('search')} />
          </div>
        </div>
      )}
      <button className="ai-bubble-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '💬' : '🤖'}
      </button>
    </div>
  );
};

export default AIAssistant;
