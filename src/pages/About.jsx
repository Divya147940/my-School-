import React from 'react';
import './About.css';
import useScrollReveal from '../hooks/useScrollReveal';
import useSEO from '../hooks/useSEO';
import { useLanguage } from '../context/LanguageContext';
import divyanshiImg from '../assets/faculty/divyanshi.png';
import chairmanImg from '../assets/chairman.png';
import FacultyShowcase from '../components/Home/FacultyShowcase';

function About() {
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    const { t, language } = useLanguage();
    
    useSEO(
        t('about'),
        "Learn about our 13-year legacy, our visionary team, and the modern facilities we offer at NSGI."
    );
    const facilities = [
        {
            icon: '🧠',
            title: 'रीजनिंग एण्ड कम्पेटीटिव क्लासेज',
            desc: 'Reasoning & Competitive exam preparation classes for students'
        },
        {
            icon: '🚌',
            title: 'बस की सुविधा',
            desc: 'Convenient bus facility available for student transportation'
        },
        {
            icon: '📺',
            title: 'स्मार्ट / विज़ुअल क्लासेज',
            desc: 'Smart & Visual Classes with modern audio-visual teaching aids'
        },
        {
            icon: '🧵',
            title: 'सिलाई शिक्षण की व्यवस्था',
            desc: 'Sewing training for girls in Class 10 for Home Science subject'
        },
        {
            icon: '📹',
            title: 'CCTV कैमरा युक्त कक्षाएँ',
            desc: 'All classrooms equipped with CCTV cameras for safety & monitoring'
        },
        {
            icon: '🗺️',
            title: 'निःशुल्क वार्षिक बस टूर',
            desc: 'Free annual educational bus tour organized once a year for students'
        },
        {
            icon: '🔬',
            title: 'विज्ञान प्रयोगशाला',
            desc: 'Fully equipped labs for Biology, Physics & Chemistry in upper classes'
        }
    ];

    return (
        <div className="about-page" ref={sectionRef}>
            {/* Hero */}
            <div className="about-hero reveal-on-scroll glass-panel" style={{ margin: '40px 20px', padding: '60px 20px' }}>
                <h1 className="premium-gradient-text">{language === 'hi' ? 'हमारे संस्थान के बारे में' : 'About Our Institute'}</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{t('legacy')}</p>
            </div>

            <div className="about-content reveal-on-scroll glass-panel" style={{ margin: '20px', padding: '40px' }}>
                <h2 className="premium-gradient-text">{language === 'hi' ? 'हमारी कहानी और विरासत' : 'Our Story & Legacy'}</h2>
                <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                    <p>
                        पिछले <strong>13 वर्षों</strong> से हमारा संस्थान गुणवत्तापूर्ण शिक्षा प्रदान करने के लिए
                        समर्पित है। हम शिक्षा के क्षेत्र में एक प्रकाशस्तंभ के रूप में खड़े हैं।
                    </p>
                    <p>
                        हम सर्वांगीण विकास में विश्वास करते हैं — शैक्षणिक कठोरता के साथ कलात्मक,
                        खेल और सामाजिक विकास का संयोजन।
                    </p>
                </div>
            </div>

            {/* Chairman's Message Section */}
            <div className="chairman-msg-section reveal-on-scroll">
                <div className="chairman-msg-container">
                    <div className="chairman-msg-img-wrapper">
                        <img src={chairmanImg} alt="Chairman" className="chairman-msg-img" />
                        <div className="chairman-msg-name-badge">
                            <h4>Chairman</h4>
                            <span>Shri Jageshwar Memorial</span>
                        </div>
                    </div>
                    <div className="chairman-msg-content">
                        <h2>{t('chairman_msg')}</h2>
                        <blockquote>
                            "शिक्षा वह हथियार है जिससे आप दुनिया को बदल सकते हैं।"
                        </blockquote>
                        <p>
                            प्रिय अभिभावकों और विद्यार्थियों, श्री जागेश्वर मेमोरियल एजुकेशनल
                            इंस्टीट्यूट में आपका हार्दिक स्वागत है। पिछले 13 वर्षों में हमारे
                            संस्थान ने शिक्षा के क्षेत्र में एक अलग पहचान बनाई है।
                        </p>
                        <p>
                            हमारा संस्थान बच्चों के सर्वांगीण विकास के लिए समर्पित है। हम न केवल
                            शैक्षणिक उत्कृष्टता पर ध्यान देते हैं, बल्कि नैतिक मूल्यों, अनुशासन
                            और व्यावहारिक कौशल को भी बढ़ावा देते हैं। स्मार्ट क्लासेज, CCTV
                            कैमरों से सुरक्षित कक्षाएँ, विज्ञान प्रयोगशाला, और बस सुविधा जैसी
                            आधुनिक सुविधाओं के साथ हम अपने विद्यार्थियों को सर्वोत्तम शिक्षा
                            प्रदान करने का प्रयास करते हैं।
                        </p>
                        <p>
                            हमारा लक्ष्य है कि हर विद्यार्थी आत्मविश्वास, ज्ञान और संस्कारों
                            के साथ अपने भविष्य का निर्माण कर सके। मैं सभी अभिभावकों से अनुरोध
                            करता हूँ कि वे अपने बच्चों की शिक्षा में हमारे साथ सहयोग करें।
                        </p>
                    </div>
                </div>
            </div>

            {/* Our Journey Section */}
            <div className="journey-section reveal-on-scroll">
                <div className="section-header center">
                    <h2 className="premium-gradient-text">{language === 'hi' ? 'हमारी यात्रा' : 'Our Journey'}</h2>
                    <p className="section-subtitle">Milestones that shaped our institution</p>
                </div>

                <div className="journey-timeline">
                    {[
                        {
                            title: language === 'hi' ? 'शुरुआती दिन: खेल और विकास' : 'Early Days: Play & Growth',
                            desc: language === 'hi' ? 'हमारे संस्थान की नींव बच्चों के आनंद और समग्र विकास के विजन के साथ रखी गई थी।' : 'Our foundation was laid with a vision for joy and holistic development of children.',
                            img: 'journey_1.jpg',
                            side: 'left'
                        },
                        {
                            title: language === 'hi' ? 'विविधता और नेतृत्व' : 'Visionary Leadership',
                            desc: language === 'hi' ? 'संस्थापकों की टीम ने शिक्षा के प्रति एक समर्पित और अनुशासित दृष्टिकोण अपनाया।' : 'Our founding team brought a dedicated and disciplined approach to modern education.',
                            img: 'journey_2.jpg',
                            side: 'right'
                        },
                        {
                            title: language === 'hi' ? 'उपलब्धि और पहचान' : 'Recognition & Excellence',
                            desc: language === 'hi' ? 'छात्रों की कड़ी मेहनत को पुरस्कार और सम्मान के माध्यम से सराहा गया।' : "Celebrating student excellence through prestigious award ceremonies and recognition.",
                            img: 'journey_3.jpg',
                            side: 'left'
                        },
                        {
                            title: language === 'hi' ? 'प्रयोग और नवाचार' : 'Scientific Innovation',
                            desc: language === 'hi' ? 'विज्ञान और तकनीकी नवाचारों के माध्यम से भविष्य की तैयारी।' : 'Preparing for the future through hands-on science exhibitions and innovative learning.',
                            img: 'journey_4.jpg',
                            side: 'right'
                        },
                        {
                            title: language === 'hi' ? 'प्रकृति के साथ शिक्षा' : 'Outdoor Excellence',
                            desc: language === 'hi' ? 'खुले वातावरण में शिक्षा प्रदान कर व्यवहारिक ज्ञान को बढ़ाना।' : 'Enhancing practical knowledge through unique outdoor learning experiences in nature.',
                            img: 'journey_5.jpg',
                            side: 'left'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className={`journey-item ${item.side}`}>
                            <div className="journey-content glass-panel">
                                <div className="journey-img-container">
                                    <img 
                                        src={`/assets/journey/${item.img}`} 
                                        alt={item.title} 
                                        className="journey-img" 
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Milestone+Coming+Soon'; }} 
                                    />
                                    <div className="img-overlay"></div>
                                </div>
                                <div className="journey-text">
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </div>
                            <div className="timeline-dot"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Facilities Section */}
            <div className="facilities-section">
                <div className="reveal-on-scroll">
                    <h2 className="facilities-heading">{t('facilities_title')}</h2>
                    <span className="facilities-subtitle">Our Facilities & Infrastructure</span>
                </div>

                <div className="facilities-grid">
                    {facilities.map((facility, index) => (
                        <div 
                            className="facility-card reveal-on-scroll" 
                            key={index} 
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
                        >
                            <div className="facility-icon">{facility.icon}</div>
                            <h3 className="facility-title">{facility.title}</h3>
                            <p className="facility-desc">{facility.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="reveal-on-scroll">
                <FacultyShowcase />
            </div>
        </div>
    );
}

export default About;
