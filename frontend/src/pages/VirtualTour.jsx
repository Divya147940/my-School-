import React, { useState, useRef, useEffect } from 'react';
import './VirtualTour.css';
import { useLanguage } from '../context/LanguageContext';
import panoramaImg from '../assets/campus-360.png';

const VirtualTour = () => {
    const { language } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [currentLocation, setCurrentLocation] = useState('Library');
    const viewerRef = useRef(null);

    const locations = [
        { id: 'Library', name: 'Library', hi: 'पुस्तकालय', desc: 'A haven for knowledge with 10k+ books and digital access.', hi_desc: '10k+ पुस्तकों और डिजिटल पहुंच के साथ ज्ञान का स्वर्ग।' },
        { id: 'Hall', name: 'Main Hall', hi: 'मुख्य हॉल', desc: 'Grand auditorium for cultural events and assemblies.', hi_desc: 'सांस्कृतिक कार्यक्रमों और सभाओं के लिए भव्य सभागार।' },
        { id: 'Lab', name: 'Science Lab', hi: 'विज्ञान प्रयोगशाला', desc: 'Equipped with modern apparatus for hands-on learning.', hi_desc: 'सीखने के लिए आधुनिक उपकरणों से सुसज्जित।' },
        { id: 'Sports', name: 'Sports Ground', hi: 'खेल का मैदान', desc: 'Vast outdoor area for athletics and team sports.', hi_desc: 'एथलेटिक्स और टीम खेलों के लिए विशाल बाहरी क्षेत्र।' }
    ];

    const currentLocData = locations.find(l => l.name === currentLocation) || locations[0];

    // Auto-panning effect
    useEffect(() => {
        let interval;
        if (!isDragging) {
            interval = setInterval(() => {
                if (viewerRef.current) {
                    viewerRef.current.scrollLeft += 1;
                    if (viewerRef.current.scrollLeft >= viewerRef.current.scrollWidth / 2) {
                        viewerRef.current.scrollLeft = 0;
                    }
                }
            }, 30);
        }
        return () => clearInterval(interval);
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - viewerRef.current.offsetLeft);
        setScrollLeft(viewerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - viewerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        viewerRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="virtual-tour-hero">
            <div className="tour-overlay-content">
                <h1 className="cinematic-title">
                    {language === 'hi' ? 'कैंपस का आभासी दौरा' : 'Virtual Campus Tour'}
                </h1>
                <p className="cinematic-subtitle">
                    {language === 'hi' ? 'हमारे विश्व स्तरीय बुनियादी ढांचे का अनुभव करें' : 'Experience our world-class infrastructure from anywhere'}
                </p>
                
                <div className="location-nav-premium">
                    {locations.map(loc => (
                        <button 
                            key={loc.id} 
                            className={`loc-pill ${currentLocation === loc.name ? 'active' : ''}`}
                            onClick={() => setCurrentLocation(loc.name)}
                        >
                            {language === 'hi' ? loc.hi : loc.name}
                        </button>
                    ))}
                </div>
            </div>

            <div 
                className="immersive-viewer"
                ref={viewerRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="panorama-strip">
                    <img src={panoramaImg} alt="Campus view" className="pano-img" />
                    <img src={panoramaImg} alt="Campus view" className="pano-img" />
                </div>
            </div>

            <div className="tour-info-card glass-panel">
                <div className="info-badge">LIVE 360</div>
                <h3>{language === 'hi' ? currentLocData.hi : currentLocData.name}</h3>
                <p>{language === 'hi' ? currentLocData.hi_desc : currentLocData.desc}</p>
                <div className="interaction-hint">
                    <span className="mouse-icon">🖱️</span> {language === 'hi' ? 'चारों ओर देखने के लिए ड्रैग करें' : 'Drag to look around'}
                </div>
            </div>
        </div>
    );
};

export default VirtualTour;
