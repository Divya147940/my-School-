import React, { useState, useEffect, useRef } from 'react';
import './OurStrength.css';

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) observer.observe(elementRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const endValue = parseInt(end);
        const increment = endValue / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) {
                setCount(endValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return <span ref={elementRef}>{count}{suffix}</span>;
};

const strengths = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        number: '500',
        suffix: '+',
        label: 'ACTIVE STUDENTS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
        number: '25',
        suffix: '+',
        label: 'EXPERT TEACHERS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        number: '100',
        suffix: '%',
        label: 'ACADEMIC RESULTS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
        ),
        number: '15',
        suffix: '+',
        label: 'YEARS LEGACY'
    }
];

const OurStrength = () => {
    return (
        <section className="strength-section">
            <div className="strength-header">
                <span className="strength-badge">Excellence Center</span>
                <h2 className="strength-title">Our <span className="premium-gradient-text">Impact</span> In Amethi</h2>
                <div className="strength-divider"></div>
                <p className="strength-subtitle">
                    Transforming futures through quality education and dedicated mentorship for over a decade.
                </p>
            </div>

            <div className="strength-grid">
                {strengths.map((item, index) => (
                    <div key={index} className="strength-item glass-panel card-vibe">
                        <div className="strength-icon-container">
                            {item.icon}
                        </div>
                        <h3 className="strength-number">
                            <CountUp end={item.number} suffix={item.suffix} />
                        </h3>
                        <p className="strength-label">{item.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurStrength;
