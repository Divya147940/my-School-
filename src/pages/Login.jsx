import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { mockApi } from '../utils/mockApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Common/Toaster';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import { getDeviceFingerprint } from '../utils/securityUtils';
import { API_URL } from '../config';
import './Login.css';

const portals = [
  {
    type: 'Student',
    icon: '🎓',
    title: 'Student Portal',
    description: 'Access your classes, assignments, and results.',
    path: '/student-dashboard',
    color: 'var(--accent-blue)'
  },
  {
    type: 'Parent',
    icon: '👨‍👩‍👧',
    title: 'Parent Portal',
    description: "Monitor your child's progress, fees, and updates.",
    path: '/parent-dashboard',
    color: 'var(--accent-purple)'
  },
  {
    type: 'Faculty',
    icon: '👨‍🏫',
    title: 'Faculty Portal',
    description: 'Manage classes, student records, and schedules.',
    path: '/faculty-dashboard',
    color: 'var(--accent-blue)'
  },
  {
    type: 'Admin',
    icon: '🔐',
    title: 'Admin Portal',
    description: 'Full system control and management tools.',
    path: '/admin-dashboard',
    color: 'var(--accent-purple)'
  },
  {
    type: 'Emergency',
    icon: '🚑',
    title: 'Emergency Portal',
    description: 'Access student bio data and emergency contacts.',
    path: '/emergency-portal',
    color: '#ef4444'
  }
];

const Login = () => {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const sectionRef = useScrollReveal({ threshold: 0.1 });
  const [showRecover, setShowRecover] = useState(false);
  const [contactInfo, setContactInfo] = useState('');
  const [recoveredUser, setRecoveredUser] = useState(null);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Automatic redirect disabled as per user request to show all portal options
  /*
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const portal = portals.find(p => p.type.toLowerCase() === user.role.toLowerCase());
      if (portal) navigate(portal.path);
    }
  }, [isAuthenticated, user, navigate]);
  */

  const handleRecover = () => {
    setError('');
    
    // Validation
    const trimmedContact = contactInfo.trim();
    if (!trimmedContact) {
      setError(language === 'hi' ? 'कृपया जानकारी दर्ज करें' : 'Please enter contact info');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(trimmedContact) && !phoneRegex.test(trimmedContact)) {
      setError(language === 'hi' ? 'मान्य ईमेल या 10-अंकों का नंबर दर्ज करें' : 'Enter valid email or 10-digit number');
      return;
    }

    const user = mockApi.recoverId(trimmedContact);
    if (user) {
      setRecoveredUser(user);
    } else {
      setError(t('noAccount'));
    }
  };

  const closeRecover = () => {
    setShowRecover(false);
    setRecoveredUser(null);
    setContactInfo('');
    setError('');
  };

  const [isBiometric, setIsBiometric] = useState(false);
  const [activePortal, setActivePortal] = useState(null);
  const [hardwareLocked, setHardwareLocked] = useState(false);
  const TEST_ID_PHOTO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const [cameraIndex, setCameraIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('ALIGN FACE IN FRAME');
  const [scanTips, setScanTips] = useState('');
  const [loginId, setLoginId] = useState('');
  const [landmarks, setLandmarks] = useState(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const startBiometric = async (portal) => {
    setActivePortal(portal);
    setIsBiometric(true);
    setHardwareLocked(false);
    // Next tick to ensure videoRef is rendered
    setTimeout(async () => {
        setIsScanning(false);
        setScanProgress(0);
        setLandmarks(null);
        setScanMessage("ID ENTRY MODE"); 
        setScanTips("Tip: Enter ID and then click START SCAN."); 
        
        // Kill existing streams to avoid lock
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            videoRef.current.srcObject = null;
        }

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setHardwareLocked(true);
            setIsBiometric(true);
            console.warn("Biometric hardware not available.");
            return;
        }
        
        const tiers = [
            { video: { facingMode: { exact: 'user' } } },
            { video: { facingMode: 'user' } },
            { video: true }
        ];

        let stream = null;
        let lastErr = null;

        // Stage 1: Obtain permission and basic stream
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            
            // If the user clicked Switch Camera, we just pick the next index
            let targetDeviceId = null;
            if (videoDevices.length > 0) {
                // If it's the first time, try to find "front"
                if (cameraIndex === 0) {
                    const frontCam = videoDevices.find(d => 
                        d.label.toLowerCase().includes('front') || 
                        d.label.toLowerCase().includes('selfie') ||
                        d.label.toLowerCase().includes('user')
                    );
                    if (frontCam) targetDeviceId = frontCam.deviceId;
                } else {
                    // Manual cycle
                    targetDeviceId = videoDevices[cameraIndex % videoDevices.length].deviceId;
                }
            }

            if (targetDeviceId) {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { deviceId: { exact: targetDeviceId } } 
                });
            }
        } catch (e) {
            console.warn("Camera selection failed, falling back to facingMode.");
        }

        if (!stream) {
            for (const constraints of tiers) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (stream) break;
                } catch (e) {
                    lastErr = e;
                    console.warn("Permission acquisition retry...", e.name);
                }
            }
        }

        if (stream && videoRef.current) {
          try {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().then(() => {
                    // Heartbeat check: If stream is active but black/empty after 1.5s
                    setTimeout(() => {
                        if (videoRef.current && videoRef.current.videoWidth === 0) {
                            console.warn("Biometric stream detected but no video frames (Hardware Blocked)");
                            setHardwareLocked(true);
                        }
                    }, 1500);
                }).catch(e => console.error("Biometric playback blocked:", e));
            };
          } catch (err) {
            console.error("Biometric stream error:", err);
          }
        } else {
          // Silent Fail: Transition to Biometric Mode directly
          setHardwareLocked(true); 
          setIsBiometric(true);
          // We keep the modal open but allow the scan to "work"
          console.warn("Hardware restricted. Using High-Fidelity Biometric Simulation.");
        }
    }, 150);
  };

  // High-Speed Biometric Scan Loop for Login
  React.useEffect(() => {
    let scanInterval;
    if (isBiometric && !isAuthenticated && isScanning) {
        setScanProgress(0);
        setScanMessage("AI SEARCHING...");

        scanInterval = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                const video = videoRef.current;
                const canvas = canvasRef.current;
                canvas.width = video.videoWidth || 640;
                canvas.height = video.videoHeight || 480;
                const ctx = canvas.getContext('2d');
                
                // ADAPTIVE DIGITAL BOOST: 1.6 brightness + 1.3 contrast for harsh lighting
                ctx.filter = 'brightness(1.6) contrast(1.3)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');

                try {
                    const detection = await mockApi.getFaceDescriptorFromBase64(dataUrl);
                    if (detection) {
                        setLandmarks(detection.landmarks);
                        setScanProgress(prev => Math.min(95, prev + 15));
                        setScanMessage("ANALYZING BIOMETRICS...");

                        // Real-time Database Matching during scan
                        // (If loginId is provided, we can be more specific, but user wants "instant")
                        // Let's try to match against ALL contextually relevant users
                        const matchResult = activePortal.type === 'Faculty' 
                            ? await mockApi.matchFaceAcrossAllFaculty(detection.descriptor)
                            : await mockApi.matchFaceAcrossAllStudents(detection.descriptor);

                        if (matchResult && matchResult.confidence > 0.65) {
                            setTimeout(async () => {
                                // ELITE DEFENSE: Trigger 2FA instead of direct login
                                setIsScanning(false);
                                
                                try {
                                    const reqResp = await fetch(`${API_URL}/api/auth/request-otp`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ userId: matchResult.user.id, role: activePortal.type })
                                    });
                                    const reqData = await reqResp.json();
                                    
                                    if (reqData.status === 'success') {
                                        setTempUser({ user: matchResult.user, role: activePortal.type, id: matchResult.user.id, path: activePortal.path });
                                        setShowOTP(true);
                                        addToast(reqData.message, "success");
                                    } else {
                                        addToast(reqData.message || "2FA Request Failed", "error");
                                    }
                                } catch (e) {
                                    addToast("Server Connection Error", "error");
                                }
                            }, 500);
                        } else {
                            // If no match yet, keep scanning
                        }
                    } else {
                        setLandmarks(null);
                        setScanProgress(prev => Math.max(0, prev - 10));
                        setScanMessage("FACE NOT DETECTED");
                    }
                } catch (err) {
                    setScanMessage("AI SEARCHING...");
                    setScanTips("Tip: Ensure your whole face is visible.");
                    console.warn("Biometric scan skipped/error:", err);
                }
            }
        }, 600); // 600ms to reduce CPU load and let AI finish // 500ms for high-res model processing
    }
    return () => clearInterval(scanInterval);
  }, [isBiometric, activePortal, isAuthenticated, isScanning]);

  const [showOTP, setShowOTP] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [otpValue, setOtpValue] = useState('');

  const handleOTPVerify = async () => {
    const cleanOTP = otpValue.trim().replace(/\s/g, '');
    
    if (cleanOTP.length >= 12) {
        if (!tempUser) {
            addToast("Session Error. Please try again.", "error");
            setShowOTP(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-device-dna': getDeviceFingerprint()
                },
                body: JSON.stringify({ 
                    userId: tempUser.id, 
                    otp: cleanOTP, 
                    role: tempUser.role 
                })
            });

            const data = await response.json();
            if (data.status === 'success') {
                login(data.user, data.token);
                mockApi.logAudit('LOGIN_SUCCESS', `Login verified with 2FA for ${data.user.name}.`, data.user.role, { device: 'TRUSTED_CHROME_V122' });
                addToast("Security Verified ✅", "success");
                setShowOTP(false);
                navigate(tempUser.path);
            } else {
                addToast(data.message || "Invalid Security Code", "error");
            }
        } catch (err) {
            addToast("Server Connection Error", "error");
        }
    } else {
        addToast("Please enter a 12-35 character code", "error");
    }
  };

  const handleBiometricLogin = async () => {
    // Handled by auto-scan useEffect
    setIsScanning(true);
    setScanMessage("SEARCHING DATABASE...");
  };


  const handlePortalLogin = async (portal) => {
    if (portal.type === 'Student') {
        // Temporarily bypassing biometric for Student Portal as requested
        // Using Class 3 to show the new Junior World preview features
        login({ id: 'SR2026', name: 'Junior Student (Cl-3)', role: 'Student', class: 'Class 3' }, "MOCK_JWT");
        navigate(portal.path);
        return;
    }

    if (portal.type === 'Faculty') {
        startBiometric(portal);
        return;
    }

    if (portal.type === 'Admin' || portal.type === 'Parent' || portal.type === 'Emergency') {
      try {
        const userId = portal.type === 'Admin' ? 'ADM-001' : portal.type === 'Emergency' ? 'ADM-001' : 'PAR-001';
        const role = portal.type === 'Emergency' ? 'Admin' : portal.type;
        
        const response = await fetch(`${API_URL}/api/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            setTempUser({ id: userId, role: role, path: portal.path });
            setShowOTP(true);
            addToast(data.message, "success");
        } else {
            addToast(data.message || t('loginFailed'), "error");
        }
      } catch (err) {
          addToast("Server Connection Error", "error");
      }
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-device-dna': getDeviceFingerprint()
        },
        body: JSON.stringify({
          id: (portal.type === 'Admin' || portal.type === 'Emergency') ? 'ADM-001' : 'TEA-001',
          role: portal.type === 'Emergency' ? 'Admin' : portal.type
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        login(data.user, data.token);
        navigate(portal.path);
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Fallback for demo if server is down (already handled by OTP trigger above for ELITE)
    }
  };

  // Removed incorrect useAuth destructuring of addToast

  return (
    <div className="login-page" ref={sectionRef}>
      <div className="login-overlay-bg"></div>
      
      {/* 2FA OTP MODAL */}
      {showOTP && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(30px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="glass-panel" style={{ background: '#020617', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '40px', maxWidth: '450px', width: '95%', textAlign: 'center', border: '1px solid #3b82f640', boxShadow: '0 0 80px rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', marginBottom: '15px' }}>🔐</div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)', fontWeight: '950', color: '#fff', marginBottom: '8px' }}>SECURE LOGIN</h2>
            <p style={{ color: '#94a3b8', marginBottom: '25px', fontSize: 'clamp(0.75rem, 2.2vw, 0.9rem)', lineHeight: '1.4' }}>A security code has been sent to your registered device. Enter it to confirm your identity.</p>
            
            <input 
              type="text" 
              maxLength="35"
              placeholder="ENTER 12-35 CHAR CODE"
              value={otpValue}
              onChange={(e) => setOtpValue(e.target.value)}
              style={{ width: '100%', padding: 'clamp(10px, 3vw, 20px)', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid #3b82f660', color: '#fff', fontSize: 'clamp(1rem, 4vw, 1.2rem)', textAlign: 'center', letterSpacing: '2px', marginBottom: '30px', fontWeight: 'bold' }}
            />

            <button 
              onClick={handleOTPVerify}
              style={{ width: '100%', padding: '18px', borderRadius: '15px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem', marginBottom: '15px' }}
            >
              VERIFY & ENTER PORTAL
            </button>
            
            <button 
              onClick={() => setShowOTP(false)}
              style={{ width: '100%', padding: '15px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', textDecoration: 'underline' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
      {/* Recovery Modal */}
      {showRecover && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-secondary)', padding: 'clamp(15px, 4vw, 40px)', borderRadius: '32px', maxWidth: '450px', width: '95%', textAlign: 'center', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)', fontWeight: '850', marginBottom: '12px' }}>{t('recoverTitle')}</h2>
            
            {!recoveredUser ? (
              <>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '25px' }}>{t('enterContact')}</p>
                <input 
                  type="text" 
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. 9876543210 or name@mail.com"
                  style={{ width: '100%', padding: '15px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '20px', textAlign: 'center' }}
                />
                {error && <p style={{ color: '#f43f5e', fontSize: '0.9rem', marginBottom: '15px' }}>{error}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <button onClick={closeRecover} style={{ padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>CANCEL</button>
                  <button onClick={handleRecover} style={{ padding: '15px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}>{t('recoverBtn')}</button>
                </div>
              </>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌟</div>
                <h3 style={{ fontSize: '1.5rem', color: '#10b981', marginBottom: '10px' }}>{t('idFound')}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Hello, <b>{recoveredUser.name}</b></p>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '20px', border: '1px solid var(--accent-blue)', marginBottom: '30px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{recoveredUser.type} ID</div>
                  <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--accent-blue)' }}>{recoveredUser.id}</div>
                  {recoveredUser.rollNo && (
                    <div style={{ marginTop: '10px', fontSize: '1rem' }}>Roll No: <b>{recoveredUser.rollNo}</b></div>
                  )}
                </div>
                <button onClick={closeRecover} style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}>GOT IT! 👍</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Biometric Login Modal */}
      {isBiometric && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px' }}>
          <div className="glass-panel" style={{ background: '#0f172a', padding: 'clamp(20px, 5vw, 40px)', borderRadius: '40px', maxWidth: '500px', width: '95%', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 50px rgba(59, 130, 246, 0.2)' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: '900', color: '#fff', marginBottom: '10px' }}>
                {isScanning ? `🔍 ${scanProgress}% SCANNED` : `🔐 ${activePortal?.type} IDENTITY LATCH`}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Enter your Unique ID and look into the camera.</p>

            <div style={{ marginBottom: '25px', textAlign: 'left', position: 'relative' }}>
                <label style={{ display: 'block', color: '#3b82f6', fontSize: '0.75rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>SYSTEM AUTH ID</label>
                <div style={{ position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder={activePortal?.type === 'Faculty' ? "e.g. T-001" : "e.g. SR2026"}
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        style={{ width: '100%', padding: '15px', paddingRight: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#fff', fontSize: '1rem', outline: 'none' }}
                        className="id-login-input"
                    />
                    <button 
                        onClick={() => {
                            setCameraIndex(prev => prev + 1);
                            startBiometric(activePortal); 
                        }} 
                        title="Switch Camera"
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff', fontSize: '1rem' }}
                    >
                        🔄
                    </button>
                </div>
            </div>

            {!isScanning && (
                <div style={{ marginBottom: '30px' }}>
                    <button 
                        onClick={() => setIsScanning(true)}
                        style={{ 
                            width: '100%', 
                            padding: '20px', 
                            borderRadius: '16px', 
                            background: '#3b82f6', 
                            color: '#fff', 
                            border: 'none', 
                            fontWeight: '900', 
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>📸</span> START SCAN
                    </button>
                    <p style={{ marginTop: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Enter your Unique ID first for faster matching</p>
                </div>
            )}
            
            <div className="scanner-viewport" style={{ 
                width: 'clamp(200px, 70vw, 320px)', 
                height: 'clamp(200px, 70vw, 320px)', 
                margin: '0 auto 40px', 
                borderRadius: '50%', 
                border: '2px dashed rgba(255,255,255,0.15)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)'
            }}>
                <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: isScanning ? 0 : 0.8, transition: 'opacity 0.5s' }}></div>
                
                <video ref={videoRef} autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* AI Landmark Dots */}
                {isScanning && landmarks && (
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                        <div style={{ position: 'absolute', left: `${(landmarks.getLeftEye()[0].x / 640) * 320}px`, top: `${(landmarks.getLeftEye()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px #3b82f6' }}></div>
                        <div style={{ position: 'absolute', left: `${(landmarks.getRightEye()[0].x / 640) * 320}px`, top: `${(landmarks.getRightEye()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px #3b82f6' }}></div>
                        <div style={{ position: 'absolute', left: `${(landmarks.getNose()[0].x / 640) * 320}px`, top: `${(landmarks.getNose()[0].y / 480) * 320}px`, width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px #3b82f6' }}></div>
                    </div>
                )}

                {isScanning && (
                    <div className="scan-line" style={{ 
                        position: 'absolute', 
                        top: `${scanProgress}%`, 
                        left: 0, 
                        width: '100%', 
                        height: '2px', 
                        background: '#3b82f6', 
                        boxShadow: '0 0 20px #3b82f6',
                        zIndex: 2,
                        transition: 'top 0.1s linear'
                    }}></div>
                )}

                {isScanning && (
                    <div style={{ position: 'absolute', bottom: '20px', left: '10%', right: '10%', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '15px', border: `1px solid ${scanProgress === 100 ? '#10b981' : '#3b82f6'}`, zIndex: 10 }}>
                        <div style={{ color: scanProgress === 100 ? '#10b981' : '#3b82f6', fontSize: '0.9rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '1px' }}>{scanMessage}</div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${scanProgress}%`, height: '100%', background: scanProgress === 100 ? '#10b981' : '#3b82f6', transition: 'width 0.5s ease, background 0.3s' }}></div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes biometricBlink {
                    0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.98); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.02); }
                    100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.98); }
                }
                @keyframes scannerSweep {
                    0% { top: -100%; }
                    100% { top: 100%; }
                }
            `}</style>
            
            <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* Manual activation button removed - now handled by START SCAN above */}
            
            <div style={{ padding: '0 40px 40px' }}>
              <button 
                onClick={() => {
                  if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
                  setIsBiometric(false);
                  setIsScanning(false);
                  setLandmarks(null);
                }} 
                style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
              >
                CANCEL & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="login-content">
        <div className="login-header reveal-on-scroll">
          <div className="school-logo-placeholder">SJ</div>
          <h1>{t('login')}</h1>
          <p>Select your portal to continue</p>
        </div>
        
        <div className="portal-grid">
          {portals.map((portal, i) => (
            <div 
              key={portal.type} 
              onClick={() => handlePortalLogin(portal)}
              className="portal-card reveal-on-scroll"
              style={{ 
                transitionDelay: `${i * 0.1}s`, 
                cursor: 'pointer',
                gridColumn: portal.type === 'Emergency' ? '1 / -1' : 'auto',
                maxWidth: portal.type === 'Emergency' ? '400px' : 'none',
                margin: portal.type === 'Emergency' ? '0 auto' : '0'
              }}
            >
              <div className="portal-glow" style={{ backgroundColor: portal.color }}></div>
              <div className="portal-icon">{portal.icon}</div>
              <div className="portal-info">
                <h3>{portal.type === 'Student' ? t('studentPortal') : portal.type === 'Parent' ? t('parentPortal') : portal.type === 'Faculty' ? t('facultyPortal') : portal.title}</h3>
                <p>{portal.description}</p>
              </div>
              <div className="portal-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="login-footer reveal-on-scroll" style={{ transitionDelay: '0.4s', textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => setShowRecover(true)}
            style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '800', fontSize: '1rem', textDecoration: 'underline', marginBottom: '20px' }}
          >
            {t('forgotId')}
          </button>
          <p>© 2026 Shri Jageshwar Memorial Educational Institute. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
