import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useTheme } from '../context/ThemeContext';
import ReviewForm from './Common/ReviewForm';
import './ParentReviews.css';

const ParentReviews = () => {
    const { isDark } = useTheme();
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadReviews = () => {
        setReviews(mockApi.getReviews());
    };

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        if (reviews.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [reviews]);

    const setIndex = (index) => {
        setCurrentIndex(index);
    };

    if (reviews.length === 0) return null;

    return (
        <section className={`reviews-section ${!isDark ? 'light-mode' : ''}`}>
            <div className="reviews-header">
                <h2 className="reviews-title">Word from our Parents</h2>
                <div className="reviews-zigzag"></div>
                <p className="section-subtitle">Real feedback from parents across the NSGI community.</p>
            </div>

            <div className="reviews-carousel-container">
                <div className="reviews-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card-wrapper">
                            <div className="review-card glass-panel card-vibe">
                                <div className="quote-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="currentColor" opacity="0.1">
                                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017C11.4647 13 11.017 12.5523 11.017 12V9C11.017 7.34315 12.3601 6 14.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H1.017C0.464718 13 0.017 12.5523 0.017 12V9C0.017 7.34315 1.36015 6 3.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 16.6569 9.67386 18 8.017 18H6.017C5.46472 18 5.017 18.4477 5.017 19V21H3.017Z" />
                                    </svg>
                                </div>
                                <p className="review-text">"{review.text}"</p>
                                <div className="review-footer">
                                    <div className="reviewer-info">
                                        <h4 className="reviewer-name">{review.name}</h4>
                                        <p className="reviewer-relation">{review.relation} • {review.date || 'Review'}</p>
                                    </div>
                                    <div className="stars">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="star-icon">★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="carousel-controls">
                    <div className="carousel-dots">
                        {reviews.map((_, index) => (
                            <button
                                key={index}
                                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="submit-review-container" style={{ marginTop: '40px' }}>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="submit-custom-review-btn"
                        style={{
                            background: 'var(--glass-glow)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--glass-border)',
                            padding: '10px 20px',
                            borderRadius: '30px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s',
                            letterSpacing: '0.5px'
                        }}
                    >
                        <span>Submit Review & Feedback</span>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                        </svg>
                    </button>
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Review will be sent to Admin for approval.
                    </p>
                </div>
            </div>

            {isFormOpen && (
                <ReviewForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSuccess={loadReviews}
                />
            )}
        </section>
    );
};

export default ParentReviews;
