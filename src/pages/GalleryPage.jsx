import React, { useState } from 'react';
import './GalleryPage.css';
import photo1 from '../assets/gallery/photo1.png';
import photo2 from '../assets/gallery/photo2.png';
import photo3 from '../assets/gallery/photo3.png';
import photo4 from '../assets/gallery/photo4.png';
import photo5 from '../assets/gallery/photo5.png';
import campus1 from '../assets/gallery/campus1.png';

function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [lightbox, setLightbox] = useState(null);

    const galleryItems = [
        { src: campus1, category: 'campus', title: 'विद्यालय परिसर', desc: 'Our School Campus' },
        { src: photo1, category: 'events', title: 'वार्षिक उत्सव', desc: 'Annual Function' },
        { src: photo2, category: 'events', title: 'सांस्कृतिक कार्यक्रम', desc: 'Cultural Program' },
        { src: photo3, category: 'classroom', title: 'कक्षा में शिक्षण', desc: 'Classroom Teaching' },
        { src: photo4, category: 'events', title: 'पुरस्कार वितरण', desc: 'Prize Distribution' },
        { src: photo5, category: 'campus', title: 'परिसर का दृश्य', desc: 'Campus View' },
    ];

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
        <div className="gal-page">
            <div className="gal-hero">
                <h1>Photo Gallery</h1>
                <p>हमारे विद्यालय की झलकियाँ — Campus, Events & More</p>
            </div>

            {/* Filters */}
            <div className="gal-filters">
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
                    <div className="gal-card" key={i} onClick={() => setLightbox(item)}>
                        <img src={item.src} alt={item.title} className="gal-img" />
                        <div className="gal-overlay">
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div className="gal-lightbox" onClick={() => setLightbox(null)}>
                    <div className="gal-lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="gal-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                        <img src={lightbox.src} alt={lightbox.title} />
                        <div className="gal-lightbox-info">
                            <h3>{lightbox.title}</h3>
                            <p>{lightbox.desc}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryPage;
