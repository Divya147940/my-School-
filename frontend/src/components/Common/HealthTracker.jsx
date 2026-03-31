import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import './HealthTracker.css';

const HealthTracker = () => {
    const { user } = useAuth();
    const [healthData, setHealthData] = useState(null);

    useEffect(() => {
        if (user?.id) {
            const data = mockApi.getHealthRecord(user.id);
            setHealthData(data);
        }
    }, [user]);

    if (!healthData) return <div className="health-container">Loading health records...</div>;

    return (
        <div className="health-container">
            <header className="health-header">
                <h2>🏥 Student Health Record</h2>
                <div className="health-status-badge">System Synced: {user?.name}</div>
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
                        {healthData.vaccinations.length > 0 ? healthData.vaccinations.map((v, i) => (
                            <div className="vaccine-item" key={i}>
                                <div className="v-info">
                                    <p className="v-name">{v.name}</p>
                                    <p className="v-type">{v.type}</p>
                                </div>
                                <span className="v-status">{v.date}</span>
                            </div>
                        )) : <p style={{ opacity: 0.5 }}>No vaccination records available.</p>}
                    </div>
                </div>

                <div className="health-section">
                    <h3>⚠️ Medical Alerts</h3>
                    <div className="alerts-box">
                        <label>Allergies</label>
                        <div className="tag-cloud">
                            {healthData.allergies.length > 0 ? healthData.allergies.map(a => <span className="alert-tag" key={a}>{a}</span>) : <span>No known allergies.</span>}
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
