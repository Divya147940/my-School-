import React from 'react';
import { Link } from 'react-router-dom';
import './GalleryVideo.css';

import photo1 from '../assets/gallery/photo1.png';
import photo3 from '../assets/gallery/photo3.png';
import photo4 from '../assets/gallery/photo4.png';
import photo5 from '../assets/gallery/photo5.png';
import campus1 from '../assets/gallery/campus1.png';

const galleryImages = [
    { src: photo3, alt: 'Annual Day Celebration' },
    { src: photo5, alt: 'Award Ceremony' },
];

const videoThumbs = [
    { src: photo4, alt: 'School Performance Video', title: 'Annual Function Dance' },
    { src: photo1, alt: 'School Event Video', title: 'School Trip Highlights' },
];

const GalleryVideo = () => {
    return (
        <section className="galvid-section">
            {/* Background Image */}
            <div className="galvid-bg">
                <img src={campus1} alt="School Campus" className="galvid-bg-img" />
                <div className="galvid-bg-overlay">
                    <h1 className="galvid-bg-text">SHRI JAGESHWAR MEMORIAL EDUCATIONAL INSTITUTE</h1>
                </div>
            </div>

            <div className="galvid-container">
                {/* Our Gallery */}
                <div className="galvid-block">
                    <h2 className="galvid-heading">Our Gallery</h2>
                    <div className="galvid-divider"></div>
                    <div className="galvid-cards">
                        {galleryImages.map((img, i) => (
                            <div key={i} className="galvid-card">
                                <img src={img.src} alt={img.alt} className="galvid-card-img" />
                            </div>
                        ))}
                    </div>
                    <Link to="/gallery" className="galvid-btn">View More</Link>
                </div>

                {/* Our Video */}
                <div className="galvid-block">
                    <h2 className="galvid-heading">Our Video</h2>
                    <div className="galvid-divider"></div>
                    <div className="galvid-cards">
                        {videoThumbs.map((vid, i) => (
                            <div key={i} className="galvid-card video-card">
                                <img src={vid.src} alt={vid.alt} className="galvid-card-img" />
                                <div className="play-btn-overlay">
                                    <div className="play-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <span className="video-title">{vid.title}</span>
                            </div>
                        ))}
                    </div>
                    <Link to="/gallery" className="galvid-btn">View More</Link>
                </div>
            </div>
        </section>
    );
};

export default GalleryVideo;
