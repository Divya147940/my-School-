import React from 'react';
import './AdmissionRoadmap.css';
import { useLanguage } from '../../context/LanguageContext';

const AdmissionRoadmap = () => {
    const { language } = useLanguage();
    
    const steps = [
        {
            id: 1,
            title: language === 'hi' ? 'पूछताछ' : 'Inquiry',
            desc: language === 'hi' ? 'ऑनलाइन आवेदन करें या कैंपस आएं।' : 'Submit online form or visit campus.',
            icon: '📝'
        },
        {
            id: 2,
            title: language === 'hi' ? 'परामर्श' : 'Counseling',
            desc: language === 'hi' ? 'हमारे विशेषज्ञों के साथ बातचीत।' : 'Interaction with our counselors.',
            icon: '🤝'
        },
        {
            id: 3,
            title: language === 'hi' ? 'मूल्यांकन' : 'Assessment',
            desc: language === 'hi' ? 'कौशल और ज्ञान का परीक्षण।' : 'Skill and knowledge evaluation.',
            icon: '🧠'
        },
        {
            id: 4,
            title: language === 'hi' ? 'दस्तावेज़ीकरण' : 'Documentation',
            desc: language === 'hi' ? 'जरूरी कागजात जमा करें।' : 'Submit required documents.',
            icon: '📄'
        },
        {
            id: 5,
            title: language === 'hi' ? 'स्वागत' : 'Welcome',
            desc: language === 'hi' ? 'एनएसजीआई परिवार में आपका स्वागत है!' : 'Welcome to the NSGI Family!',
            icon: '🎓'
        }
    ];

    return (
        <div className="admission-roadmap-container">
            <h2 className="roadmap-title">
                {language === 'hi' ? 'आपका प्रवेश सफर' : 'Your Enrollment Journey'}
            </h2>
            <div className="roadmap-line">
                {steps.map((step, index) => (
                    <div key={step.id} className="roadmap-step">
                        <div className="step-marker">
                            <div className="step-icon">{step.icon}</div>
                            <div className="step-number">{step.id}</div>
                        </div>
                        <div className="step-content">
                            <h4>{step.title}</h4>
                            <p>{step.desc}</p>
                        </div>
                        {index < steps.length - 1 && <div className="step-connector"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdmissionRoadmap;
