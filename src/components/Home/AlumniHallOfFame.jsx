import React from 'react';
import './AlumniHallOfFame.css';
import { useLanguage } from '../../context/LanguageContext';

const AlumniHallOfFame = () => {
    const { language } = useLanguage();
    
    const alumni = [
        {
            id: 1,
            name: 'Sameer Kumar',
            batch: '2012',
            position: language === 'hi' ? 'सॉफ्टवेयर इंजीनियर, गूगल' : 'Software Engineer, Google',
            achievement: language === 'hi' ? 'कैलिफोर्निया में टेक इनोवेशन का नेतृत्व कर रहे हैं।' : 'Leading tech innovation in California.',
            image: '👨‍💻'
        },
        {
            id: 2,
            name: 'Priya Singh',
            batch: '2015',
            position: language === 'hi' ? 'चिकित्सक, AIIMS' : 'Doctor, AIIMS',
            achievement: language === 'hi' ? 'सैकड़ों जिंदगियां बचाने वाली निस्वार्थ सेवा।' : 'Selfless service saving hundreds of lives.',
            image: '👩‍⚕️'
        },
        {
            id: 3,
            name: 'Rahul Sharma',
            batch: '2010',
            position: language === 'hi' ? 'IPS अधिकारी' : 'IPS Officer',
            achievement: language === 'hi' ? 'देश की सेवा में समर्पित और ईमानदार अधिकारी।' : 'Dedicated and honest officer serving the nation.',
            image: '👮'
        }
    ];

    return (
        <section className="alumni-section">
            <div className="alumni-header">
                <span className="alumni-subtitle">{language === 'hi' ? 'हमारी विरासत' : 'OUR LEGACY'}</span>
                <h2 className="alumni-title">
                    {language === 'hi' ? 'पूर्व छात्र गौरव' : 'Alumni Wall of Pride'}
                </h2>
                <div className="title-underline"></div>
            </div>

            <div className="alumni-grid">
                {alumni.map(person => (
                    <div key={person.id} className="alumni-card glass-panel">
                        <div className="alumni-avatar">
                            <span className="avatar-icon">{person.image}</span>
                        </div>
                        <div className="alumni-details">
                            <h4 className="alumni-name">{person.name}</h4>
                            <div className="alumni-batch">Batch {person.batch}</div>
                            <div className="alumni-role">{person.position}</div>
                            <p className="alumni-quote">"{person.achievement}"</p>
                        </div>
                        <div className="card-decoration"></div>
                    </div>
                ))}
            </div>
            
            <div className="alumni-footer">
                <button className="join-alumni-btn">
                    {language === 'hi' ? 'एलुमनाई नेटवर्क से जुड़ें' : 'Join Alumni Network'}
                </button>
            </div>
        </section>
    );
};

export default AlumniHallOfFame;
