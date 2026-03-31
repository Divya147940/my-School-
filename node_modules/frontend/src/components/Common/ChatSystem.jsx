import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ChatSystem.css';

const ChatSystem = ({ userType }) => {
    const { theme } = useTheme();
    const [activeChat, setActiveChat] = useState(null);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Mock Contacts
    const contacts = userType === 'parent' ? [
        { id: 1, name: 'Mr. Verma', role: 'Math Teacher', avatar: 'MV', status: 'online' },
        { id: 2, name: 'Mrs. Sharma', role: 'Science Teacher', avatar: 'MS', status: 'offline' }
    ] : [
        { id: 101, name: 'Mr. Rajkumar Gupta', role: 'Aman\'s Parent', avatar: 'RG', status: 'online' },
        { id: 102, name: 'Mrs. Singh', role: 'Rahul\'s Parent', avatar: 'RS', status: 'online' }
    ];

    const [chatHistory, setChatHistory] = useState({
        1: [{ text: "Hello! How is Aman performing in Math?", sender: 'user', time: '10:00 AM' }],
        2: [{ text: "When is the next science project due?", sender: 'user', time: 'Yesterday' }],
        101: [{ text: "Hello! How is Aman performing in Math?", sender: 'other', time: '10:00 AM' }],
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat, chatHistory]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || !activeChat) return;

        const newMessage = {
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setChatHistory(prev => ({
            ...prev,
            [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
        }));
        setInput('');
    };

    return (
        <div className={`chat-system-container glass-panel ${theme === 'light' ? 'light-mode' : ''}`}>
            {/* Sidebar: Message List */}
            <div className="chat-sidebar">
                <div className="sidebar-header">
                    <h3>Messages</h3>
                </div>
                <div className="contact-list">
                    {contacts.map(contact => (
                        <div 
                            key={contact.id} 
                            className={`contact-item ${activeChat?.id === contact.id ? 'active' : ''}`}
                            onClick={() => setActiveChat(contact)}
                        >
                            <div className="contact-avatar" style={{ background: contact.status === 'online' ? '#10b981' : '#64748b' }}>
                                {contact.avatar}
                            </div>
                            <div className="contact-info">
                                <div className="contact-name">{contact.name}</div>
                                <div className="contact-role">{contact.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-main">
                {activeChat ? (
                    <>
                        <div className="chat-header">
                            <div className="header-info">
                                <h3>{activeChat.name}</h3>
                                <span>{activeChat.role} • {activeChat.status}</span>
                            </div>
                        </div>
                        <div className="message-container">
                            {(chatHistory[activeChat.id] || []).map((msg, idx) => (
                                <div key={idx} className={`chat-message ${msg.sender}`}>
                                    <div className="message-content">{msg.text}</div>
                                    <div className="message-time">{msg.time}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form className="message-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" className="send-btn">Send</button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="placeholder-icon">💬</div>
                        <h3>Select a contact to start chatting</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSystem;
