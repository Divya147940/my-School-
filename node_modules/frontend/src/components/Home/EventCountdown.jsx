import React, { useState, useEffect } from 'react';
import './EventCountdown.css';
import { useLanguage } from '../../context/LanguageContext';

const EventCountdown = () => {
    const { language } = useLanguage();
    
    // Target Date: Annual Function 2025
    const targetDate = new Date('2025-04-15T09:00:00').getTime();
    
    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                clearInterval(timer);
            } else {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="event-countdown-wrapper glass-panel">
            <div className="event-info">
                <span className="event-tag">{language === 'hi' ? 'आगामी उत्सव' : 'UPCOMING EVENT'}</span>
                <h2 className="event-title">
                    {language === 'hi' ? 'वार्षिक उत्सव 2025' : 'ANNUAL FUNCTION 2025'}
                </h2>
                <p className="event-desc">
                    {language === 'hi' ? 'सांस्कृतिक कार्यक्रमों और पुरस्कार वितरण की एक भव्य शाम।' : 'A grand evening of cultural performances and award distributions.'}
                </p>
                <div className="event-actions">
                    <button className="sync-btn">📅 {language === 'hi' ? 'कैलेंडर में जोड़ें' : 'Sync to Calendar'}</button>
                </div>
            </div>
            
            <div className="timer-container">
                <div className="timer-unit">
                    <span className="unit-value">{timeLeft.days}</span>
                    <span className="unit-label">{language === 'hi' ? 'दिन' : 'DAYS'}</span>
                </div>
                <div className="timer-divider">:</div>
                <div className="timer-unit">
                    <span className="unit-value">{timeLeft.hours}</span>
                    <span className="unit-label">{language === 'hi' ? 'घंटे' : 'HOURS'}</span>
                </div>
                <div className="timer-divider">:</div>
                <div className="timer-unit">
                    <span className="unit-value">{timeLeft.minutes}</span>
                    <span className="unit-label">{language === 'hi' ? 'मिनट' : 'MINS'}</span>
                </div>
                <div className="timer-divider">:</div>
                <div className="timer-unit highlight">
                    <span className="unit-value">{timeLeft.seconds}</span>
                    <span className="unit-label">{language === 'hi' ? 'सेकंड' : 'SECS'}</span>
                </div>
            </div>
        </div>
    );
};

export default EventCountdown;
