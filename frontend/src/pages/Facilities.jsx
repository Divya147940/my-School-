import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Facilities.css';

function Facilities() {
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    const facilities = [
        {
            icon: '🧠',
            title: 'रीजनिंग एण्ड कम्पेटीटिव क्लासेज',
            desc: 'Reasoning & Competitive exam preparation classes to sharpen the analytical skills of students and prepare them for various entrance examinations.',
            highlight: 'Competitive Edge',
            color: 'var(--accent-blue)'
        },
        {
            icon: '🚌',
            title: 'बस की सुविधा',
            desc: 'Safe and convenient bus transportation facility for students commuting from nearby areas, ensuring timely arrival and departure.',
            highlight: 'Safe Transport',
            color: 'var(--accent-purple)'
        },
        {
            icon: '📺',
            title: 'स्मार्ट / विज़ुअल क्लासेज',
            desc: 'Modern Smart Classes equipped with projectors, audio-visual aids, and interactive digital boards for an engaging learning experience.',
            highlight: 'Digital Learning',
            color: 'var(--accent-blue)'
        },
        {
            icon: '🧵',
            title: 'सिलाई शिक्षण की व्यवस्था',
            desc: 'Sewing and stitching training facility for Class 10 girls as part of Home Science curriculum, promoting practical and vocational skills.',
            highlight: 'Vocational Skills',
            color: 'var(--accent-purple)'
        },
        {
            icon: '📹',
            title: 'CCTV कैमरा युक्त कक्षाएँ',
            desc: 'All classrooms are monitored with CCTV cameras for complete safety, security, and transparent monitoring of the campus.',
            highlight: 'Campus Safety',
            color: 'var(--accent-blue)'
        },
        {
            icon: '🗺️',
            title: 'निःशुल्क वार्षिक बस टूर',
            desc: 'Free annual educational tour organized by bus for students to explore new places, learn outside the classroom, and create memories.',
            highlight: 'Annual Tours',
            color: 'var(--accent-purple)'
        },
        {
            icon: '🔬',
            title: 'विज्ञान प्रयोगशाला',
            desc: 'Fully equipped laboratories for Biology, Physics, and Chemistry in upper classes, enabling students to learn through hands-on experiments.',
            highlight: 'Science Labs',
            color: 'var(--accent-blue)'
        },
        {
            icon: '📚',
            title: 'पुस्तकालय',
            desc: 'Well-stocked library with a wide collection of textbooks, reference books, magazines, and competitive exam study material.',
            highlight: 'Rich Library',
            color: 'var(--accent-purple)'
        },
        {
            icon: '🏋️',
            title: 'खेल का मैदान',
            desc: 'Spacious playground for outdoor sports and physical activities, ensuring the physical fitness and overall well-being of every student.',
            highlight: 'Sports Ground',
            color: 'var(--accent-blue)'
        }
    ];

    return (
        <div className="fac-page" ref={sectionRef}>
            {/* Hero */}
            <div className="fac-hero reveal-on-scroll">
                <h1>Our Facilities</h1>
                <p>State-of-the-Art Infrastructure for Holistic Education</p>
            </div>

            {/* Intro */}
            <div className="fac-intro reveal-on-scroll">
                <h2>हमारी सुविधाएँ</h2>
                <p>
                    श्री जागेश्वर मेमोरियल एजुकेशनल इंस्टीट्यूट में हम विद्यार्थियों को
                    आधुनिक सुविधाओं से सुसज्जित वातावरण प्रदान करते हैं। हमारा लक्ष्य है
                    कि हर बच्चा सर्वोत्तम शिक्षा और सुरक्षित माहौल में सीखे और बढ़े।
                </p>
            </div>

            {/* Facilities Grid */}
            <div className="fac-grid-section">
                <div className="fac-grid">
                    {facilities.map((facility, index) => (
                        <div 
                            className="fac-card reveal-on-scroll" 
                            key={index} 
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                        >
                            <div className="fac-card-badge" style={{ backgroundColor: facility.color }}>{facility.highlight}</div>
                            <div className="fac-card-icon">{facility.icon}</div>
                            <h3 className="fac-card-title">{facility.title}</h3>
                            <p className="fac-card-desc">{facility.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="fac-cta reveal-on-scroll">
                <h2>हमारे कैंपस को देखें</h2>
                <p>Visit our campus and experience our facilities firsthand</p>
                <a href="/contact" className="fac-cta-btn">Contact Us for Campus Visit</a>
            </div>
        </div>
    );
}

export default Facilities;
