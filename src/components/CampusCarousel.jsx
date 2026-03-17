import React, { useState, useEffect } from 'react';
import './CampusCarousel.css';

import campus1 from '../assets/gallery/campus1.png';
import photo3 from '../assets/gallery/photo3.png';
import photo5 from '../assets/gallery/photo5.png';
import photo1 from '../assets/gallery/photo1.png';

const slides = [
    { id: 1, src: campus1, title: 'Our Campus', desc: 'State-of-the-art infrastructure for quality education' },
    { id: 2, src: photo3, title: 'Annual Day Celebration', desc: 'Students and faculty celebrating together' },
    { id: 3, src: photo5, title: 'Award Ceremony', desc: 'Recognizing and honoring excellence' },
    { id: 4, src: photo1, title: 'School Activities', desc: 'Students engaging in co-curricular activities' },
];

const CampusCarousel = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const goTo = (index) => setCurrent(index);
    const goPrev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    const goNext = () => setCurrent((prev) => (prev + 1) % slides.length);

    return (
        <section className="campus-carousel-section">
            <div className="campus-carousel-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`campus-slide ${index === current ? 'active' : ''}`}
                    >
                        <img src={slide.src} alt={slide.title} className="campus-slide-img" />
                        <div className="campus-slide-overlay">
                            <h3 className="campus-slide-title">{slide.title}</h3>
                            <p className="campus-slide-desc">{slide.desc}</p>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button className="campus-arrow campus-prev" onClick={goPrev} aria-label="Previous">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>
                <button className="campus-arrow campus-next" onClick={goNext} aria-label="Next">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>

                {/* Dots */}
                <div className="campus-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`campus-dot ${index === current ? 'active' : ''}`}
                            onClick={() => goTo(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CampusCarousel;
