import React from 'react';
import './ChairmanMessagePage.css';
import useScrollReveal from '../hooks/useScrollReveal';
import chairmanImg from '../assets/chairman.png';
import { useLanguage } from '../context/LanguageContext';

const ChairmanMessagePage = () => {
    const { t } = useLanguage();
    const sectionRef = useScrollReveal({ threshold: 0.1 });

    return (
        <div className="chairman-page" ref={sectionRef}>
            {/* Hero Section */}
            <section className="chairman-hero reveal-on-scroll">
                <div className="chairman-hero-overlay"></div>
                <div className="chairman-hero-content">
                    <h1>{t('chairman_heading')}</h1>
                    <div className="hero-divider"></div>
                </div>
            </section>

            {/* Content Section */}
            <section className="chairman-main-content reveal-on-scroll">
                <div className="chairman-profile-card">
                    <div className="chairman-profile-image">
                        <img src={chairmanImg} alt="Chairman" />
                    </div>
                    <div className="chairman-profile-info">
                        <h2>Hon. Chairman</h2>
                        <p>NSGI Group of Institutions</p>
                    </div>
                </div>

                <div className="chairman-detailed-text">
                    <blockquote className="premium-quote">
                        "{t('chairman_quote')}"
                    </blockquote>

                    <div className="message-body">
                        <p>
                            {t('chairman_text')}
                        </p>
                        <p>
                            हमारा मानना है कि शिक्षा केवल किताबी ज्ञान तक सीमित नहीं होनी चाहिए। 
                            एक छात्र के जीवन में खेल, कला, और नैतिक मूल्यों का भी उतना ही महत्व है। 
                            NSGI में हम एक ऐसा वातावरण प्रदान करते हैं जहाँ बच्चे न केवल सीखते हैं, 
                            बल्कि एक जिम्मेदार नागरिक के रूप में विकसित होते हैं।
                        </p>
                        <p>
                            पिछले 13 वर्षों से हम निरंतर अपने शिक्षण के तरीकों और बुनियादी ढांचे (Infrastructure) 
                            को आधुनिक बना रहे हैं। स्मार्ट क्लासेज और डिजिटल पोर्टल हमारे इसी प्रयास का हिस्सा हैं।
                        </p>
                        <p>
                            मैं सभी अभिभावकों का आभार व्यक्त करता हूँ जिन्होंने हम पर विश्वास किया। 
                            हम साथ मिलकर अपने बच्चों के भविष्य को उज्जवल बनाएंगे।
                        </p>
                    </div>

                    <div className="chairman-signature">
                        <p>Warm Regards,</p>
                        <h3>Hon. Chairman</h3>
                        <span>Shri Jageshwar Memorial Educational Institute</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ChairmanMessagePage;
