import React, { useRef } from 'react';
import './FeeReceipt.css';
import { useLanguage } from '../../context/LanguageContext';

const FeeReceipt = ({ txn, onClose }) => {
    const { language } = useLanguage();
    const receiptRef = useRef();

    const handlePrint = () => {
        const printContent = receiptRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = `
            <div class="print-container">
                ${printContent}
            </div>
            <style>
                .print-container { padding: 40px; font-family: 'Inter', sans-serif; }
                .paid-stamp { opacity: 0.15 !important; }
            </style>
        `;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // To restore React state
    };

    if (!txn) return null;

    return (
        <div className="receipt-overlay">
            <div className="receipt-modal glass-panel">
                <div className="receipt-actions">
                    <button className="btn-print" onClick={handlePrint}>🖨️ {language === 'hi' ? 'प्रिंट करें' : 'Print PDF'}</button>
                    <button className="btn-close" onClick={onClose}>✕</button>
                </div>

                <div className="receipt-paper" ref={receiptRef}>
                    <div className="receipt-border">
                        <header className="receipt-header">
                            <div className="school-info">
                                <h1>SHRI JAGESHWAR MEMORIAL</h1>
                                <h2>EDUCATIONAL INSTITUTE</h2>
                                <p>Affiliated to CBSE | Code: 123456</p>
                                <p className="address">Main Campus, Raebareli, UP - 229001</p>
                            </div>
                            <div className="receipt-badge">
                                <span>{language === 'hi' ? 'फीस रसीद' : 'FEE RECEIPT'}</span>
                            </div>
                        </header>

                        <div className="receipt-body">
                            <div className="receipt-row">
                                <div className="detail-item">
                                    <label>{language === 'hi' ? 'रसीद संख्या' : 'Receipt No.'}</label>
                                    <span>#{txn.id}</span>
                                </div>
                                <div className="detail-item">
                                    <label>{language === 'hi' ? 'दिनांक' : 'Date'}</label>
                                    <span>{txn.date || new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="student-profile-receipt">
                                <h3>{language === 'hi' ? 'छात्र विवरण' : 'Student Details'}</h3>
                                <div className="receipt-grid">
                                    <div className="grid-item">
                                        <label>{language === 'hi' ? 'छात्र का नाम' : 'Student Name'}</label>
                                        <span className="val-bold">{txn.studentName || 'Aman Gupta'}</span>
                                    </div>
                                    <div className="grid-item">
                                        <label>{language === 'hi' ? 'कक्षा' : 'Class'}</label>
                                        <span className="val-bold">{txn.class || '10A'}</span>
                                    </div>
                                    <div className="grid-item">
                                        <label>{language === 'hi' ? 'अभिभावक का नाम' : 'Guardian Name'}</label>
                                        <span>Mr. Rajkumar Gupta</span>
                                    </div>
                                    <div className="grid-item">
                                        <label>{language === 'hi' ? 'सत्र' : 'Session'}</label>
                                        <span>2025-26</span>
                                    </div>
                                </div>
                            </div>

                            <table className="receipt-table">
                                <thead>
                                    <tr>
                                        <th>{language === 'hi' ? 'विवरण' : 'Description'}</th>
                                        <th className="text-right">{language === 'hi' ? 'राशि' : 'Amount'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{language === 'hi' ? 'मासिक ट्यूशन फीस' : 'Monthly Tuition Fee'} ({txn.month || 'Current'})</td>
                                        <td className="text-right">₹{txn.amount}</td>
                                    </tr>
                                    <tr className="total-row">
                                        <td>{language === 'hi' ? 'कुल राशि' : 'TOTAL AMOUNT'}</td>
                                        <td className="text-right">₹{txn.amount}/-</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="payment-info-box">
                                <p><strong>{language === 'hi' ? 'भुगतान विधि' : 'Payment Mode'}:</strong> {txn.mode} ({txn.status})</p>
                                <p><strong>{language === 'hi' ? 'लेन-देन आईडी' : 'Txn ID'}:</strong> {txn.id}</p>
                            </div>

                            <footer className="receipt-footer">
                                <div className="signature-box">
                                    <div className="sig-line"></div>
                                    <p>{language === 'hi' ? 'हस्ताक्षर (अकाउंटेंट)' : "Authorized Signatory"}</p>
                                </div>
                                <div className="paid-stamp">PAID</div>
                            </footer>

                            <p className="computer-generated">
                                {language === 'hi' 
                                    ? 'नोट: यह एक कंप्यूटर द्वारा जनरेट की गई रसीद है, हस्ताक्षर की आवश्यकता नहीं है।' 
                                    : 'Note: This is a computer generated receipt, no physical signature required.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;
