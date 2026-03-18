import React, { useState } from 'react';
import { mockApi } from '../utils/mockApi';
import useScrollReveal from '../hooks/useScrollReveal';
import './GalleryPage.css';

function GalleryPage() {
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    const [galleryItems, setGalleryItems] = useState(mockApi.getGallery());
    const [activeFilter, setActiveFilter] = useState('all');
    const [lightbox, setLightbox] = useState(null);

    const filters = [
        { key: 'all', label: 'All / सभी' },
        { key: 'campus', label: 'Campus / परिसर' },
        { key: 'events', label: 'Events / कार्यक्रम' },
        { key: 'classroom', label: 'Classroom / कक्षा' },
    ];

    const filtered = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

    return (
        <div className="gal-page" ref={sectionRef}>
            <div className="gal-hero reveal-on-scroll">
                <h1>Photo Gallery</h1>
                <p>हमारे विद्यालय की झलकियाँ — Campus, Events & More</p>
            </div>

            {/* Filters */}
            <div className="gal-filters reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`gal-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="gal-grid">
                {filtered.map((item, i) => (
                    <div 
                        className="gal-card reveal-on-scroll" 
                        key={i} 
                        onClick={() => setLightbox(item)}
                        style={{ transitionDelay: `${(i % 4) * 0.1}s` }}
                    >
                        {item.type === 'video' ? (
                            <div className="gal-video-placeholder">
                                <div className="play-icon">▶</div>
                                <span>{item.title}</span>
                            </div>
                        ) : (
                            <div className="gal-img-wrapper">
                                <img src={item.url || item.src} alt={item.title} className="gal-img" />
                            </div>
                        )}
                        <div className="gal-overlay">
                            <h3>{item.title}</h3>
                            <p>{item.desc || (item.type === 'video' ? 'Video Highlights' : 'Campus Life')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div className="gal-lightbox" onClick={() => setLightbox(null)}>
                    <div className="gal-lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="gal-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                        {lightbox.type === 'video' ? (
                            <video src={lightbox.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                        ) : (
                            <img src={lightbox.url || lightbox.src} alt={lightbox.title} />
                        )}
                        <div className="gal-lightbox-info">
                            <h3>{lightbox.title}</h3>
                            <p>{lightbox.desc || 'School Activity'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryPage;
