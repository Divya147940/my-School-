import React, { useState } from 'react';
import './BulkSMS.css';

const BulkSMS = () => {
    const [message, setMessage] = useState('');
    const [numbers, setNumbers] = useState('');
    const [fileStatus, setFileStatus] = useState(null);

    const handleSend = () => {
        if (!message || (!numbers && !fileStatus)) {
            alert('Please add recipients and a message.');
            return;
        }
        alert(`Sending message to recipients... Content: ${message}`);
        setMessage('');
        setNumbers('');
        setFileStatus(null);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileStatus(`Uploaded: ${file.name}`);
        }
    };

    return (
        <div className="bulk-sms-container">
            <header className="bulk-header">
                <div className="header-icon">🚀</div>
                <div>
                    <h2>Unified Bulk Send</h2>
                    <p>Send custom messages to one or many recipients instantly.</p>
                </div>
            </header>

            <div className="bulk-grid">
                {/* 1. Add Recipients */}
                <div className="bulk-card">
                    <h3># 1. Add Recipients</h3>
                    <div className="file-upload-zone">
                        <input type="file" id="fileInput" onChange={handleFileUpload} hidden />
                        <label htmlFor="fileInput" className="upload-label">
                            <div className="upload-icon">📤</div>
                            <p>Click or drag to upload file</p>
                            <span>Supports .csv, .xlsx, .json</span>
                        </label>
                        {fileStatus && <div className="file-badge">{fileStatus}</div>}
                    </div>

                    <div className="divider">OR</div>

                    <div className="manual-entry">
                        <label>MANUAL NUMBERS</label>
                        <textarea 
                            placeholder="Enter numbers separated by commas or new lines... e.g., 919876543210, 911234567890"
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. Compose Message */}
                <div className="bulk-card">
                    <h3>🚀 2. Compose Message</h3>
                    <div className="message-composer">
                        <textarea 
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="composer-footer">
                            <span>Characters: {message.length} | Supports plain text only</span>
                        </div>
                    </div>
                    <button className="send-btn" onClick={handleSend}>
                        <span>✈️</span> Send Message Now
                    </button>
                </div>
            </div>

            {/* WhatsApp Preview */}
            <div className="preview-section">
                <div className="preview-label">● WHATSAPP PREVIEW</div>
                <div className="phone-mockup">
                    <div className="preview-bubble">
                        {message || "Your message will look like this..."}
                        <span className="timestamp">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkSMS;
