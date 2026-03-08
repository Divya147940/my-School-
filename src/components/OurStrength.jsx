import React from 'react';
import './OurStrength.css';

const strengths = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
            </svg>
        ),
        number: '500+',
        label: 'OUR STUDENTS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
        number: '25+',
        label: 'EXPERT TEACHERS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
        number: '100%',
        label: '10th RESULTS'
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="40" height="40">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
        ),
        number: '100%',
        label: '12th RESULTS'
    }
];

const OurStrength = () => {
    return (
        <section className="strength-section">
            <div className="strength-header">
                <h2 className="strength-title">Our Strength</h2>
                <div className="strength-divider"></div>
                <p className="strength-subtitle">
                    Under this category, we proudly display the number of our total students, teachers & academic excellence of High School & Intermediate.
                </p>
            </div>

            <div className="strength-grid">
                {strengths.map((item, index) => (
                    <div key={index} className="strength-item">
                        <div className="strength-icon-circle">
                            {item.icon}
                        </div>
                        <h3 className="strength-number">{item.number}</h3>
                        <p className="strength-label">{item.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurStrength;
