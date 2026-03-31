import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useLanguage } from '../context/LanguageContext';
import './Transport.css';

const Transport = () => {
  const { language } = useLanguage();
  const [transportData, setTransportData] = useState(null);
  const [busPosition, setBusPosition] = useState(0);

  useEffect(() => {
    const data = mockApi.getTransportData();
    setTransportData(data);

    // Simulate bus movement
    const interval = setInterval(() => {
      setBusPosition(prev => (prev + 1) % 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      title: 'Transport Management',
      liveTracking: 'Live Bus Tracking',
      busNo: 'Bus Number',
      driver: 'Driver Name',
      route: 'Route Details',
      status: 'Current Status',
      nextStop: 'Next Stop',
      eta: 'Estimated Arrival',
      stops: 'Route Stops'
    },
    hi: {
      title: 'परिवहन प्रबंधन',
      liveTracking: 'लाइव बस ट्रैकिंग',
      busNo: 'बस नंबर',
      driver: 'ड्राइवर का नाम',
      route: 'रूट का विवरण',
      status: 'वर्तमान स्थिति',
      nextStop: 'अगला स्टॉप',
      eta: 'अनुमानित समय',
      stops: 'रूट के स्टॉप'
    }
  };

  const curr = language === 'hi' ? t.hi : t.en;

  if (!transportData) return <div className="loading">Loading Transport Data...</div>;

  return (
    <div className="transport-container">
      <header className="transport-header">
        <h1>{curr.title}</h1>
        <div className="live-badge">● LIVE</div>
      </header>

      <div className="transport-grid">
        {/* Bus Info Card */}
        <div className="info-card">
          <div className="card-header">
            <i className="fas fa-bus"></i>
            <h3>{transportData.busNo || 'NSGI-007'}</h3>
          </div>
          <div className="card-body">
            <div className="info-item">
              <span className="label">{curr.driver}</span>
              <span className="value">{transportData.driver || 'Rajesh Kumar'}</span>
            </div>
            <div className="info-item">
              <span className="label">{curr.status}</span>
              <span className="value status-moving">{transportData.status || 'On Route'}</span>
            </div>
            <div className="info-item">
              <span className="label">{curr.nextStop}</span>
              <span className="value">{transportData.nextStop || 'Civil Lines'}</span>
            </div>
            <div className="info-item">
              <span className="label">{curr.eta}</span>
              <span className="value highlight">{transportData.eta || '10 Mins'}</span>
            </div>
          </div>
        </div>

        {/* Map Simulation */}
        <div className="map-card">
          <h3>{curr.liveTracking}</h3>
          <div className="map-placeholder">
            <div className="road">
              <div className="bus-icon" style={{ left: `${busPosition}%` }}>
                🚌
                <div className="bus-ping"></div>
              </div>
              <div className="stop start-stop">🏫</div>
              <div className="stop mid-stop">📍</div>
              <div className="stop end-stop">🏠</div>
            </div>
            <div className="map-labels">
              <span>School</span>
              <span>Main Road</span>
              <span>Sector 15</span>
            </div>
          </div>
          <div className="map-overlay">
            <p>GPS Signal: <strong>Strong</strong></p>
            <p>Last Update: Just now</p>
          </div>
        </div>

        {/* Route Stops */}
        <div className="stops-card">
          <h3>{curr.stops}</h3>
          <ul className="stops-list">
            <li className="stop-item completed">
              <div className="stop-index">1</div>
              <div className="stop-name">School Main Gate</div>
              <div className="stop-time">07:30 AM</div>
            </li>
            <li className="stop-item active">
              <div className="stop-index">2</div>
              <div className="stop-name">Civil Lines</div>
              <div className="stop-time">07:45 AM</div>
            </li>
            <li className="stop-item">
              <div className="stop-index">3</div>
              <div className="stop-name">Model Town</div>
              <div className="stop-time">08:00 AM</div>
            </li>
            <li className="stop-item">
              <div className="stop-index">4</div>
              <div className="stop-name">Sector 15 Extension</div>
              <div className="stop-time">08:15 AM</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Transport;
