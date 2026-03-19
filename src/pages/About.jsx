import React from 'react';
import './About.css';
import useScrollReveal from '../hooks/useScrollReveal';
import useSEO from '../hooks/useSEO';
import divyanshiImg from '../assets/faculty/divyanshi.png';
import chairmanImg from '../assets/chairman.png';

function About() {
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    
    useSEO(
        "About Us",
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
                <h1 className="premium-gradient-text">About Our Institute</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Celebrating 13 Years of Educational Legacy</p>
            </div>

            <div className="about-content reveal-on-scroll glass-panel" style={{ margin: '20px', padding: '40px' }}>
                <h2 className="premium-gradient-text">Our Story & Legacy</h2>
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
                        <h2>Chairman's Message</h2>
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

            {/* Facilities Section */}
            <div className="facilities-section">
                <div className="reveal-on-scroll">
                    <h2 className="facilities-heading">हमारी सुविधाएँ</h2>
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

            <div className="team-section">
                <div className="reveal-on-scroll">
                    <h2>Meet Our Visionary Team</h2>
                    <span className="team-subtitle">The Minds Behind Our Excellence</span>
                </div>

                <div className="team-container">
                    {/* Husbun Jahan - MBA, HR & IT */}
                    <div className="team-card reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                        <div className="team-img-box">
                            <div className="team-avatar" style={{ background: 'linear-gradient(135deg, #1a1a6e, #3a3aae)' }}>
                                <span>HJ</span>
                            </div>
                        </div>
                        <div className="team-info">
                            <h3 className="team-name">Husbun Jahan</h3>
                            <p className="team-role">MBA | HR & IT Head</p>
                            <p className="faculty-desc" style={{ marginTop: '15px' }}>
                                Expert in Human Resource Management and Information Technology.
                                Manages institutional operations, staff coordination, and IT infrastructure.
                            </p>
                        </div>
                    </div>

                    {/* Divyanshi Verma */}
                    <div className="team-card reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
                        <div className="team-img-box">
                            <img src={divyanshiImg} alt="Divyanshi Verma" className="team-img" />
                        </div>
                        <div className="team-info">
                            <h3 className="team-name">Divyanshi Verma</h3>
                            <p className="team-role">AI Engineer & Technical Coordinator</p>
                            <p className="faculty-desc" style={{ marginTop: '15px' }}>
                                Specializing in Advanced Agentic Coding and AI integration to
                                modernize the educational landscape.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
