import React, { useState, useEffect } from 'react';
import './BusTracking.css';

const BusTracking = () => {
    const [busPos, setBusPos] = useState(0);
    const [status, setStatus] = useState({
        busNo: 'NSGI-007',
        driver: 'Rajesh Kumar',
        currentStop: 'Main Gate',
        nextStop: 'Civil Lines',
        eta: '8 Mins'
    });

    const stops = ['Main Gate', 'City Square', 'Civil Lines', 'Pine Enclave', 'School Campus'];

    useEffect(() => {
        const interval = setInterval(() => {
            setBusPos(prev => (prev >= 100 ? 0 : prev + 1));
        }, 200);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Simple logic to change stops based on position
        const stopIndex = Math.floor((busPos / 100) * stops.length);
        const current = stops[stopIndex % stops.length];
        const next = stops[(stopIndex + 1) % stops.length];
        const etaVal = Math.max(1, 15 - Math.floor((busPos % 25) * 0.6));
        
        setStatus(prev => ({
            ...prev,
            currentStop: current,
            nextStop: next,
            eta: `${etaVal} Mins`
        }));
    }, [busPos]);

    return (
        <div className="bus-tracking-container">
            <header className="tracking-header">
                <h2>🚌 Smart Bus Tracking</h2>
                <div className="bus-status-badge">Live: On Route</div>
            </header>

            <div className="map-simulation">
                <div className="route-line"></div>
                {stops.map((stop, idx) => (
                    <div key={stop} className="map-stop" style={{ left: `${(idx / (stops.length - 1)) * 100}%` }}>
                        <div className="stop-marker"></div>
                        <span className="stop-name">{stop}</span>
                    </div>
                ))}
                <div className="bus-marker" style={{ left: `${busPos}%` }}>
                    🚌
                    <div className="bus-glow"></div>
                </div>
            </div>

            <div className="tracking-grid">
                <div className="track-card">
                    <label>Bus Number</label>
                    <p>{status.busNo}</p>
                </div>
                <div className="track-card">
                    <label>Driver</label>
                    <p>{status.driver}</p>
                </div>
                <div className="track-card">
                    <label>Current Stop</label>
                    <p className="highlight">{status.currentStop}</p>
                </div>
                <div className="track-card">
                    <label>Next Stop</label>
                    <p className="highlight">{status.nextStop}</p>
                </div>
                <div className="track-card eta-card">
                    <label>ETA to Store</label>
                    <div className="eta-circle">
                        <span>{status.eta}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusTracking;
