import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useTheme } from '../context/ThemeContext';
import './ParentReviews.css';

const ParentReviews = () => {
    const { theme } = useTheme();
    const [reviews, setReviews] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setReviews(mockApi.getReviews());
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
        <section className={`reviews-section ${theme === 'light' ? 'light-mode' : ''}`}>
            <div className="reviews-header">
                <h2 className="reviews-title">Word from our Parents</h2>
                <div className="section-dash"></div>
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
                                        <p className="reviewer-relation">{review.relation}</p>
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
                    
                    <a 
                        href="https://wa.me/919999999999?text=Hi, I would like to submit a review for NSGI School: " 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="submit-whatsapp-review"
                    >
                        <span>Submit Review via WhatsApp</span>
                        <svg className="wa-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="currentColor" d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.978 3.149.978 3.182 0 5.769-2.587 5.769-5.766 0-3.178-2.587-5.765-5.769-5.765zm3.377 8.272c-.14.393-.82.723-1.123.766-.303.041-.652.067-.932.067-.28 0-.573-.033-.865-.101-.367-.091-.715-.221-1.016-.385a4.846 4.846 0 0 1-1.637-1.428c-.466-.632-.821-1.353-1.066-2.128-.21-.663-.3-1.35-.3-2.031 0-.68.093-1.341.282-1.996.068-.236.195-.453.364-.633.169-.18.375-.327.606-.432h.564c.159 0 .31.063.421.173.111.11.173.262.174.421v1.171c0 .159-.063.311-.173.422-.11.11-.262.173-.421.173h-.211c-.159 0-.311.063-.422.173-.11.11-.173.262-.173.421a1.866 1.866 0 0 0 .504 1.22c.162.181.357.332.573.447l.154.081c.216.113.456.171.699.171h.211c.159 0 .31.063.421.174.111.11.173.262.173.421v1.171z"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ParentReviews;
