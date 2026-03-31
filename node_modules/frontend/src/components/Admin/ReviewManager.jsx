import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import './ReviewManager.css';

const ReviewManager = () => {
    const [reviews, setReviews] = useState(mockApi.getReviews());
    const [newReview, setNewReview] = useState({ name: '', relation: '', text: '', rating: 5 });
    const [whatsappText, setWhatsappText] = useState('');

    const handleWhatsAppParse = () => {
        // Simple heuristic: "Review by [Name] ([Relation]): [Text]"
        // Or common WhatsApp copy-paste patterns
        const lines = whatsappText.split('\n');
        if (lines.length >= 2) {
            const nameLine = lines[0].replace('Review by ', '').trim();
            const textContent = lines.slice(1).join(' ').trim();
            
            setNewReview({
                ...newReview,
                name: nameLine || 'Parent',
                text: textContent
            });
        }
    };

    const handleAdd = () => {
        if (!newReview.name || !newReview.text) return;
        mockApi.addReview(newReview);
        setReviews(mockApi.getReviews());
        setNewReview({ name: '', relation: '', text: '', rating: 5 });
        setWhatsappText('');
        alert('Review Added Successfully! It will now appear on the home page.');
    };

    const handleDelete = (id) => {
        mockApi.deleteReview(id);
        setReviews(mockApi.getReviews());
    };

    return (
        <div className="review-manager glass-panel">
            <div className="manager-grid">
                <div className="submission-form">
                    <h3 className="section-title">Add WhatsApp Review</h3>
                    <div className="input-group">
                        <label>Paste WhatsApp Message</label>
                        <textarea 
                            value={whatsappText}
                            onChange={(e) => setWhatsappText(e.target.value)}
                            placeholder="Review by Rajesh Kumar (Father of Aryan): Great school!"
                        />
                        <button className="parse-btn" onClick={handleWhatsAppParse}>Auto-Parse Content ⚡</button>
                    </div>

                    <div className="manual-inputs">
                        <input 
                            type="text" 
                            placeholder="Parent Name" 
                            value={newReview.name}
                            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                        />
                        <input 
                            type="text" 
                            placeholder="Relation (e.g. Father of Aman)" 
                            value={newReview.relation}
                            onChange={(e) => setNewReview({...newReview, relation: e.target.value})}
                        />
                        <div className="rating-selector">
                            <span>Rating: </span>
                            {[1,2,3,4,5].map(nu => (
                                <button 
                                    key={nu}
                                    className={newReview.rating === nu ? 'active' : ''}
                                    onClick={() => setNewReview({...newReview, rating: nu})}
                                >★</button>
                            ))}
                        </div>
                        <button className="add-btn" onClick={handleAdd}>Approve & Live on Home Page</button>
                    </div>
                </div>

                <div className="preview-section">
                    <h3 className="section-title">Live Preview</h3>
                    <div className="review-preview-card glass-panel card-vibe shadow-glow">
                        <div className="quote-mark">“</div>
                        <p className="p-text">{newReview.text || 'Paste a review to see how it looks cinematic...'}</p>
                        <div className="p-footer">
                            <span className="p-name">{newReview.name || 'Parent Name'}</span>
                            <span className="p-relation">{newReview.relation || 'Relation'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="existing-reviews feature-box">
                <h3 className="section-title">Manage Published Reviews</h3>
                <div className="review-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Location/Relation</th>
                                <th>Review Text</th>
                                <th>Rating</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(r => (
                                <tr key={r.id}>
                                    <td style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{r.date || 'New Submission'}</td>
                                    <td><strong>{r.name}</strong></td>
                                    <td style={{ fontStyle: 'italic' }}>{r.relation}</td>
                                    <td className="truncate-text" title={r.text}>{r.text}</td>
                                    <td>
                                        <div className="admin-stars">
                                            {[...Array(r.rating || 5)].map((_, i) => (
                                                <span key={i} style={{ color: '#f59e0b' }}>★</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="del-btn" onClick={() => handleDelete(r.id)} title="Delete Review">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewManager;
