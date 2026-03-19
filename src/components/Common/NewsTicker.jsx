import React from 'react';
import './NewsTicker.css';
import { useLanguage } from '../../context/LanguageContext';

const NewsTicker = () => {
  const { language } = useLanguage();

  const newsItems = [
    { en: "Admission open for session 2025-26. Limited seats available!", hi: "सत्र 2025-26 के लिए प्रवेश खुले हैं। सीटें सीमित हैं!" },
    { en: "Annual Sports Meet scheduled for 25th March 2025.", hi: "वार्षिक खेल प्रतियोगिता 25 मार्च 2025 को निर्धारित है।" },
    { en: "New E-Learning modules added to Student Dashboard.", hi: "छात्र डैशबोर्ड में नए ई-लर्निंग मॉड्यूल जोड़े गए।" },
    { en: "Congratulations to Class 10th toppers for exceptional results!", hi: "कक्षा 10वीं के टॉपर्स को शानदार परिणामों के लिए बधाई!" },
  ];

  const content = [...newsItems, ...newsItems].map((item, idx) => (
    <div key={idx} className="ticker-item">
      <span className="dot"></span>
      {language === 'hi' ? item.hi : item.en}
    </div>
  ));

  return (
    <div className="news-ticker-container">
      <div className="ticker-label">
        {language === 'hi' ? 'ताज़ा खबर' : 'Latest News'}
      </div>
      <div className="ticker-content">
        {content}
      </div>
    </div>
  );
};

export default NewsTicker;
