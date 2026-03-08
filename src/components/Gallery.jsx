import React, { useState, useEffect, useRef } from 'react';
import './Gallery.css';

import photo1 from '../assets/gallery/photo1.png';
import photo3 from '../assets/gallery/photo3.png';
import photo4 from '../assets/gallery/photo4.png';
import photo5 from '../assets/gallery/photo5.png';

const slides = [
    { id: 1, src: photo1, caption: 'School Trip - Students enjoying outdoor activities' },
    { id: 3, src: photo3, caption: 'Annual Day Celebration - Chief Guest felicitation' },
    { id: 4, src: photo4, caption: 'Annual Function - Students performing folk dance' },
    { id: 5, src: photo5, caption: 'Award Ceremony - Honoring excellence' },
];

const Gallery = () => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef(null);

    const startAutoPlay = () => {
        intervalRef.current = setInterval(() => {
            goToNext();
        }, 3500);
    };

    const stopAutoPlay = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    }, []);

    const goToNext = () => {
        setIsAnimating(true);
        setCurrent((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const goToPrev = () => {
        setIsAnimating(true);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const goToSlide = (index) => {
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 600);
        stopAutoPlay();
        startAutoPlay();
    };

    const handlePrev = () => {
        goToPrev();
        stopAutoPlay();
        startAutoPlay();
    };

    const handleNext = () => {
        goToNext();
        stopAutoPlay();
        startAutoPlay();
    };

    return (
        <section className="gallery-section" id="gallery-section">
            <div className="gallery-carousel">
                <button className="carousel-btn prev-btn" onClick={handlePrev} aria-label="Previous slide">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                <div className="carousel-viewport">
                    <div className="carousel-track">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`carousel-slide ${index === current ? 'active' : ''} ${index === (current - 1 + slides.length) % slides.length ? 'prev' : ''
                                    } ${index === (current + 1) % slides.length ? 'next' : ''}`}
                            >
                                <div className="slide-card">
                                    <div className="slide-image-wrapper">
                                        <img src={slide.src} alt={slide.caption} className="slide-image" />
                                        <div className="slide-overlay">
                                            <span className="slide-number">{String(index + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}</span>
                                        </div>
                                    </div>
                                    <div className="slide-caption">
                                        <p>{slide.caption}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="carousel-btn next-btn" onClick={handleNext} aria-label="Next slide">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === current ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Gallery;
