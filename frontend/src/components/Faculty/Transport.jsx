import React from 'react';

const Transport = () => {
  return (
    <div className="transport-module">
      <div style={{ background: '#1e293b', borderRadius: '20px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
        <div style={{ marginBottom: '20px', fontSize: '3rem' }}>🚌</div>
        <h3>Live Bus Tracking (Simulation)</h3>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Tracking active routes for Session 2024-25</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Route 1: Salon - Tiloi</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Driver: Rajesh Kumar | Phone: +91 98765 43210</div>
            </div>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>• On Route</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Route 2: Amethi - Jais</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Driver: Sunil Singh | Phone: +91 98765 43211</div>
            </div>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>• At School</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;
