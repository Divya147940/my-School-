import React, { useState, useRef, useEffect } from 'react';
import './VirtualTour.css';
import panoramaImg from '../assets/campus-360.png';

const VirtualTour = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Library');
  const viewerRef = useRef(null);

  const locations = ['Library', 'Main Hall', 'Science Lab', 'Sports Ground'];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - viewerRef.current.offsetLeft);
    setScrollLeft(viewerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Increase speed
    viewerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="virtual-tour-container">
      <div className="tour-header">
        <h1>360° Campus Virtual Tour</h1>
        <p>Step inside and experience our state-of-the-art infrastructure</p>
      </div>

      <div className="location-switcher">
        {locations.map(loc => (
          <button 
            key={loc} 
            className={`location-btn ${currentLocation === loc ? 'active' : ''}`}
            onClick={() => setCurrentLocation(loc)}
          >
            {loc}
          </button>
        ))}
      </div>

      <div 
        className="panorama-viewer"
        ref={viewerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="panorama-image">
          {/* We duplicate the image to create a seamless feel for the scroll */}
          <img src={panoramaImg} alt={`View of ${currentLocation}`} />
          <img src={panoramaImg} alt={`View of ${currentLocation}`} />
        </div>
      </div>

      <div className="tour-controls">
        <div className="control-hint">
          <span>🖱️</span> Drag to look around
        </div>
        <div className="control-hint">
          <span>📱</span> Swipe on touch devices
        </div>
      </div>

      <div className="tour-footer-info">
        <h3>Currently Viewing: {currentLocation}</h3>
        <p>This room features smart whiteboards, a digital cataloging system, and individual study carrels designed for focused learning.</p>
      </div>
    </div>
  );
};

export default VirtualTour;
