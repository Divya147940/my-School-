import React, { useState, useEffect } from 'react';
import './ParentReviews.css';

const reviews = [
    {
        id: 1,
        name: "Rajesh Kumar",
        relation: "Father of Aryan (Class 8)",
        text: "The academic standards and personality development focus at Shri Jageshwar Memorial are truly commendable. My son has shown great improvement in his confidence and communication skills.",
        rating: 5
    },
    {
        id: 2,
        name: "Suman Devi",
        relation: "Mother of Priya (Class 5)",
        text: "I am very happy with the individual attention teachers provide to every student. The school environment is safe, nurturing, and perfectly suited for primary education.",
        rating: 5
    },
    {
        id: 3,
        name: "Amit Verma",
        relation: "Father of Sneha (Class 10)",
        text: "The way the school handled board exam preparations was excellent. The extra classes and regular mock tests helped my daughter score brilliantly in her 10th boards.",
        rating: 4
    },
    {
        id: 4,
        name: "Anita Singh",
        relation: "Mother of Rahul (Class 12)",
        text: "A great institution for holistic development. Not just academics, but the sports and cultural activities are also given equal importance here.",
        rating: 5
    },
    {
        id: 5,
        name: "Vikram Pratap",
        relation: "Father of Kavya (Class 7)",
        text: "Best school in the region! The management is very approachable and they actually listen to parents' suggestions for the betterment of the school.",
        rating: 5
    }
];

const ParentReviews = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const setIndex = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="reviews-section">
            <div className="reviews-header">
                <h2 className="reviews-title">Parent's Review</h2>
                <div className="reviews-zigzag"></div>
            </div>

            <div className="reviews-carousel-container">
                <div className="reviews-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card-wrapper">
                            <div className="review-card">
                                <div className="quote-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H12.017C11.4647 13 11.017 12.5523 11.017 12V9C11.017 7.34315 12.3601 6 14.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H1.017C0.464718 13 0.017 12.5523 0.017 12V9C0.017 7.34315 1.36015 6 3.017 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 16.6569 9.67386 18 8.017 18H6.017C5.46472 18 5.017 18.4477 5.017 19V21H3.017Z" />
                                    </svg>
                                </div>
                                <p className="review-text">{review.text}</p>
                                <div className="review-footer">
                                    <h4 className="reviewer-name">{review.name}</h4>
                                    <p className="reviewer-relation">{review.relation}</p>
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
        </section>
    );
};

export default ParentReviews;
