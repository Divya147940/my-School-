import React from 'react';
import './Achievements.css';

function Achievements() {
    const achievements = [
        {
            icon: '🏆',
            title: 'बोर्ड परीक्षा में उत्कृष्ट प्रदर्शन',
            desc: 'हमारे विद्यार्थियों ने U.P. बोर्ड परीक्षाओं में लगातार उत्कृष्ट परिणाम प्राप्त किए हैं, कई छात्रों ने 90% से अधिक अंक हासिल किए।',
            year: 'Every Year'
        },
        {
            icon: '🥇',
            title: 'जिला स्तरीय विज्ञान प्रतियोगिता',
            desc: 'हमारे विद्यार्थियों ने जिला स्तरीय विज्ञान प्रदर्शनी और प्रतियोगिता में प्रथम और द्वितीय स्थान प्राप्त किया।',
            year: 'District Level'
        },
        {
            icon: '📝',
            title: 'प्रतिस्पर्धी परीक्षा सफलता',
            desc: 'रीजनिंग और कम्पेटीटिव क्लासेज के माध्यम से कई छात्र विभिन्न प्रतिस्पर्धी परीक्षाओं में सफल हुए।',
            year: 'Competitive'
        },
        {
            icon: '🏅',
            title: 'खेलकूद में उपलब्धियां',
            desc: 'कबड्डी, खो-खो, और एथलेटिक्स में हमारे विद्यार्थियों ने ब्लॉक और जिला स्तर पर पदक जीते।',
            year: 'Sports'
        },
        {
            icon: '🎨',
            title: 'कला एवं सांस्कृतिक कार्यक्रम',
            desc: 'चित्रकला, निबंध लेखन, और वाद-विवाद प्रतियोगिताओं में हमारे छात्रों ने उत्कृष्ट प्रदर्शन किया।',
            year: 'Cultural'
        },
        {
            icon: '💻',
            title: 'डिजिटल शिक्षा में अग्रणी',
            desc: 'स्मार्ट क्लास और CCTV कैमरों के साथ डिजिटल शिक्षा को अपनाने वाले क्षेत्र के अग्रणी संस्थानों में शामिल।',
            year: 'Innovation'
        }
    ];

    const stats = [
        { number: '500+', label: 'विद्यार्थी', sub: 'Students' },
        { number: '95%', label: 'उत्तीर्ण दर', sub: 'Pass Rate' },
        { number: '15+', label: 'शिक्षक', sub: 'Teachers' },
        { number: '10+', label: 'वर्ष का अनुभव', sub: 'Years' }
    ];

    return (
        <div className="ach-page">
            <div className="ach-hero">
                <h1>Our Achievements</h1>
                <p>Celebrating Excellence & Milestones</p>
            </div>

            {/* Stats */}
            <div className="ach-stats">
                {stats.map((stat, i) => (
                    <div className="ach-stat-card" key={i}>
                        <h2>{stat.number}</h2>
                        <p>{stat.label}</p>
                        <span>{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* Achievements Grid */}
            <div className="ach-section">
                <h2 className="ach-section-title">हमारी उपलब्धियां</h2>
                <span className="ach-section-subtitle">Pride of Our Institution</span>

                <div className="ach-grid">
                    {achievements.map((ach, index) => (
                        <div className="ach-card" key={index}>
                            <div className="ach-card-year">{ach.year}</div>
                            <div className="ach-card-icon">{ach.icon}</div>
                            <h3>{ach.title}</h3>
                            <p>{ach.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Achievements;
