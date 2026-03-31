import React from 'react';
import './VisionMission.css';

function VisionMission() {
    return (
        <div className="vm-page">
            {/* Hero */}
            <div className="vm-hero">
                <h1>Vision & Mission</h1>
                <p>Building Tomorrow's Leaders Today</p>
            </div>

            {/* Vision Section */}
            <div className="vm-section">
                <div className="vm-card vm-vision">
                    <div className="vm-icon-box">
                        <span className="vm-icon">🔭</span>
                    </div>
                    <h2>हमारा विज़न (Our Vision)</h2>
                    <p>
                        श्री जागेश्वर मेमोरियल एजुकेशनल इंस्टीट्यूट का विज़न है कि हम एक ऐसा शैक्षिक
                        वातावरण तैयार करें जहाँ हर बच्चा अपनी पूरी क्षमता को पहचान सके और समाज
                        में एक जिम्मेदार, सक्षम और संवेदनशील नागरिक बने।
                    </p>
                    <ul className="vm-list">
                        <li>🎯 विश्वस्तरीय शिक्षा प्रणाली का विकास</li>
                        <li>🌟 हर बच्चे की प्रतिभा को निखारना</li>
                        <li>📚 नैतिक मूल्यों के साथ आधुनिक शिक्षा</li>
                        <li>🌍 वैश्विक स्तर पर प्रतिस्पर्धी छात्रों का निर्माण</li>
                    </ul>
                </div>

                <div className="vm-card vm-mission">
                    <div className="vm-icon-box">
                        <span className="vm-icon">🎯</span>
                    </div>
                    <h2>हमारा मिशन (Our Mission)</h2>
                    <p>
                        हमारा मिशन है कि हम गुणवत्तापूर्ण शिक्षा के माध्यम से छात्रों का
                        सर्वांगीण विकास करें। हम शैक्षणिक उत्कृष्टता, नैतिक विकास और
                        व्यावहारिक कौशल को एक साथ बढ़ावा देते हैं।
                    </p>
                    <ul className="vm-list">
                        <li>📖 रीजनिंग और प्रतिस्पर्धी परीक्षाओं की तैयारी</li>
                        <li>💻 स्मार्ट क्लास और आधुनिक तकनीक से शिक्षा</li>
                        <li>🔬 विज्ञान प्रयोगशाला में व्यावहारिक शिक्षा</li>
                        <li>🧵 गृह विज्ञान और सिलाई प्रशिक्षण</li>
                        <li>🏆 खेल, कला और सांस्कृतिक गतिविधियाँ</li>
                        <li>🚌 निःशुल्क बस टूर और शैक्षिक भ्रमण</li>
                    </ul>
                </div>
            </div>

            {/* Core Values */}
            <div className="vm-values-section">
                <h2 className="vm-values-heading">हमारे मूल्य (Our Core Values)</h2>
                <span className="vm-values-subtitle">The Pillars of Our Education</span>

                <div className="vm-values-grid">
                    <div className="vm-value-card">
                        <div className="vm-value-icon">🏛️</div>
                        <h3>अनुशासन</h3>
                        <p>Discipline</p>
                        <span>विद्यार्थियों में अनुशासन और समय प्रबंधन की आदत विकसित करना</span>
                    </div>
                    <div className="vm-value-card">
                        <div className="vm-value-icon">🤝</div>
                        <h3>सम्मान</h3>
                        <p>Respect</p>
                        <span>शिक्षकों, बड़ों और सहपाठियों के प्रति सम्मान की भावना</span>
                    </div>
                    <div className="vm-value-card">
                        <div className="vm-value-icon">💡</div>
                        <h3>नवाचार</h3>
                        <p>Innovation</p>
                        <span>नई तकनीक और आधुनिक शिक्षा पद्धतियों का उपयोग</span>
                    </div>
                    <div className="vm-value-card">
                        <div className="vm-value-icon">❤️</div>
                        <h3>करुणा</h3>
                        <p>Compassion</p>
                        <span>समाज सेवा और दूसरों की मदद करने की प्रेरणा</span>
                    </div>
                    <div className="vm-value-card">
                        <div className="vm-value-icon">🌱</div>
                        <h3>उत्कृष्टता</h3>
                        <p>Excellence</p>
                        <span>हर कार्य में श्रेष्ठता प्राप्त करने का प्रयास</span>
                    </div>
                    <div className="vm-value-card">
                        <div className="vm-value-icon">📐</div>
                        <h3>ईमानदारी</h3>
                        <p>Integrity</p>
                        <span>सत्यता और ईमानदारी के साथ जीवन जीने की शिक्षा</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VisionMission;
