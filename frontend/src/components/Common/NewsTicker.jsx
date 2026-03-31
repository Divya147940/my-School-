import './NewsTicker.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';
import { useState, useEffect } from 'react';

const NewsTicker = () => {
  const { language } = useLanguage();
  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews(mockApi.getNews());
  }, []);

  const defaultNews = [
    { en: "Admission open for session 2025-26. Limited seats available!", hi: "सत्र 2025-26 के लिए प्रवेश खुले हैं। सीटें सीमित हैं!" },
    { en: "Annual Sports Meet scheduled for 25th March 2025.", hi: "वार्षिक खेल प्रतियोगिता 25 मार्च 2025 को निर्धारित है।" }
  ];

  const newsItems = news.length > 0 ? news : defaultNews;

  const content = [...newsItems, ...newsItems].map((item, idx) => (
    <div key={idx} className="ticker-item">
      <span className="dot"></span>
      {language === 'hi' ? (item.hi || item.title) : (item.en || item.title)}
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
