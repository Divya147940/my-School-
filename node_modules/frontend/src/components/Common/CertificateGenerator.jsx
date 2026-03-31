import React, { useState } from 'react';
import './CertificateGenerator.css';
import { useLanguage } from '../../context/LanguageContext';

const CertificateGenerator = ({ studentName = 'Aman Gupta' }) => {
    const { language } = useLanguage();
    const [selectedCert, setSelectedCert] = useState(null);

    const templates = [
        { 
            id: 1, 
            title: language === 'hi' ? 'उत्कृष्टता प्रमाण पत्र' : 'Certificate of Excellence', 
            subtitle: language === 'hi' ? 'शैक्षणिक उपलब्धि के लिए' : 'For Outstanding Academic Achievement', 
            color: 'gold', 
            stamp: '🏆', 
            signature: 'Dr. Vivek Sharma' 
        },
        { 
            id: 2, 
            title: language === 'hi' ? 'खेल उत्कृष्टता पुरस्कार' : 'Sports Excellence Award', 
            subtitle: language === 'hi' ? 'एथलेटिक्स में चैंपियन भावना के लिए' : 'For Champion Spirit in Athletics', 
            color: 'blue', 
            stamp: '🏅', 
            signature: 'Coach Rajesh Kumar' 
        },
        { 
            id: 3, 
            title: language === 'hi' ? 'रचनात्मक प्रतिभा पुरस्कार' : 'Creative Genius Award', 
            subtitle: language === 'hi' ? 'असाधारण कलात्मक योगदान के लिए' : 'For Extraordinary Artistic Contribution', 
            color: 'purple', 
            stamp: '🎨', 
            signature: 'Ms. Anjali Verma' 
        },
        { 
            id: 4, 
            title: language === 'hi' ? 'महीने का छात्र' : 'Student of the Month', 
            subtitle: language === 'hi' ? 'निरंतर सर्वांगीण प्रदर्शन के लिए' : 'For Consistent All-round Performance', 
            color: 'silver', 
            stamp: '⭐', 
            signature: 'Principal NSGI' 
        },
    ];

    const handlePrint = () => {
        const printContent = document.getElementById('printable-certificate');
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore state
    };

    return (
        <div className="certificate-generator">
            <div className="header-flex">
                <div>
                    <h2>{language === 'hi' ? 'आपके उपलब्धि पुरस्कार' : 'Your Achievement Awards'} 📜</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {language === 'hi' ? 'शैक्षणिक वर्ष 2025-26 के लिए अपने अर्जित प्रमाण पत्र देखें और डाउनलोड करें।' : 'View and download your earned certificates for the academic year 2025-26.'}
                    </p>
                </div>
            </div>

            <div className="certificates-grid">
                {templates.map((tpl) => (
                    <div key={tpl.id} className={`certificate-template-card ${tpl.color}`} onClick={() => setSelectedCert(tpl)}>
                        <div className="card-inner">
                            <div className="cert-mini-icon">{tpl.stamp}</div>
                            <h3>{tpl.title}</h3>
                            <button className="view-btn">
                                {language === 'hi' ? 'देखें और प्रिंट करें' : 'View & Print'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedCert && (
                <div className="certificate-modal-overlay">
                    <div className="modal-content glass-panel">
                        <div id="printable-certificate">
                            <div className={`certificate-premium-render ${selectedCert.color}`}>
                                <div className="cert-border-corner tl"></div>
                                <div className="cert-border-corner tr"></div>
                                <div className="cert-border-corner bl"></div>
                                <div className="cert-border-corner br"></div>
                                
                                <div className="cert-inner-content">
                                    <div className="cert-logo">NSGI ACADEMY</div>
                                    <h1 className="cert-main-title">{selectedCert.title}</h1>
                                    <div className="cert-subtitle-text">{selectedCert.subtitle}</div>
                                    
                                    <div className="cert-presented-text">{language === 'hi' ? 'यह प्रमाण पत्र गर्व के साथ प्रदान किया जाता है' : 'This certificate is proudly presented to'}</div>
                                    <div className="cert-student-name">{studentName}</div>
                                    
                                    <div className="cert-body-text">
                                        {language === 'hi' 
                                            ? 'आपकी असाधारण निष्ठा, कड़ी मेहनत और शैक्षणिक सत्र के दौरान प्रदर्शित उल्लेखनीय प्रदर्शन की मान्यता में। आप अपने सभी भविष्य के प्रयासों में उत्कृष्टता प्राप्त करना जारी रखें।'
                                            : 'In recognition of your exceptional dedication, hard work, and remarkable performance demonstrated during the academic session. May you continue to excel in all your future endeavors.'}
                                    </div>

                                    <div className="cert-signatures">
                                        <div className="sig-block">
                                            <div className="handwriting">{selectedCert.signature}</div>
                                            <div className="label">Principal</div>
                                        </div>
                                        <div className="cert-official-seal">
                                            <div className="seal-outer">{selectedCert.stamp}</div>
                                        </div>
                                        <div className="sig-block">
                                            <div className="date-field">{new Date().toLocaleDateString()}</div>
                                            <div className="label">Date Issued</div>
                                        </div>
                                    </div>

                                    {/* GUARDIAN SUITE 2.0: DIGITAL VERIFICATION SEAL */}
                                    <div style={{ marginTop: '30px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
                                        <div>VERIFICATION ID: NSGI-{btoa(selectedCert.id + studentName).substring(0, 12).toUpperCase()}</div>
                                        <div>SECURED BY GUARDIAN SUITE 2.0</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-actions">
                            <button className="print-pdf-btn" onClick={handlePrint}>📥 Download PDF</button>
                            <button className="close-modal-btn" onClick={() => setSelectedCert(null)}>✕</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateGenerator;
