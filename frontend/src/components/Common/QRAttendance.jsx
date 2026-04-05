import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { useToast } from '../Common/Toaster';
import './QRAttendance.css';

const QRAttendance = ({ user: propUser }) => {
    const { secureApi, user: authUser } = useAuth();
    const { addToast } = useToast();
    const activeUser = authUser || propUser;
    const [status, setStatus] = useState('Idle'); // Idle, Biometric, Scanning, Success, Error
    const [message, setMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendanceLog, setAttendanceLog] = useState(null);
    const [settings, setSettings] = useState(mockApi.getQRSettings());
    const [currentSignature, setCurrentSignature] = useState(mockApi.generateQRSignature());
    const [biometricProgress, setBiometricProgress] = useState(0);
    
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    const fetchTodayAttendance = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await secureApi(`${API_URL}/api/faculty/attendance?faculty_id=${activeUser.id}&date=${today}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    const latest = data[0];
                    setAttendanceLog({
                        complete: latest.status === 'Present',
                        morning: latest.morning_time,
                        evening: latest.evening_time
                    });
                } else {
                    setAttendanceLog(null);
                }
            }
        } catch(e) {
            console.error("Failed to fetch today's attendance", e);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            // Refresh signature every 10s to ensure user always has a fresh one before scanning
            setCurrentSignature(mockApi.generateQRSignature());
        }, 10000);

        if (activeUser?.id) {
            fetchTodayAttendance();
        }
        
        return () => clearInterval(timer);
    }, [activeUser]);

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

    const startBiometric = async () => {
        // Step 0: Check Device DNA
        const currentDna = mockApi.getDeviceDNA();
        if (!mockApi.isDeviceAuthorized(activeUser.id, currentDna)) {
            setStatus('Error');
            setMessage('UNAUTHORIZED DEVICE: Attendance must be marked from your registered phone.');
            mockApi.logAudit('SECURITY_ALERT', `Unauthorized device attempt for attendance by ${activeUser.name}`, activeUser.role, { dna: currentDna });
            return;
        }

        setStatus('Biometric');
        setMessage('Align face for Identity Verification...');
        setBiometricProgress(0);

        setTimeout(async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                setStatus('Error');
                setMessage('Camera access denied. Biometrics required for attendance.');
            }
        }, 100);
    };

    useEffect(() => {
        let bioInterval;
        if (status === 'Biometric' && videoRef.current) {
            bioInterval = setInterval(async () => {
                if (videoRef.current && canvasRef.current) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 480;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');

                    try {
                        const detection = await mockApi.getFaceDescriptorFromBase64(dataUrl);
                        if (detection) {
                            setBiometricProgress(prev => Math.min(100, prev + 25));
                            if (biometricProgress >= 100) {
                                // Close Camera
                                if (video.srcObject) video.srcObject.getTracks().forEach(t => t.stop());
                                handleScan(); // Proceed to GPS/QR Check
                            }
                        } else {
                            setBiometricProgress(prev => Math.max(0, prev - 10));
                            // Periodic log for persistent failure
                            if (biometricProgress === 0 && Math.random() > 0.9) {
                                mockApi.logAudit('BIOMETRIC_FAIL', `Unrecognised face or biometric mismatch.`, activeUser.role, { userId: activeUser.id });
                            }
                        }
                    } catch (e) { console.warn("Bio-scan error:", e); }
                }
            }, 500);
        }
        return () => clearInterval(bioInterval);
    }, [status, biometricProgress]);

    const handleScan = () => {
        setStatus('Scanning');
        setMessage('Verifying Location & Signature...');

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
                    mockApi.logAudit('SECURITY_LOCATION_FAIL', `Out-of-range scan attempt. Dist: ${Math.round(dist)}m`, activeUser.role, { distance: dist, threshold: settings.rangeMeter });
                    return;
                }

                // PHASE 5: AI GPS Clone Detection (Anti-Spoofing)
                const gpsResult = mockApi.checkGpsSecurity({ lat: latitude, lng: longitude });
                if (gpsResult.status === 'WARP_DETECTED') {
                    setStatus('Error');
                    setMessage(`❌ SECURITY ALERT: GPS Anomaly (Warp) detected! Attempt flagged for forensic review.`);
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

                // Log Attendance dynamically to Real Backend
                secureApi(`${API_URL}/api/faculty/attendance`, {
                    method: 'POST',
                    body: JSON.stringify({
                        faculty_id: activeUser.id,
                        type,
                        time: timeStr
                    })
                }).then(async (res) => {
                    if (res.ok) {
                        setStatus('Success');
                        setMessage(`${type === 'morning' ? 'Check-in' : 'Check-out'} Successful!`);
                        fetchTodayAttendance();
                        addToast(`Marked ${type === 'morning' ? 'Check-in' : 'Check-out'} at ${timeStr}`, "success");
                    } else {
                        const errData = await res.json();
                        throw new Error(errData.message || 'Failed to sync with server');
                    }
                }).catch(err => {
                    setStatus('Error');
                    setMessage('Database Sync Error: ' + err.message);
                }).finally(() => {
                    setTimeout(() => setStatus('Idle'), 3000);
                });
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

            {status === 'Biometric' && (
                <div className="biometric-scanner-window">
                    <video ref={videoRef} autoPlay playsInline muted />
                    <div className="bio-overlay">
                        <div className="bio-ring" style={{ borderColor: biometricProgress > 80 ? '#10b981' : '#3b82f6' }}></div>
                        <div className="bio-progress-bar">
                            <div className="bio-fill" style={{ width: `${biometricProgress}%` }}></div>
                        </div>
                        <p>IDENTITY VERIFICATION: {biometricProgress}%</p>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <button 
                className={`scan-btn ${['Scanning', 'Biometric'].includes(status) ? 'disabled' : ''}`}
                onClick={status === 'Idle' ? startBiometric : handleScan}
                disabled={['Scanning', 'Biometric'].includes(status)}
            >
                {status === 'Scanning' ? 'Verifying...' : 
                 status === 'Biometric' ? 'Verifying Identity...' : 
                 'Scan School QR Code'}
            </button>

            <div className="range-hint">
                📍 Range Required: Within {settings.rangeMeter}m of School
            </div>
        </div>
    );
};

export default QRAttendance;
