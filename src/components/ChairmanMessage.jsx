import React from 'react';
import { Link } from 'react-router-dom';
import './ChairmanMessage.css';
import chairmanImg from '../assets/chairman.png';

const ChairmanMessage = () => {
    return (
        <section className="chairman-section">
            <div className="chairman-container">
                <div className="chairman-image-wrapper">
                    <img src={chairmanImg} alt="Chairman" className="chairman-image" />
                </div>
                <div className="chairman-content">
                    <h2 className="chairman-heading">Chairman's Message</h2>
                    <blockquote className="chairman-quote">
                        "शिक्षा वह हथियार है जिससे आप दुनिया को बदल सकते हैं।"
                    </blockquote>
                    <p className="chairman-text">
                        प्रिय अभिभावकों और विद्यार्थियों, श्री जागेश्वर मेमोरियल एजुकेशनल
                        इंस्टीट्यूट में आपका स्वागत है। हमारा संस्थान बच्चों के सर्वांगीण विकास
                        के लिए समर्पित है। हम न केवल शैक्षणिक उत्कृष्टता पर ध्यान देते हैं, बल्कि
                        नैतिक मूल्यों, अनुशासन और व्यावहारिक कौशल को भी बढ़ावा देते हैं।
                        हमारा लक्ष्य है कि हर विद्यार्थी आत्मविश्वास और ज्ञान के साथ
                        अपने भविष्य का निर्माण कर सके।
                    </p>
                    <Link to="/about" className="chairman-btn">Read More</Link>
                </div>
            </div>
        </section>
    );
};

export default ChairmanMessage;
