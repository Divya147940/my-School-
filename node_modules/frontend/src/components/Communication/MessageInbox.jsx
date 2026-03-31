import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../components/Common/Toaster';
import './Communication.css';

const MessageInbox = ({ studentId, studentClass, studentName }) => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [view, setView] = useState('inbox'); // 'inbox' or 'compose'
    const [recipientId, setRecipientId] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = () => {
        const fetched = mockApi.getMessages({ 
            role: 'student', 
            userId: studentId, 
            className: studentClass 
        });
        setMessages(fetched);
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (q) => {
        setSearchQuery(q);
        if (q.length > 1) {
            const results = mockApi.searchRecipient(q).filter(r => ['faculty', 'admin'].includes(r.role));
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const selectRecipient = (r) => {
        setRecipientId(r.id);
        setRecipientName(r.name);
        setSearchResults([]);
        setSearchQuery('');
        addToast(`Selected: ${r.name}`, 'success');
    };

    const verifyRecipient = () => {
        if (!recipientId) return;
        const info = mockApi.getRecipientInfo(recipientId);
        if (info && (info.role === 'faculty' || info.role === 'admin')) {
            setRecipientName(info.name);
            addToast(`Verified: ${info.name} (${info.role})`, 'success');
        } else {
            setRecipientName('');
            addToast('Invalid ID', 'error');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!replyText || !recipientId || !recipientName) {
            addToast('Please fill all fields', 'warning');
            return;
        }

        setLoading(true);
        try {
            mockApi.sendMessage({
                senderId: studentId,
                senderName: studentName,
                senderRole: 'student',
                recipientId: recipientId,
                recipientName: recipientName,
                content: replyText,
                type: 'message'
            });
            addToast(`Message sent to ${recipientName}!`, 'success');
            setReplyText('');
            setRecipientId('');
            setRecipientName('');
            setView('inbox');
            loadMessages();
        } catch (error) {
            addToast('Failed to send message', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="message-inbox glass-panel v2-updated">
            <div className="inbox-header">
                <div className="header-main">
                    <h2>Student Inbox</h2>
                    <p>Stay updated with notices from your teachers and school administration.</p>
                </div>
                <div className="view-toggle">
                    <button 
                        className={view === 'inbox' ? 'active' : ''} 
                        onClick={() => setView('inbox')}
                    >
                        📬 Inbox
                    </button>
                    <button 
                        className={view === 'compose' ? 'active' : ''} 
                        onClick={() => setView('compose')}
                    >
                        ✍️ Contact School
                    </button>
                </div>
            </div>

            {view === 'inbox' ? (
                <div className="inbox-content">
                    {messages.length === 0 ? (
                        <div className="empty-inbox">
                            <span className="icon">📭</span>
                            <p>Your inbox is clear! Check back later for updates.</p>
                        </div>
                    ) : (
                        <div className="message-grid">
                            {messages.map(msg => (
                                <div key={msg.id} className={`inbox-card ${msg.senderRole === 'admin' ? 'admin-notice' : ''}`}>
                                    <div className="card-header">
                                        <span className="sender-tag">
                                            {msg.senderRole === 'admin' ? '📢 Admin' : `👨‍🏫 ${msg.senderName}`}
                                        </span>
                                        <span className="time-tag">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <div className="card-body">
                                        <p>{msg.content}</p>
                                        {msg.attachment && (
                                            <div className="attachment-box">
                                                <span>📄 {msg.attachment}</span>
                                                <button className="download-btn">Download</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-footer">
                                        {(msg.senderRole === 'faculty' || msg.senderRole === 'admin') && (
                                            <button 
                                                className="reply-link"
                                                onClick={() => {
                                                    setRecipientId(msg.senderId);
                                                    setRecipientName(msg.senderName);
                                                    setView('compose');
                                                }}
                                            >
                                                Reply to {msg.senderRole === 'admin' ? 'Admin' : 'Teacher'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="compose-content card-inner">
                    <h3>Send Message to Admin/Teacher</h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="search-group">
                            <div className="id-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Search Name or Enter ID..." 
                                    value={recipientId || searchQuery}
                                    onChange={(e) => {
                                        if (recipientId) setRecipientId('');
                                        handleSearch(e.target.value);
                                    }}
                                />
                                {!recipientId && searchQuery.length > 0 && (
                                    <button type="button" onClick={verifyRecipient}>Verify ID</button>
                                )}
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="search-results-dropdown glass-panel">
                                    {searchResults.map(r => (
                                        <div 
                                            key={r.id} 
                                            className="search-result-item"
                                            onClick={() => selectRecipient(r)}
                                        >
                                            <span className="res-name">{r.name}</span>
                                            <span className="res-meta">{r.id} • {r.role}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {recipientName && (
                            <div className="recipient-preview active">
                                <span>To: <strong>{recipientName}</strong></span>
                                <button type="button" onClick={() => { setRecipientId(''); setRecipientName(''); }}>✕</button>
                            </div>
                        )}

                        <div className="input-group">
                            <textarea 
                                placeholder="Write your message or question here..." 
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={6}
                                required
                            />
                        </div>

                        <div className="action-row">
                            <button 
                                type="button" 
                                className="cancel-btn"
                                onClick={() => setView('inbox')}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="send-btn" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MessageInbox;
