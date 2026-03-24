import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../components/Common/Toaster';
import './Communication.css';

const CommunicationPortal = ({ userRole, userId, userName }) => {
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [messages, setMessages] = useState([]);
    const [targetType, setTargetType] = useState('class'); // 'class' or 'individual'
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [messageText, setMessageText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);

    const availableClasses = mockApi.getAvailableClasses();

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = () => {
        const fetched = mockApi.getMessages({ role: userRole, userId });
        setMessages(fetched);
    };

    const handleClassToggle = (cls) => {
        setSelectedClasses(prev => 
            prev.includes(cls) ? prev.filter(c => c !== cls) : [...prev, cls]
        );
    };

    const handleSelectAllClasses = () => {
        if (selectedClasses.length === availableClasses.length) {
            setSelectedClasses([]);
        } else {
            setSelectedClasses([...availableClasses]);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (q) => {
        setSearchQuery(q);
        if (q.length > 1) {
            const results = mockApi.searchRecipient(q);
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
        if (info) {
            setRecipientName(info.name);
            addToast(`Verified: ${info.name} (${info.role})`, 'success');
        } else {
            setRecipientName('');
            addToast('Invalid ID', 'error');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText) return;

        setLoading(true);
        try {
            const payload = {
                senderId: userId,
                senderName: userName,
                senderRole: userRole,
                content: messageText,
                attachment: attachment,
                type: attachment ? 'resource' : 'message'
            };

            if (targetType === 'class') {
                if (selectedClasses.length === 0) {
                    addToast('Please select at least one class', 'warning');
                    setLoading(false);
                    return;
                }
                payload.targetClasses = selectedClasses;
            } else {
                if (!recipientId || !recipientName) {
                    addToast('Please verify recipient ID', 'warning');
                    setLoading(false);
                    return;
                }
                payload.recipientId = recipientId;
                payload.recipientName = recipientName;
            }

            mockApi.sendMessage(payload);
            addToast('Message sent successfully!', 'success');
            setMessageText('');
            setAttachment(null);
            setSelectedClasses([]);
            setRecipientId('');
            setRecipientName('');
            loadMessages();
        } catch (error) {
            addToast('Failed to send message', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="communication-portal glass-panel v2-updated">
            <div className="portal-header">
                <h2>{userRole === 'admin' ? 'Admin Communication Center' : 'Teacher Resource Hub'}</h2>
                <p>Send notices, assignments, and messages across the school ecosystem.</p>
            </div>

            <div className="portal-grid">
                {/* Compose Section */}
                <div className="compose-section card-inner">
                    <h3>New Broadcast / Message</h3>
                    <form onSubmit={handleSendMessage}>
                        <div className="target-toggle">
                            <button 
                                type="button" 
                                className={targetType === 'class' ? 'active' : ''} 
                                onClick={() => setTargetType('class')}
                            >
                                🎯 Targeted Classes
                            </button>
                            <button 
                                type="button" 
                                className={targetType === 'individual' ? 'active' : ''} 
                                onClick={() => setTargetType('individual')}
                            >
                                👤 Individual (ID/Name)
                            </button>
                        </div>

                        {targetType === 'class' ? (
                            <div className="class-selector">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <label>Select Target Classes:</label>
                                    <button 
                                        type="button" 
                                        className="select-all-btn"
                                        onClick={handleSelectAllClasses}
                                    >
                                        {selectedClasses.length === availableClasses.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>
                                <div className="class-pills">
                                    {availableClasses.map(cls => (
                                        <button
                                            key={cls}
                                            type="button"
                                            className={`class-pill ${selectedClasses.includes(cls) ? 'selected' : ''}`}
                                            onClick={() => handleClassToggle(cls)}
                                        >
                                            {cls}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="individual-selector">
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
                                        <span>Recipient: <strong>{recipientName}</strong></span>
                                        <button type="button" onClick={() => { setRecipientId(''); setRecipientName(''); }}>✕</button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="input-group">
                            <textarea 
                                placeholder="Type your message or resource details here..." 
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="action-row">
                            <div className="file-upload">
                                <label className="upload-btn">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setAttachment(e.target.files[0] ? e.target.files[0].name : null)}
                                    />
                                    <span>📎 {attachment || 'Add Attachment'}</span>
                                </label>
                            </div>
                            <button type="submit" className="send-btn" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Broadcast'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* History Section */}
                <div className="history-section card-inner">
                    <h3>Recent Sent Items</h3>
                    <div className="message-list">
                        {messages.length === 0 ? (
                            <p className="empty-msg">No recent communications found.</p>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className="message-item">
                                    <div className="msg-meta">
                                        <span className="msg-date">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                        <span className="msg-target">
                                            {msg.targetClasses ? `To Classes: ${msg.targetClasses.join(', ')}` : `To ID: ${msg.recipientId}`}
                                        </span>
                                    </div>
                                    <p className="msg-content">{msg.content}</p>
                                    {msg.attachment && <div className="msg-file">📄 {msg.attachment}</div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunicationPortal;
