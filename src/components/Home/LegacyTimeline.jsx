import React from 'react';
import './LegacyTimeline.css';
import { useLanguage } from '../../context/LanguageContext';

const timelineData = [
    {
        year: '2011',
        title: { en: 'The Foundation', hi: 'नींव की स्थापना' },
        desc: { 
            en: 'Our journey began with a vision to provide quality education in Raebareli.', 
            hi: 'रायबरेली में गुणवत्तापूर्ण शिक्षा प्रदान करने के विजन के साथ हमारी यात्रा शुरू हुई।' 
        },
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2015',
        title: { en: 'First Milestone', hi: 'पहला मील का पत्थर' },
        desc: { 
            en: 'Our first batch of High School students graduated with 100% results.', 
            hi: 'हाई स्कूल के छात्रों के हमारे पहले बैच ने 100% परिणामों के साथ स्नातक की उपाधि प्राप्त की।' 
        },
        image: 'https://images.unsplash.com/photo-1523050335456-adabc2246744?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2018',
        title: { en: 'Expansion', hi: 'विस्तार' },
        desc: { 
            en: 'Inauguration of our state-of-the-art sports complex and science labs.', 
            hi: 'हमारे अत्याधुनिक खेल परिसर और विज्ञान प्रयोगशालाओं का उद्घाटन।' 
        },
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2022',
        title: { en: 'Digital Era', hi: 'डिजिटल युग' },
        desc: { 
            en: 'Implementation of smart classrooms and the AI-powered learning system.', 
            hi: 'स्मार्ट क्लासरूम और एआई-संचालित शिक्षण प्रणाली का कार्यान्वयन।' 
        },
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2026',
        title: { en: 'Future Ready', hi: 'भविष्य के लिए तैयार' },
        desc: { 
            en: 'Recognized as the most innovative school in the region.', 
            hi: 'क्षेत्र के सबसे नवीन (Innovative) स्कूल के रूप में मान्यता प्राप्त।' 
        },
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400'
    }
];

const LegacyTimeline = () => {
    const { language } = useLanguage();

    return (
        <section className="legacy-timeline-section">
            <div className="section-header-centered">
                <span className="premium-tag">{language === 'hi' ? 'हमारी विरासत' : 'OUR LEGACY'}</span>
                <h2>{language === 'hi' ? 'समय के साथ हमारी यात्रा' : 'Our Journey Through Time'}</h2>
            </div>

            <div className="timeline-container">
                <div className="timeline-line"></div>
                {timelineData.map((item, index) => (
                    <div key={item.year} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="timeline-year">{item.year}</div>
                        <div className="timeline-card glass-panel reveal-on-scroll">
                            <div className="timeline-img-wrapper">
                                <img src={item.image} alt={item.year} />
                                <div className="img-overlay"></div>
                            </div>
                            <div className="timeline-content">
                                <h3>{item.title[language]}</h3>
                                <p>{item.desc[language]}</p>
                            </div>
                        </div>
                        <div className="timeline-dot"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LegacyTimeline;
