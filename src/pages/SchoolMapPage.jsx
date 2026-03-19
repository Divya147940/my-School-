import React, { useState } from 'react';
import './SchoolMapPage.css';
import campusMap from '../assets/campus-map.png';

const SchoolMapPage = () => {
  const [selectedZone, setSelectedZone] = useState(null);

  const zones = [
    { id: 'admin', name: 'Main Academic Block', description: 'Houses administration offices, principal room, and primary classrooms for grades 1-10.', icon: '🏫', class: 'zone-admin' },
    { id: 'library', name: 'Central Library', description: 'A vast collection of over 20,000 books, digital archives, and quiet study zones.', icon: '📚', class: 'zone-library' },
    { id: 'science', name: 'Science & Tech Labs', description: 'State-of-the-art Physics, Chemistry, and Biology labs with advanced equipment.', icon: '🔬', class: 'zone-science' },
    { id: 'sports', name: 'Sports Complex', description: 'Includes a professional running track, football pitch, and indoor basketball court.', icon: '⚽', class: 'zone-sports' },
    { id: 'canteen', name: 'Healthy Bited Cafeteria', description: 'Serving nutritious and hygienic meals with a seating capacity of 300 students.', icon: '🍕', class: 'zone-canteen' },
    { id: 'art', name: 'Creative Arts Studio', description: 'Space for music, painting, and dance with professional instructors.', icon: '🎨', class: 'zone-art' },
  ];

  return (
    <div className="school-map-container">
      <div className="school-map-header">
        <h1>Interactive Campus Map</h1>
        <p>Explore our world-class facilities and infrastructure</p>
      </div>

      <div className="map-wrapper">
        <img src={campusMap} alt="School Campus Map" className="map-image" />
        
        <div className="map-overlay">
          {zones.map((zone) => (
            <div 
              key={zone.id} 
              className={`map-zone ${zone.class}`}
              onClick={() => setSelectedZone(zone)}
              title={zone.name}
            >
              <span className="zone-label">{zone.icon} {zone.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="map-details">
        {selectedZone ? (
          <div className="detail-card selected" style={{ borderLeftColor: '#2563eb', borderLeftWidth: '8px' }}>
            <h3>{selectedZone.icon} {selectedZone.name}</h3>
            <p>{selectedZone.description}</p>
            <p style={{ marginTop: '10px', fontSize: '0.85rem', fontStyle: 'italic', color: '#3b82f6' }}>*Click on other areas to explore more</p>
          </div>
        ) : (
          <div className="detail-card">
            <h3>📍 Explorer Mode</h3>
            <p>Click on any highlighted area on the map above to see detailed information about our campus facilities.</p>
          </div>
        )}

        <div className="detail-card">
          <h3>🕒 Visiting Hours</h3>
          <p>The campus is open for visits from Monday to Friday, 9:00 AM - 4:00 PM. Please book an appointment via our contact page.</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolMapPage;
