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
    const [facultyId, setFacultyId] = useState('');
    const [facultyName, setFacultyName] = useState('');
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
            const results = mockApi.searchRecipient(q).filter(r => r.role === 'faculty');
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const selectFaculty = (f) => {
        setFacultyId(f.id);
        setFacultyName(f.name);
        setSearchResults([]);
        setSearchQuery('');
        addToast(`Selected: ${f.name}`, 'success');
    };

    const verifyFaculty = () => {
        if (!facultyId) return;
        const info = mockApi.getRecipientInfo(facultyId);
        if (info && info.role === 'faculty') {
            setFacultyName(info.name);
            addToast(`Verified: ${info.name}`, 'success');
        } else {
            setFacultyName('');
            addToast('Invalid Faculty ID', 'error');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!replyText || !facultyId || !facultyName) {
            addToast('Please fill all fields', 'warning');
            return;
        }

        setLoading(true);
        try {
            mockApi.sendMessage({
                senderId: studentId,
                senderName: studentName,
                senderRole: 'student',
                recipientId: facultyId,
                recipientName: facultyName,
                content: replyText,
                type: 'message'
            });
            addToast('Message sent to faculty!', 'success');
            setReplyText('');
            setFacultyId('');
            setFacultyName('');
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
                        ✍️ Contact Faculty
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
                                        {msg.senderRole === 'faculty' && (
                                            <button 
                                                className="reply-link"
                                                onClick={() => {
                                                    setFacultyId(msg.senderId);
                                                    setFacultyName(msg.senderName);
                                                    setView('compose');
                                                }}
                                            >
                                                Reply to Teacher
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
                    <h3>Send Message to Teacher</h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="search-group">
                            <div className="id-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Search Teacher Name or Enter ID..." 
                                    value={facultyId || searchQuery}
                                    onChange={(e) => {
                                        if (facultyId) setFacultyId('');
                                        handleSearch(e.target.value);
                                    }}
                                />
                                {!facultyId && searchQuery.length > 0 && (
                                    <button type="button" onClick={verifyFaculty}>Verify ID</button>
                                )}
                            </div>
                            
                            {searchResults.length > 0 && (
                                <div className="search-results-dropdown glass-panel">
                                    {searchResults.map(f => (
                                        <div 
                                            key={f.id} 
                                            className="search-result-item"
                                            onClick={() => selectFaculty(f)}
                                        >
                                            <span className="res-name">{f.name}</span>
                                            <span className="res-meta">{f.id} • {f.role}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {facultyName && (
                            <div className="recipient-preview active">
                                <span>To: <strong>{facultyName}</strong></span>
                                <button type="button" onClick={() => { setFacultyId(''); setFacultyName(''); }}>✕</button>
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
