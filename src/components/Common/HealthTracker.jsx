import React from 'react';
import './HealthTracker.css';

const HealthTracker = () => {
    const healthData = {
        bloodGroup: 'B+',
        height: '142 cm',
        weight: '38 kg',
        vaccinations: [
            { name: 'BCG', date: 'Done', type: 'Mandatory' },
            { name: 'Hepatitis B', date: 'Done', type: 'Mandatory' },
            { name: 'Covid-19', date: 'March 2022', type: 'Special' }
        ],
        allergies: ['Dust', 'Peanuts'],
        emergencyContact: {
            name: 'Mr. Gupta (Father)',
            phone: '+91 98765 43210'
        }
    };

    return (
        <div className="health-container">
            <header className="health-header">
                <h2>🏥 Student Health Record</h2>
                <div className="health-status-badge">Updated: March 2026</div>
            </header>

            <div className="health-summary-grid">
                <div className="h-card">
                    <label>Blood Group</label>
                    <p className="val">{healthData.bloodGroup}</p>
                </div>
                <div className="h-card">
                    <label>Height</label>
                    <p className="val">{healthData.height}</p>
                </div>
                <div className="h-card">
                    <label>Weight</label>
                    <p className="val">{healthData.weight}</p>
                </div>
            </div>

            <div className="health-details-layout">
                <div className="health-section">
                    <h3>🛡️ Vaccinations</h3>
                    <div className="vaccine-list">
                        {healthData.vaccinations.map((v, i) => (
                            <div className="vaccine-item" key={i}>
                                <div className="v-info">
                                    <p className="v-name">{v.name}</p>
                                    <p className="v-type">{v.type}</p>
                                </div>
                                <span className="v-status">{v.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="health-section">
                    <h3>⚠️ Medical Alerts</h3>
                    <div className="alerts-box">
                        <label>Allergies</label>
                        <div className="tag-cloud">
                            {healthData.allergies.map(a => <span className="alert-tag" key={a}>{a}</span>)}
                        </div>
                    </div>
                    <div className="emergency-box">
                        <label>Emergency Contact</label>
                        <p className="e-name">{healthData.emergencyContact.name}</p>
                        <p className="e-phone">{healthData.emergencyContact.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthTracker;
