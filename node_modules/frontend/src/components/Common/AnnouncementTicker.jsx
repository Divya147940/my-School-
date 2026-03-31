import React, { useState, useEffect } from 'react';
import './AnnouncementTicker.css';

const AnnouncementTicker = () => {
    // In a real app, this would be fetched from the mockApi/DB
    const [news, setNews] = useState("🚀 ADMISSIONS OPEN 2026-27 | 🏆 NSGI RANKED #1 IN INNOVATION | 📅 ANNUAL CONCERT ON 25TH MARCH | 🚌 NEW BUS ROUTES ADDED FOR SECTOR 15");
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="ticker-wrapper">
            <div className="ticker-label">LATEST UPDATES</div>
            <div className="ticker-content">
                <div className="ticker-scroll">
                    <span>{news}</span>
                    <span>{news}</span> {/* Duplicate for seamless loop */}
                </div>
            </div>
            <button className="ticker-close" onClick={() => setIsVisible(false)}>&times;</button>
        </div>
    );
};

export default AnnouncementTicker;
