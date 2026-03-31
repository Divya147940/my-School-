import React from 'react';
import './IDCard.css';

const IDCard = ({ studentData }) => {
  const { name = "Student Name", class: className = "X-A", rollNo = "2026001", dob = "01/01/2010", bloodGroup = "O+", photo = null } = studentData || {};

  return (
    <div className="id-card-container">
      <div className="id-card glass-panel card-vibe shadow-glow">
        <div className="id-card-header">
          <div className="school-logo-small">NSGI</div>
          <div className="school-info-mini">
            <h3>SHRI JAGESHWAR MEMORIAL</h3>
            <p>Affiliated to CBSE, New Delhi</p>
          </div>
        </div>

        <div className="id-card-body">
          <div className="photo-slot">
            {photo ? <img src={photo} alt={name} /> : <div className="photo-placeholder">{name.charAt(0)}</div>}
          </div>
          <div className="student-details">
            <div className="detail-item">
              <label>NAME</label>
              <span>{name}</span>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <label>CLASS</label>
                <span>{className}</span>
              </div>
              <div className="detail-item">
                <label>ROLL NO</label>
                <span>{rollNo}</span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-item">
                <label>DOB</label>
                <span>{dob}</span>
              </div>
              <div className="detail-item">
                <label>BLOOD</label>
                <span>{bloodGroup}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="id-card-footer">
          <div className="qr-code-placeholder">
            <svg viewBox="0 0 100 100" width="60" height="60">
              <rect width="100" height="100" fill="white" />
              <rect x="10" y="10" width="20" height="20" fill="black" />
              <rect x="70" y="10" width="20" height="20" fill="black" />
              <rect x="10" y="70" width="20" height="20" fill="black" />
              <rect x="40" y="40" width="20" height="20" fill="black" />
              <rect x="70" y="70" width="10" height="10" fill="black" />
            </svg>
          </div>
          <div className="footer-auth">
            <div className="signature">Principal</div>
            <p className="academic-session">SESSION: 2026-27</p>
          </div>
        </div>
        
        <div className="hologram-seal">★</div>
      </div>
      
      <div className="id-actions">
          <button className="id-download-btn" onClick={() => window.print()}>Download Digital ID 📥</button>
      </div>
    </div>
  );
};

export default IDCard;
