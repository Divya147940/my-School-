import React, { useState, useEffect, useRef } from 'react';
import './Gallery.css';

import hero1 from '../assets/hero/hero1.png';
import hero2 from '../assets/hero/hero2.jpg';
import hero3 from '../assets/hero/hero3.jpg';
import hero4 from '../assets/hero/hero4.jpg';
import hero6 from '../assets/hero/hero6.png';
import hero9 from '../assets/hero/hero9.png';
import hero10 from '../assets/hero/hero10.png';
import hero11 from '../assets/hero/hero11.jpg';
import hero14 from '../assets/hero/hero14.png';
import hero15 from '../assets/hero/hero15.jpg';

const slides = [
    {
        id: 101,
        src: hero1,
        title: ['Excellence in', 'Education'],
        subtitle: 'Fostering an environment of growth, discipline, and creativity in Amethi.',
        badge: 'Top Rated School',
        position: 'center 20%'
    },
    {
        id: 109,
        src: hero9,
        title: ['Shared National', 'Pride'],
        subtitle: 'Instilling a deep sense of patriotism and duty in every student heart.',
        badge: 'Flag Hoisting',
        position: 'center 45%'
    },
    {
        id: 115,
        src: hero15,
        title: ['Our Cultural', 'Heritage'],
        subtitle: 'Rooted in tradition, our students embrace spiritual and moral values.',
        badge: 'Cultural Visit',
        position: 'center 35%'
    },
    {
        id: 102,
        src: hero2,
        title: ['Shaping Bright', 'Futures'],
        subtitle: 'Our dedicated staff ensures every child receives personalized attention.',
        badge: 'Expert Faculty',
        position: 'center 20%'
    },
    {
        id: 114,
        src: hero14,
        title: ['Honoring Small', 'Success'],
        subtitle: 'Celebrating the hard work and competitive spirit of our bright stars.',
        badge: 'Medal Ceremony',
        position: 'center 25%'
    },
    {
        id: 110,
        src: hero10,
        title: ['Awarding Brilliant', 'Talent'],
        subtitle: 'Recognizing excellence and leadership with prestigious annual awards.',
        badge: 'Award Ceremony',
        position: 'center 20%'
    },
    {
        id: 104,
        src: hero4,
        title: ['Exploration &', 'Discovery'],
        subtitle: 'Learning through play and adventure in our fun-filled excursions.',
        badge: 'Student Life',
        position: 'center 20%'
    },
    {
        id: 111,
        src: hero11,
        title: ['Building Great', 'Champions'],
        subtitle: 'Empowering students to excel in both sports and academic pursuits.',
        badge: 'Champions',
        position: 'center 20%'
    },
    {
        id: 103,
        src: hero3,
        title: ['Innovative Art &', 'Science'],
        subtitle: 'Building practical skills through science and art exhibitions.',
        badge: 'Innovation Hub',
        position: 'center 20%'
    }
];

const Gallery = () => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef(null);

    const startAutoPlay = () => {
        intervalRef.current = setInterval(() => {
            goToNext();
        }, 5500);
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
        setTimeout(() => setIsAnimating(false), 800);
    };

    const goToPrev = () => {
        setIsAnimating(true);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 800);
    };

    const goToSlide = (index) => {
        if (index === current) return;
        setIsAnimating(true);
        setCurrent(index);
        setTimeout(() => setIsAnimating(false), 800);
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
        <section className="hero-slider" id="home">
            <div className="slider-container">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slider-slide ${index === current ? 'active' : ''}`}
                    >
                        <div className="slider-image-container">
                            <img
                                src={slide.src}
                                alt={slide.title.join(' ')}
                                className="slider-image"
                                style={{ objectPosition: slide.position || 'center center' }}
                            />
                            <div className="slider-overlay-gradient"></div>
                        </div>

                        <div className="slider-content-container">
                            <div className="slider-content-wrapper">
                                <div className="slider-content">
                                    {slide.badge && <span className="slider-badge">{slide.badge}</span>}
                                    <h1 className="slider-title">
                                        {slide.title[0]} <span className="accent-text">{slide.title[1]}</span>
                                    </h1>
                                    <p className="slider-subtitle">{slide.subtitle}</p>
                                    <div className="slider-actions">
                                        <button className="slider-cta primary" onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}>
                                            Apply Now
                                        </button>
                                        <button className="slider-cta secondary" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Controls */}
                <div className="slider-nav">
                    <button className="slider-arrow prev" onClick={handlePrev} aria-label="Previous slide">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                    <button className="slider-arrow next" onClick={handleNext} aria-label="Next slide">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                </div>

                {/* Scroll Down Hint */}
                <div className="slider-scroll-hint">
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
