import React from 'react';
import { translations } from '../utils/translations';

const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = React.useState(localStorage.getItem('nsgi_lang') || 'en');

    React.useEffect(() => {
        localStorage.setItem('nsgi_lang', language);
        document.documentElement.setAttribute('lang', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => React.useContext(LanguageContext);
