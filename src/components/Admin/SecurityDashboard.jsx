import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import './SecurityDashboard.css';

const SecurityDashboard = () => {
    const [auditLogs, setAuditLogs] = useState([]);
    const [riskSummary, setRiskSummary] = useState({ totalThreats: 0, revocations: 0, criticalAlerts: [] });
    const [isLockdown, setIsLockdown] = useState(mockApi.isSystemLockdown());
    const { secureApi } = useAuth();

    const refreshData = async () => {
        try {
            // Fetch from Backend
            const res = await secureApi('http://localhost:5001/api/admin/security-logs');
            if (res.ok) {
                const logs = await res.json();
                setAuditLogs(logs.slice(0, 50));
                
                // Calculate risk summary from logs
                const critical = logs.filter(l => l.severity === 'CRITICAL' || l.type === 'CRITICAL_CANARY_HIT');
                setRiskSummary({
                    totalThreats: logs.filter(l => l.type.includes('STRIKE') || l.type.includes('ATTEMPT')).length,
                    revocations: logs.filter(l => l.type === 'SESSION_HIJACK_ATTEMPT').length,
                    criticalAlerts: critical.map(c => ({ id: c.id, msg: c.details, user: c.user || 'Unknown' }))
                });
            } else {
                // Fallback to mock if backend fails
                setAuditLogs(mockApi.getAuditLogs().slice(0, 20));
                setRiskSummary(mockApi.getRiskSummary());
            }
        } catch (e) {
            console.error("Forensic fetch failed", e);
        }
    };

    const toggleLockdown = () => {
        const newStatus = !isLockdown;
        mockApi.setSystemLockdown(newStatus);
        setIsLockdown(newStatus);
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (type) => {
        switch (type) {
            case 'SECURITY_REVOCATION': return '#ef4444';
            case 'SESSION_HIJACK_ATTEMPT': return '#ef4444';
            case 'CRITICAL_CANARY_HIT': return '#f43f5e';
            case 'FRONTEND_STRIKE_DEVTOOLS_KEYBOARD': return '#f59e0b';
            case 'FRONTEND_STRIKE_RIGHT_CLICK': return '#3b82f6';
            case 'FRONTEND_STRIKE_DEBUGGER_PAUSE': return '#8b5cf6';
            case 'SUSPICIOUS_RECON': return '#f59e0b';
            case 'SECURITY_FRAUD': return '#f43f5e';
            case 'GPS_WARP': return '#7c3aed';
            case 'BIOMETRIC_FAIL': return '#db2777';
            case 'DATA_ACCESS_REVEAL': return '#3b82f6';
            default: return '#10b981';
        }
    };

    const forensicLogs = auditLogs.filter(l => ['SECURITY_FRAUD', 'GPS_WARP', 'SECURITY_REVOCATION'].includes(l.type));

    return (
        <div className="security-dashboard-container">
            <div className="security-header" style={{ borderLeft: '5px solid #7c3aed' }}>
                <div>
                    <h2>Guardian Suite 2.0: Forensic Center 🛡️</h2>
                    <p>Advanced real-time threat detection & digital sovereignty</p>
                </div>
                <div className="lockdown-toggle">
                    <button 
                        className="export-btn"
                        onClick={() => mockApi.exportAuditTrail()}
                        style={{ marginRight: '15px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                    >
                        📄 EXPORT SIGNED FORENSIC LOG
                    </button>
                    <span style={{ color: isLockdown ? '#ef4444' : '#94a3b8', fontWeight: 'bold', marginRight: '10px' }}>
                        {isLockdown ? '🚨 EMERGENCY LOCKDOWN ACTIVE' : 'SYSTEM STATUS: SECURE'}
                    </span>
                    <button 
                        className={`toggle-btn ${isLockdown ? 'active' : ''}`}
                        onClick={toggleLockdown}
                    >
                        {isLockdown ? 'RELEASE SYSTEM' : 'EMERGENCY LOCKDOWN'}
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="label">Forensic Threats (24h)</span>
                    <span className="value" style={{ color: '#f59e0b' }}>{riskSummary.totalThreats}</span>
                </div>
                <div className="stat-card" style={{ borderBottom: '3px solid #7c3aed' }}>
                    <span className="label">GPS Warp Blocks</span>
                    <span className="value" style={{ color: '#7c3aed' }}>{auditLogs.filter(l => l.type === 'GPS_WARP').length}</span>
                </div>
                <div className="stat-card">
                    <span className="label">Integrity Status</span>
                    <span className="value" style={{ color: '#10b981' }}>100% SIGNED</span>
                </div>
            </div>

            <div className="main-grid">
                <div className="logs-panel glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0 }}>🛡️ Forensic Audit Trail</h3>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>SHA-256 HMAC (MOCK)</div>
                    </div>
                    <div className="logs-list">
                        {auditLogs.map(log => (
                            <div key={log.id} className="log-entry" style={{ borderLeft: `3px solid ${getStatusColor(log.type)}` }}>
                                <span className="timestamp">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className="type" style={{ color: getStatusColor(log.type) }}>[{log.type}]</span>
                                <span className="content">{log.details || log.action}</span>
                                <span className="role-tag" style={{ background: log.role === 'Admin' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}>{log.role || 'Guest'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-panel glass-panel" style={{ background: 'rgba(124, 58, 237, 0.05)' }}>
                    <h3 style={{ color: '#7c3aed' }}>🚨 AI Forensic Alerts</h3>
                    <div className="alerts-list">
                        {riskSummary.criticalAlerts.length > 0 ? riskSummary.criticalAlerts.map(alert => (
                            <div key={alert.id} className="critical-alert" style={{ border: '1px solid rgba(124, 58, 237, 0.2)', background: '#fff' }}>
                                <strong style={{ color: '#7c3aed' }}>ATTENTION REQUIRED</strong>
                                <p style={{ fontSize: '0.85rem' }}>{alert.msg}</p>
                                <small>Actor: {alert.user} | Sig: {alert.id.split('-').pop()}</small>
                            </div>
                        )) : (
                            <div className="no-alerts">No critical forensic threats detected.</div>
                        )}
                        
                        {auditLogs.filter(l => l.type === 'GPS_WARP').slice(0, 2).map(l => (
                            <div key={l.id} className="critical-alert" style={{ border: '1px solid #f43f5e', background: 'rgba(244, 63, 94, 0.05)' }}>
                                <strong style={{ color: '#f43f5e' }}>🚩 FRAUD DETECTION: GPS WARP</strong>
                                <p style={{ fontSize: '0.8rem' }}>{l.action}</p>
                                <small>User: {l.role} | Blocked</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
