import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useTheme } from '../../context/ThemeContext';
import './BusTracker.css';

const BusTracker = () => {
    const { theme } = useTheme();
    const [busData, setBusData] = useState(null);

    useEffect(() => {
        setBusData(mockApi.getTransportData());
        
        // Simulate live movement
        const interval = setInterval(() => {
            setBusData(prev => ({
                ...prev,
                lat: prev.lat + 0.0001,
                lng: prev.lng + 0.0001
            }));
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    if (!busData) return <div className="loading">Loading Tracker...</div>;

    return (
        <div className={`bus-tracker-container ${theme === 'light' ? 'light-mode' : ''}`}>
            <div className="tracker-header">
                <h2 className="section-title">🚌 NSGI Smart Bus Tracker</h2>
                <div className="status-pill moving">LIVE: {busData.status}</div>
            </div>

            <div className="tracker-main">
                <div className="map-view glass-panel">
                    {/* Simulated Map */}
                    <div className="map-grid">
                        <div className="map-bus" style={{ bottom: '40%', left: '45%' }}>
                            <div className="bus-icon">🚌</div>
                            <div className="bus-label">NSGI BUS-04</div>
                        </div>
                        {busData.stops.map((stop, idx) => (
                            <div key={stop.id} className={`map-stop ${stop.completed ? 'completed' : ''}`} style={{ bottom: `${20 + idx * 25}%`, left: `${20 + idx * 20}%` }}>
                                <div className="stop-marker">📍</div>
                                <div className="stop-name">{stop.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="tracking-details">
                    <div className="eta-card glass-panel shadow-glow">
                        <h3>Estimated Arrival</h3>
                        <div className="eta-time">{busData.eta}</div>
                        <p>Next Stop: <strong>{busData.nextStop}</strong></p>
                    </div>

                    <div className="stops-timeline feature-box glass-panel">
                        <h3>Route Timeline</h3>
                        <div className="timeline">
                            {busData.stops.map(stop => (
                                <div key={stop.id} className={`timeline-item ${stop.completed ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <h4>{stop.name}</h4>
                                        <p>{stop.completed ? 'Bus Departed' : 'Expected'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button className="notify-arrival-btn">Notify Me on Arrival 🔔</button>
                </div>
            </div>
        </div>
    );
};

export default BusTracker;
