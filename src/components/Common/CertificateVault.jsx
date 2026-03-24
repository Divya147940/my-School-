import React, { useState } from 'react';
import './CertificateVault.css';

const CertificateVault = () => {
    const [verifying, setVerifying] = useState(null);
    const [verified, setVerified] = useState([]);

    const certificates = [
        { id: 'CERT-001', title: 'Mathematics Excellence', date: 'March 2026', issuer: 'NSGI Academy' },
        { id: 'CERT-002', title: 'Inter-School Debate Winner', date: 'Feb 2026', issuer: 'Regional Board' },
        { id: 'CERT-003', title: 'Python Programming Basics', date: 'Jan 2026', issuer: 'CodeQuest' }
    ];

    const handleVerify = (id) => {
        setVerifying(id);
        setTimeout(() => {
            setVerifying(null);
            setVerified([...verified, id]);
        }, 3000);
    };

    return (
        <div className="cert-vault-container glass-panel">
            <div className="vault-header">
                <h3>Digital Certificate Vault 🛡️</h3>
                <span className="blockchain-badge">Secured by Simulation-Chain</span>
            </div>

            <div className="cert-grid">
                {certificates.map(cert => (
                    <div key={cert.id} className="cert-card">
                        <div className="cert-icon">📜</div>
                        <div className="cert-details">
                            <h4>{cert.title}</h4>
                            <p>{cert.issuer} • {cert.date}</p>
                            <span className="cert-id">ID: {cert.id}</span>
                        </div>
                        <div className="cert-actions">
                            {verified.includes(cert.id) ? (
                                <div className="verified-status">
                                    <span className="check">✅</span> Verified on Ledger
                                </div>
                            ) : (
                                <button 
                                    className={`verify-btn ${verifying === cert.id ? 'loading' : ''}`}
                                    onClick={() => handleVerify(cert.id)}
                                    disabled={verifying}
                                >
                                    {verifying === cert.id ? 'Connecting to Node...' : 'Verify on Blockchain'}
                                </button>
                            )}
                            <button className="download-btn">Download PDF</button>
                        </div>
                        {verifying === cert.id && <div className="glitch-overlay"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificateVault;
