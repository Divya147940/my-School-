import React, { useState, useEffect, useCallback } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';

const IdentityLock = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isLocked, setIsLocked] = useState(false);
    const [pin, setPin] = useState('');
    const [riskScore, setRiskScore] = useState(0);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const LOCK_TIMEOUT = 300000; // 5 minutes for Security Integrity (Production Level)

    const handleActivity = useCallback(() => {
        if (!isLocked) setLastActivity(Date.now());
    }, [isLocked]);

    const forceLogout = useCallback(() => {
        mockApi.logAudit('SECURITY_REVOCATION', `Session FORCE REVOKED due to high Risk Score.`, user?.role, { riskScore });
        setIsLocked(false);
        logout();
        alert("🚨 SECURITY ALERT: Your session has been terminated due to suspicious activity. Your ID has been flagged for review.");
    }, [user, logout]);

    useEffect(() => {
        if (!isAuthenticated || user?.role === 'Student') return;

        if (riskScore >= 3) {
            forceLogout();
            return;
        }

        const interval = setInterval(() => {
            if (Date.now() - lastActivity > LOCK_TIMEOUT && !isLocked) {
                setIsLocked(true);
                mockApi.logAudit('SECURITY_LOCK', `Inactivity lock triggered.`, user?.role);
            }
        }, 1000);

        // ANTI-RECONNAISSANCE: Block Right-Click & F12
        const blockRecon = (e) => {
            let triggered = false;
            let type = '';
            if (e.type === 'contextmenu') {
                e.preventDefault();
                triggered = true;
                type = 'RIGHT_CLICK';
            }
            if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
                e.preventDefault();
                triggered = true;
                type = 'DEVTOOLS_KEYBOARD';
            }

            if (triggered) {
                setRiskScore(prev => prev + 1);
                
                // --- SYNC STRIKE TO BACKEND ---
                fetch('http://localhost:5001/api/security/report-strike', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type,
                        userRole: user?.role || 'Guest',
                        details: `Strike ${riskScore + 1}/3 detected via ${type}`
                    })
                }).catch(err => console.error("Strike sync failed", err));

                mockApi.logAudit('SUSPICIOUS_RECON', `Recon attempt blocked. Strike: ${riskScore + 1}/3`, user?.role, { strike: riskScore + 1, type });
            }
        };

        // --- DEVTOOLS DEBUGGER TRAP ---
        const trapInterval = setInterval(() => {
            const startTime = performance.now();
            debugger; // This will pause execution if DevTools is open
            const endTime = performance.now();
            
            if (endTime - startTime > 100) {
                // Large delay indicates debugger was active (DevTools open)
                mockApi.logAudit('DEBUGGER_DETECTION', `Debugger trap triggered. Execution delayed by ${Math.round(endTime - startTime)}ms`, user?.role);
                setRiskScore(prev => prev + 1);
                
                fetch('http://localhost:5001/api/security/report-strike', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'DEBUGGER_PAUSE',
                        userRole: user?.role || 'Guest',
                        details: `Debugger trap triggered (Pause: ${Math.round(endTime - startTime)}ms)`
                    })
                }).catch(err => console.error("Trap sync failed", err));
            }
        }, 3000);

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('click', handleActivity);
        window.addEventListener('contextmenu', blockRecon);
        window.addEventListener('keydown', blockRecon);

        return () => {
            clearInterval(interval);
            clearInterval(trapInterval);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            window.removeEventListener('click', handleActivity);
            window.removeEventListener('contextmenu', blockRecon);
            window.removeEventListener('keydown', blockRecon);
        };
    }, [isAuthenticated, user, lastActivity, isLocked, handleActivity]);

    const unlock = () => {
        if (pin === '1234' || pin.length >= 4) {
            setIsLocked(false);
            setPin('');
            setLastActivity(Date.now());
            mockApi.logAudit('SECURITY_UNLOCK', `Portal resumed.`, user?.role);
        }
    };

    if (!isLocked) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(40px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '50px', borderRadius: '40px', border: '1px solid rgba(59, 130, 246, 0.3)', maxWidth: '400px', width: '90%' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
                <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '900', marginBottom: '10px' }}>PORTAL LOCKED</h2>
                <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Due to inactivity, your session has been secured. Enter your PIN to resume.</p>
                
                <input 
                    type="password" 
                    placeholder="ENTER PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    style={{ width: '100%', padding: '20px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(59, 130, 246, 0.5)', color: '#fff', fontSize: '1.5rem', textAlign: 'center', letterSpacing: '8px', marginBottom: '20px' }}
                />

                <button 
                    onClick={unlock}
                    style={{ width: '100%', padding: '18px', borderRadius: '15px', background: '#3b82f6', color: '#fff', border: 'none', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                    RESUME SESSION
                </button>
            </div>
        </div>
    );
};

export default IdentityLock;
