import React, { useState } from 'react';
import './CertificateGenerator.css';

const CertificateGenerator = ({ studentName = 'Aman Gupta' }) => {
  const [selectedCert, setSelectedCert] = useState(null);

  const templates = [
    { id: 1, title: 'Certificate of Excellence', subtitle: 'For Outstanding Academic Achievement', color: 'gold', stamp: '🏆', signature: 'Dr. Vivek Sharma' },
    { id: 2, title: 'Sports Excellence Award', subtitle: 'For Champion Spirit in Athletics', color: 'blue', stamp: '🏅', signature: 'Coach Rajesh Kumar' },
    { id: 3, title: 'Creative Genius Award', subtitle: 'For Extraordinary Artistic Contribution', color: 'purple', stamp: '🎨', signature: 'Ms. Anjali Verma' },
    { id: 4, title: 'Student of the Month', subtitle: 'For Consistent All-round Performance', color: 'silver', stamp: '⭐', signature: 'Principal NSGI' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="certificate-generator">
      <div className="header-flex">
        <div>
          <h2>Your Achievement Awards</h2>
          <p style={{ color: '#64748b' }}>View and download your earned certificates for the academic year 2025-26.</p>
        </div>
      </div>

      <div className="certificates-grid">
        {templates.map((tpl) => (
          <div key={tpl.id} className="certificate-template-card" onClick={() => setSelectedCert(tpl)}>
            <div className={`certificate-preview`}>
              <div className={`cert-mini-view ${tpl.color}`}>
                <h4>{tpl.title}</h4>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Presented to</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{studentName}</div>
                <div className="cert-stamp">{tpl.stamp}</div>
              </div>
              <button className="cert-action-btn">
                <span>👁️</span> View & Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCert && (
        <div className="certificate-modal-overlay">
          <div className="full-certificate-viewer">
            <button 
              className="cert-close-btn" 
              onClick={() => setSelectedCert(null)}
              style={{ position: 'absolute', top: 20, right: 20, background: '#ef4444', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', zIndex: 10 }}
            >
              Close
            </button>
            
            <div className={`certificate-render ${selectedCert.color}`}>
              <div className="cert-header">
                <h1>{selectedCert.title}</h1>
              </div>
              <div className="cert-subtitle">{selectedCert.subtitle}</div>
              <div style={{ fontSize: '1.2rem' }}>This certificate is proudly presented to</div>
              <div className="cert-recipient">{studentName}</div>
              <div className="cert-body">
                In recognition of your exceptional dedication, hard work, and remarkable performance 
                demonstrated during the academic session. May you continue to excel in all your future endeavors.
              </div>
              <div className="cert-footer">
                <div className="signature-box">
                  <div className="signature">{selectedCert.signature}</div>
                  <div style={{ fontSize: '0.8rem' }}>Principal / Head of Authority</div>
                </div>
                <div className="date-box">
                  <div style={{ borderTop: '1px solid #1a365d', width: '150px', paddingTop: '5px' }}>{new Date().toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.8rem' }}>Date Issued</div>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: 40, right: 40, fontSize: '5rem', opacity: 0.1 }}>
                {selectedCert.stamp}
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                className="print-btn" 
                onClick={handlePrint}
                style={{ padding: '12px 30px', background: '#10b981', color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🖨️ Print as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
