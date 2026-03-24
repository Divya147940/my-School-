import React from 'react';
import './LegacyTimeline.css';
import { useLanguage } from '../../context/LanguageContext';
import foundersImg from '../../assets/founders.png';

const timelineData = [
    {
        year: '2011',
        title: { en: 'The Visionary Foundation', hi: 'गौरवशाली नींव' },
        desc: { 
            en: 'Our journey began with Shambhu Parshad and Phool Mati, whose vision laid the foundation of this temple of learning.', 
            hi: 'हमारी प्रेरणादायक यात्रा की शुरुआत श्री शंभू परशाद और श्रीमती फूल मती के महान संकल्प से हुई, जिन्होंने इस विद्या के मंदिर की नींव रखी।' 
        },
        image: foundersImg
    },
    {
        year: '2015',
        title: { en: 'First Academic Glory', hi: 'शैक्षणिक गौरव का उदय' },
        desc: { 
            en: 'Marking 5 years of excellence, our students achieved 100% success in board examinations for the first time.', 
            hi: 'सफलता के प्रथम सोपान: हमारे छात्रों ने अपनी कड़ी मेहनत से विद्यालय का नाम रोशन किया और शत-प्रतिशत परीक्षा परिणाम हासिल किए।' 
        },
        image: 'https://images.unsplash.com/photo-1523050335456-adabc2246744?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2019',
        title: { en: 'Expansion & Trust', hi: 'विकास और अटूट विश्वास' },
        desc: { 
            en: '10 years of service to Raebareli, expanding our infrastructure with advanced labs and sports arenas.', 
            hi: '10 वर्षों का निरंतर सेवा भाव: अत्याधुनिक प्रयोगशालाओं और खेल सुविधाओं के साथ हमने अपने विद्यार्थियों के सर्वांगीण विकास की राह प्रशस्त की।' 
        },
        image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2023',
        title: { en: 'The Digital Revolution', hi: 'डिजिटल क्रांति का आगाज़' },
        desc: { 
            en: 'Transitioned to a smart ecosystem, integrating AI and modern technology into the traditional classroom.', 
            hi: 'हमने शिक्षा को आधुनिक तकनीक और स्मार्ट क्लासरूम के साथ जोड़कर एक नए डिजिटल युग की शुरुआत की।' 
        },
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
    },
    {
        year: '2026',
        title: { en: '15 Years of Legacy', hi: 'उत्कृष्टता के 15 गौरवशाली वर्ष' },
        desc: { 
            en: 'Celebrating 15 years of transforming lives. Today, we stand as the region\'s most trusted innovative institution.', 
            hi: 'जीवन बदलने के 15 वर्ष: आज हम क्षेत्र के सबसे उन्नत और विश्वसनीय शिक्षण संस्थान के रूप में नई ऊंचाइयों को छू रहे हैं।' 
        },
        image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=400'
    }
];

const LegacyTimelineV3 = () => {
    const { language } = useLanguage();

    return (
        <section className="legacy-timeline-section v3-final">
            <div className="section-header-centered">
                <span className="premium-tag">{language === 'hi' ? 'हमारी विरासत' : 'OUR LEGACY'}</span>
                <h2 className="v3-main-title">{language === 'hi' ? 'संस्थापकों की यात्रा' : 'FOUNDERS JOURNEY'}</h2>
            </div>

            <div className="timeline-container v3-container">
                <div className="timeline-line"></div>
                {timelineData.map((item, index) => (
                    <div key={item.year} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                        {/* English Card Side */}
                        <div className="timeline-card-side v3-card-side">
                            <div className="timeline-card glass-panel">
                                <div className="timeline-img-wrapper">
                                    <img src={item.image} alt={item.year} className="v3-milestone-img" />
                                    <div className="img-overlay"></div>
                                </div>
                                <div className="timeline-content">
                                    <h3 className="v3-card-title">{item.title.en}</h3>
                                    <p className="v3-card-desc">{item.desc.en}</p>
                                </div>
                            </div>
                        </div>

                        {/* Line Marker */}
                        <div className="timeline-marker v3-marker">
                            <div className="timeline-year">{item.year}</div>
                            <div className="timeline-dot"></div>
                        </div>

                        {/* Hindi Text Side */}
                        <div className="timeline-text-side v3-text-side">
                            <div className="hindi-content">
                                <h3 className="hindi-title v3-hi-title">{item.title.hi}</h3>
                                <p className="hindi-desc v3-hi-desc">{item.desc.hi}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default LegacyTimelineV3;
