import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Common/Toaster';
import { useTheme } from '../../context/ThemeContext';
import './BulkSMS.css';

const BulkSMS = () => {
    const { user } = useAuth();
    const { addToast } = useToast();
    const { theme } = useTheme();
    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState(''); // Text area for IDs/Numbers
    const [targetType, setTargetType] = useState('class'); // 'class' or 'manual'
    const [selectedClass, setSelectedClass] = useState('');
    const [availableClasses, setAvailableClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setAvailableClasses(mockApi.getAvailableClasses());
    }, []);

    const handleSend = async () => {
        if (!message) {
            addToast('Please enter a message', 'warning');
            return;
        }

        if (targetType === 'class' && !selectedClass) {
            addToast('Please select a targeted class', 'warning');
            return;
        }

        if (targetType === 'manual' && !recipients) {
            addToast('Please enter recipient IDs or numbers', 'warning');
            return;
        }

        setLoading(true);
        try {
            let targetIds = [];
            
            if (targetType === 'class') {
                // Fetch all students in the selected class
                const students = mockApi.getStudentsByClass(selectedClass);
                targetIds = students.map(s => s.id);
                if (targetIds.length === 0) {
                    addToast(`No students found in class ${selectedClass}`, 'error');
                    setLoading(false);
                    return;
                }
            } else {
                // Parse manual entries (comma or newline separated)
                targetIds = recipients.split(/[,\n]+/).map(s => s.trim()).filter(s => s.length > 0);
            }

            let sentCount = 0;
            for (const id of targetIds) {
                const info = mockApi.getRecipientInfo(id);
                if (info) {
                    mockApi.sendMessage({
                        senderId: user?.id || 'ADMIN-01',
                        senderName: user?.name || 'School Admin',
                        senderRole: user?.role || 'admin',
                        recipientId: id,
                        recipientName: info.name,
                        content: message,
                        type: 'broadcast'
                    });
                    sentCount++;
                }
            }

            addToast(`Successfully sent ${sentCount} messages!`, 'success');
            setMessage('');
            setRecipients('');
            setSelectedClass('');
        } catch (error) {
            console.error(error);
            addToast('Failed to send bulk messages', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bulk-sms-container ${theme === 'dark' ? 'dark-vibe' : ''}`}>
            <header className="bulk-header">
                <div className="header-icon">🚀</div>
                <div>
                    <h2>Unified Broadcast Center</h2>
                    <p>Reach multiple students or classes instantly with targeted announcements.</p>
                </div>
            </header>

            <div className="bulk-grid">
                {/* 1. Target Selection */}
                <div className="bulk-card">
                    <h3># 1. Select Target</h3>
                    
                    <div className="target-toggle">
                        <button 
                            className={targetType === 'class' ? 'active' : ''} 
                            onClick={() => setTargetType('class')}
                        >
                            🏫 By Class
                        </button>
                        <button 
                            className={targetType === 'manual' ? 'active' : ''} 
                            onClick={() => setTargetType('manual')}
                        >
                            🆔 By Unique IDs
                        </button>
                    </div>

                    {targetType === 'class' ? (
                        <div className="class-selector-group">
                            <label>TARGET CLASS</label>
                            <select 
                                value={selectedClass} 
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="styled-select"
                            >
                                <option value="">Select a Class...</option>
                                {availableClasses.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <p className="helper-text">Select Class 1A or 6A for your specific requirement.</p>
                        </div>
                    ) : (
                        <div className="manual-entry">
                            <label>RECIPIENT UNIQUE IDs</label>
                            <textarea 
                                placeholder="Enter IDs separated by commas or new lines... e.g., STU2026-001, STU2026-002"
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                rows={5}
                            />
                            <p className="helper-text">Example: STU2026-001, STU2026-002</p>
                        </div>
                    )}
                </div>

                {/* 2. Compose Message */}
                <div className="bulk-card">
                    <h3>🚀 2. Compose Announcement</h3>
                    <div className="message-composer">
                        <textarea 
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={8}
                        />
                        <div className="composer-footer">
                            <span>Character count: {message.length}</span>
                        </div>
                    </div>
                    <button 
                        className="send-btn primary-gradient" 
                        onClick={handleSend}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : (
                            <><span>✈️</span> Send Broadcast Now</>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section-v2">
                <div className="preview-label">● MESSAGE PREVIEW</div>
                <div className="phone-mockup">
                    <div className="preview-bubble">
                        <div className="sender-name">School Admin 📢</div>
                        {message || "Your announcement will look like this in the student's inbox..."}
                        <span className="timestamp">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkSMS;
