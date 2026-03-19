import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';
import './AssignmentPortal.css';

const StudentAssignments = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [assignments, setAssignments] = useState([]);
    const [submittingId, setSubmittingId] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        setAssignments(mockApi.getAssignments());
    }, []);

    const subjects = ['All', ...new Set(assignments.map(a => a.subject))];

    const handleUpload = (id) => {
        setIsUploading(true);
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                clearInterval(interval);
                setUploadProgress(100);
                setTimeout(() => {
                    mockApi.submitWork(id, 'Student');
                    setAssignments(mockApi.getAssignments());
                    setSubmittingId(null);
                    setIsUploading(false);
                    setUploadProgress(0);
                    addToast(language === 'hi' ? 'असाइनमेंट सफलतापूर्वक जमा किया गया!' : 'Assignment Digitally Signed & Submitted!', 'success');
                }, 800);
            } else {
                setUploadProgress(progress);
            }
        }, 400);
    };

    const filtered = filter === 'All' ? assignments : assignments.filter(a => a.subject === filter);

    return (
        <div className="assignment-gateway">
            <div className="gateway-header">
                <div className="filters-bar">
                    {subjects.map(s => (
                        <button 
                            key={s} 
                            className={`filter-chip ${filter === s ? 'active' : ''}`}
                            onClick={() => setFilter(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="assignment-grid">
                {filtered.map(asm => (
                    <div key={asm.id} className={`assignment-card glass-panel ${asm.status.toLowerCase()}`}>
                        <div className="card-top">
                            <span className="subject-tag">{asm.subject}</span>
                            <span className={`status-badge ${asm.status.toLowerCase()}`}>
                                {asm.status === 'Completed' ? '✅ ' + (language === 'hi' ? 'पूर्ण' : 'Completed') : (language === 'hi' ? 'लंबित' : 'Pending')}
                            </span>
                        </div>
                        
                        <h3 className="asm-title">{asm.title}</h3>
                        <p className="asm-desc">{asm.instructions}</p>
                        
                        <div className="asm-meta">
                            <div className="meta-item">
                                <span className="icon">👨‍🏫</span>
                                <span>{asm.teacher || 'Institute Faculty'}</span>
                            </div>
                            <div className="meta-item">
                                <span className="icon">📅</span>
                                <span className={asm.status === 'Active' ? 'text-urgent' : ''}>Due: {asm.dueDate}</span>
                            </div>
                        </div>

                        {asm.status !== 'Completed' && submittingId !== asm.id && (
                            <button className="premium-submit-btn" onClick={() => setSubmittingId(asm.id)}>
                                {language === 'hi' ? 'कार्य जमा करें' : 'Submit Work'}
                            </button>
                        )}

                        {submittingId === asm.id && (
                            <div className="upload-zone">
                                {!isUploading ? (
                                    <>
                                        <div className="drop-area">
                                            <div className="upload-icon">📤</div>
                                            <p>{language === 'hi' ? 'फाइल यहाँ डालें' : 'Drop homework file here'}</p>
                                            <span>(PDF, DOCX, JPG)</span>
                                        </div>
                                        <div className="upload-actions">
                                            <button className="confirm-btn" onClick={() => handleUpload(asm.id)}>
                                                {language === 'hi' ? 'सबमिट करें' : 'Confirm Submission'}
                                            </button>
                                            <button className="cancel-link" onClick={() => setSubmittingId(null)}>
                                                {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="upload-progress-container">
                                        <p>{uploadProgress < 100 ? (language === 'hi' ? 'अपलोड हो रहा है...' : 'Encrypting & Uploading...') : (language === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying Signature...')}</p>
                                        <div className="progress-bar-bg">
                                            <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                        <span className="percentage">{Math.round(uploadProgress)}%</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {asm.status === 'Completed' && (
                            <div className="feedback-section">
                                <div className="feedback-header">
                                    <span className="stars">⭐⭐⭐⭐⭐</span>
                                    <span className="date">Reviewed 2h ago</span>
                                </div>
                                <p className="feedback-text">
                                    {language === 'hi' 
                                        ? '"बहुत अच्छा काम! आपका दृष्टिकोण बिल्कुल सही है।"' 
                                        : '"Excellent work! Your methodology is sound and presentation is professional."'}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentAssignments;
