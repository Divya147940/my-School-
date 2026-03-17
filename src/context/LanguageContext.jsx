import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        welcome: "Welcome to NSGI School",
        home: "Home",
        about: "About Us",
        academics: "Academics",
        admissions: "Admissions",
        faculty: "Faculty",
        gallery: "Gallery",
        contact: "Contact",
        login: "Login",
        dashboard: "Dashboard",
        latest_updates: "LATEST UPDATES",
        hall_of_fame: "Hall of Fame: NSGI Achievers",
        quick_links: "Explore Quick Links",
        parent_reviews: "What Parents Say",
        footer_desc: "Empowering students through education and innovation.",
        switch_lang: "Translate to Hindi",
        chairman_heading: "Chairman's Message",
        chairman_quote: "Education is the most powerful weapon which you can use to change the world.",
        chairman_text: "Welcome to Shri Jageshwar Memorial Educational Institute. Our institution is dedicated to the holistic development of children. We focus not only on academic excellence but also on moral values and discipline.",
        read_more: "Read More"
    },
    hi: {
        welcome: "NSGI स्कूल में आपका स्वागत है",
        home: "मुख्य पृष्ठ",
        about: "हमारे बारे में",
        academics: "शिक्षा",
        admissions: "प्रवेश",
        faculty: "शिक्षक",
        gallery: "गैलरी",
        contact: "संपर्क",
        login: "लॉगिन",
        dashboard: "डैशबोर्ड",
        latest_updates: "नवीनतम अपडेट",
        hall_of_fame: "हॉल ऑफ फेम: NSGI विजेता",
        quick_links: "क्विक लिंक्स",
        parent_reviews: "अभिभावकों की राय",
        footer_desc: "शिक्षा और नवाचार के माध्यम से छात्रों को सशक्त बनाना।",
        switch_lang: "अंग्रेजी में बदलें",
        chairman_heading: "अध्यक्ष का संदेश",
        chairman_quote: "शिक्षा वह हथियार है जिससे आप दुनिया को बदल सकते हैं।",
        chairman_text: "श्री जागेश्वर मेमोरियल एजुकेशनल इंस्टीट्यूट में आपका स्वागत है। हमारा संस्थान बच्चों के सर्वांगीण विकास के लिए समर्पित है। हम न केवल शैक्षणिक उत्कृष्टता पर ध्यान देते हैं, बल्कि नैतिक मूल्यों और अनुशासन को भी बढ़ावा देते हैं।",
        read_more: "अधिक पढ़ें"
    }
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key) => {
        return translations[lang][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
