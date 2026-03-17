import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const AttendanceControl = () => {
    const [settings, setSettings] = useState(mockApi.getQRSettings());
    const [logs, setLogs] = useState(mockApi.getQRAttendance());
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        mockApi.updateQRSettings(settings);
        setIsEditing(false);
        alert('Attendance Settings Updated!');
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((pos) => {
            setSettings({
                ...settings,
                schoolLocation: { 
                    lat: parseFloat(pos.coords.latitude.toFixed(6)), 
                    lng: parseFloat(pos.coords.longitude.toFixed(6)) 
                }
            });
        });
    };

    return (
        <div className="attendance-control" style={{ color: '#fff' }}>
            <div className="settings-panel card-bg" style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Terminal Settings (QR Geofence)</h3>
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        style={{ padding: '8px 20px', background: isEditing ? '#10b981' : '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                    >
                        {isEditing ? 'Save Settings' : 'Edit Settings'}
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>School GPS Location</label>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <input 
                                type="number" 
                                value={settings.schoolLocation.lat} 
                                disabled={!isEditing}
                                onChange={e => setSettings({...settings, schoolLocation: {...settings.schoolLocation, lat: parseFloat(e.target.value)}})}
                                style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}
                            />
                            <input 
                                type="number" 
                                value={settings.schoolLocation.lng} 
                                disabled={!isEditing}
                                onChange={e => setSettings({...settings, schoolLocation: {...settings.schoolLocation, lng: parseFloat(e.target.value)}})}
                                style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}
                            />
                        </div>
                        {isEditing && (
                            <button 
                                onClick={getCurrentLocation}
                                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px dashed #334155', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                🎯 Use My Current Location
                            </button>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>Range & Threshold</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="number" 
                                value={settings.rangeMeter} 
                                disabled={!isEditing}
                                onChange={e => setSettings({...settings, rangeMeter: parseInt(e.target.value)})}
                                style={{ width: '100px', padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }}
                            />
                            <span>Meters (Recommended: 10-20m)</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>Morning Slot (Check-in)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="time" value={settings.morning.start} disabled={!isEditing} onChange={e => setSettings({...settings, morning: {...settings.morning, start: e.target.value}})} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                            <input type="time" value={settings.morning.end} disabled={!isEditing} onChange={e => setSettings({...settings, morning: {...settings.morning, end: e.target.value}})} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8' }}>Evening Slot (Check-out)</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="time" value={settings.evening.start} disabled={!isEditing} onChange={e => setSettings({...settings, evening: {...settings.evening, start: e.target.value}})} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                            <input type="time" value={settings.evening.end} disabled={!isEditing} onChange={e => setSettings({...settings, evening: {...settings.evening, end: e.target.value}})} style={{ flex: 1, padding: '10px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '8px' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="attendance-logs">
                <h3 style={{ marginBottom: '20px' }}>Live Attendance Feed (Today)</h3>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Role</th>
                                <th style={{ padding: '15px' }}>Morning</th>
                                <th style={{ padding: '15px' }}>Evening</th>
                                <th style={{ padding: '15px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? logs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '15px' }}>{log.name}</td>
                                    <td style={{ padding: '15px' }}>{log.role}</td>
                                    <td style={{ padding: '15px' }}>{log.morning || '--'}</td>
                                    <td style={{ padding: '15px' }}>{log.evening || '--'}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '0.8rem',
                                            background: log.complete ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                            color: log.complete ? '#10b981' : '#f59e0b'
                                        }}>
                                            {log.complete ? 'Completed' : 'Partial'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No logs for today yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceControl;
