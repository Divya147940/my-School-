import React from 'react';
import './SocialWork.css';

function SocialWork() {
    const initiatives = [
        {
            icon: '🌳',
            title: 'वृक्षारोपण अभियान',
            desc: 'हर वर्ष विद्यालय परिसर और आसपास के क्षेत्रों में वृक्षारोपण अभियान चलाया जाता है। विद्यार्थियों को पर्यावरण संरक्षण का महत्व सिखाया जाता है।',
            tag: 'Environment'
        },
        {
            icon: '🩸',
            title: 'रक्तदान शिविर',
            desc: 'संस्थान द्वारा वार्षिक रक्तदान शिविर का आयोजन किया जाता है, जिसमें शिक्षक और स्टाफ सदस्य भाग लेते हैं।',
            tag: 'Health'
        },
        {
            icon: '📖',
            title: 'निःशुल्क शिक्षा सहायता',
            desc: 'आर्थिक रूप से कमजोर विद्यार्थियों को निःशुल्क पुस्तकें, कॉपियां और शिक्षण सामग्री प्रदान की जाती है।',
            tag: 'Education'
        },
        {
            icon: '🧹',
            title: 'स्वच्छता अभियान',
            desc: 'स्वच्छ भारत अभियान के तहत विद्यार्थियों के साथ मिलकर गांव और आसपास के क्षेत्रों की सफाई की जाती है।',
            tag: 'Cleanliness'
        },
        {
            icon: '👩‍🏫',
            title: 'जागरूकता कार्यक्रम',
            desc: 'बेटी बचाओ बेटी पढ़ाओ, नशा मुक्ति, और डिजिटल साक्षरता जैसे विषयों पर समुदाय में जागरूकता कार्यक्रम आयोजित किए जाते हैं।',
            tag: 'Awareness'
        },
        {
            icon: '🎁',
            title: 'दान और सहायता',
            desc: 'प्राकृतिक आपदाओं और जरूरतमंदों की सहायता के लिए संस्थान द्वारा दान संग्रह और वितरण अभियान चलाया जाता है।',
            tag: 'Charity'
        }
    ];

    return (
        <div className="sw-page">
            <div className="sw-hero">
                <h1>Social Work</h1>
                <p>Serving the Community, Building a Better Tomorrow</p>
            </div>

            <div className="sw-intro">
                <h2>समाज सेवा</h2>
                <p>
                    श्री जागेश्वर मेमोरियल एजुकेशनल इंस्टीट्यूट केवल शिक्षा तक सीमित नहीं है।
                    हम समाज के प्रति अपनी जिम्मेदारी को समझते हैं और विभिन्न सामाजिक
                    कार्यक्रमों के माध्यम से समुदाय की सेवा करते हैं। हमारे विद्यार्थी भी
                    इन अभियानों में सक्रिय रूप से भाग लेते हैं।
                </p>
            </div>

            <div className="sw-grid-section">
                <div className="sw-grid">
                    {initiatives.map((item, index) => (
                        <div className="sw-card" key={index}>
                            <div className="sw-card-tag">{item.tag}</div>
                            <div className="sw-card-icon">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sw-cta">
                <h2>हमसे जुड़ें</h2>
                <p>Join our social initiatives and make a difference in the community</p>
                <a href="/contact" className="sw-cta-btn">Get Involved</a>
            </div>
        </div>
    );
}

export default SocialWork;
