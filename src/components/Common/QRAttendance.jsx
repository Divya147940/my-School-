import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import './QRAttendance.css';

const QRAttendance = ({ user }) => {
    const [status, setStatus] = useState('Idle'); // Idle, Scanning, Success, Error
    const [message, setMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceLog, setAttendanceLog] = useState(null);
    const [settings, setSettings] = useState(mockApi.getQRSettings());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const logs = mockApi.getQRAttendance(user.name);
        const today = new Date().toISOString().split('T')[0];
        const todayLog = logs.find(l => l.date === today);
        if (todayLog) setAttendanceLog(todayLog);
        
        return () => clearInterval(timer);
    }, [user.name]);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // in metres
    };

    const handleScan = () => {
        setStatus('Scanning');
        setMessage('Verifying Location...');

        if (!navigator.geolocation) {
            setStatus('Error');
            setMessage('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const dist = calculateDistance(
                    latitude, longitude,
                    settings.schoolLocation.lat, settings.schoolLocation.lng
                );

                if (dist > settings.rangeMeter) {
                    setStatus('Error');
                    setMessage(`Out of Range! You are ${Math.round(dist)}m away. Range: ${settings.rangeMeter}m.`);
                    return;
                }

                // Check Time Window
                const now = new Date();
                const timeStr = now.toTimeString().slice(0, 5);
                
                let type = '';
                if (timeStr >= settings.morning.start && timeStr <= settings.morning.end) {
                    type = 'morning';
                } else if (timeStr >= settings.evening.start && timeStr <= settings.evening.end) {
                    type = 'evening';
                } else {
                    setStatus('Error');
                    setMessage(`Outside active hours. Morning: ${settings.morning.start}-${settings.morning.end}, Evening: ${settings.evening.start}-${settings.evening.end}`);
                    return;
                }

                // Log Attendance
                const updatedLog = mockApi.logQRAttendance({
                    name: user.name,
                    role: user.role,
                    type,
                    time: timeStr
                });

                setAttendanceLog(updatedLog);
                setStatus('Success');
                setMessage(`${type === 'morning' ? 'Check-in' : 'Check-out'} Successful!`);
                
                setTimeout(() => setStatus('Idle'), 3000);
            },
            (error) => {
                setStatus('Error');
                setMessage('Could not get your location. Please enable GPS.');
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="qr-attendance-container">
            <div className="attendance-header">
                <div className="live-clock">
                    <h2>{currentTime.toLocaleTimeString()}</h2>
                    <p>{currentTime.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="qr-status-display">
                <div className={`status-icon-circle ${status.toLowerCase()}`}>
                    {status === 'Idle' && <span className="icon">🤳</span>}
                    {status === 'Scanning' && <div className="spinner"></div>}
                    {status === 'Success' && <span className="icon">✅</span>}
                    {status === 'Error' && <span className="icon">❌</span>}
                </div>
                <h3>{status === 'Idle' ? 'Scan to Mark Attendance' : status}</h3>
                <p className="status-message">{message}</p>
            </div>

            <div className="attendance-logic-grid">
                <div className={`logic-card ${attendanceLog?.morning ? 'complete' : ''}`}>
                    <span className="phase">Morning Check-in</span>
                    <span className="time-window">{settings.morning.start} - {settings.morning.end}</span>
                    <div className="status-tag">
                        {attendanceLog?.morning ? `Done at ${attendanceLog.morning}` : 'Pending'}
                    </div>
                </div>
                <div className={`logic-card ${attendanceLog?.evening ? 'complete' : ''}`}>
                    <span className="phase">Evening Check-out</span>
                    <span className="time-window">{settings.evening.start} - {settings.evening.end}</span>
                    <div className="status-tag">
                        {attendanceLog?.evening ? `Done at ${attendanceLog.evening}` : 'Pending'}
                    </div>
                </div>
            </div>

            <div className={`overall-status ${attendanceLog?.complete ? 'all-done' : ''}`}>
                {attendanceLog?.complete ? '🏆 Full Day Attendance Completed' : '⌛ Complete both tasks for full credit'}
            </div>

            <button 
                className={`scan-btn ${status === 'Scanning' ? 'disabled' : ''}`}
                onClick={handleScan}
                disabled={status === 'Scanning'}
            >
                {status === 'Scanning' ? 'Verifying...' : 'Scan School QR Code'}
            </button>

            <div className="range-hint">
                📍 Range Required: Within {settings.rangeMeter}m of School
            </div>
        </div>
    );
};

export default QRAttendance;
