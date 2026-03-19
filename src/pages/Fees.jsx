import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../components/Common/Toaster';
import './Fees.css';

const Fees = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [feeData, setFeeData] = useState([]);
  const [parentFees, setParentFees] = useState([]);

  useEffect(() => {
    setFeeData(mockApi.getFees());
    setParentFees(mockApi.getParentFees());
  }, []);

  const t = {
    en: {
      title: 'Fee Management',
      breakdown: 'Fee Breakdown',
      history: 'Payment History',
      status: 'Status',
      amount: 'Amount',
      month: 'Month',
      action: 'Action',
      download: 'Download Receipt',
      payNow: 'Pay Now',
      paid: 'Paid',
      unpaid: 'Unpaid',
      partial: 'Partial',
      total: 'Total Fee',
      pending: 'Pending Balance'
    },
    hi: {
      title: 'शुल्क प्रबंधन',
      breakdown: 'शुल्क विवरण',
      history: 'भुगतान का इतिहास',
      status: 'स्थिति',
      amount: 'राशि',
      month: 'महीना',
      action: 'कार्रवाई',
      download: 'रसीद डाउनलोड करें',
      payNow: 'अभी भुगतान करें',
      paid: 'भुगतान किया गया',
      unpaid: 'अवैतनिक',
      partial: 'आंशिक',
      total: 'कुल शुल्क',
      pending: 'शेष राशि'
    }
  };

  const curr = language === 'hi' ? t.hi : t.en;

  const handleDownload = (id) => {
    showToast(`${curr.download} for #${id}...`, 'info');
    // Simulated download delay
    setTimeout(() => {
      showToast('Receipt Downloaded Successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="fees-container">
      <header className="fees-header">
        <h1>{curr.title}</h1>
        <div className="currency-badge">Currency: INR (₹)</div>
      </header>

      <div className="fees-summary">
        <div className="summary-card total">
          <i className="fas fa-wallet"></i>
          <div className="summary-info">
            <span>{curr.total}</span>
            <h2>₹45,000</h2>
          </div>
        </div>
        <div className="summary-card pending">
          <i className="fas fa-exclamation-circle"></i>
          <div className="summary-info">
            <span>{curr.pending}</span>
            <h2>₹5,000</h2>
          </div>
        </div>
        <div className="summary-card status">
          <i className="fas fa-check-circle"></i>
          <div className="summary-info">
            <span>Overall Status</span>
            <h2 className="status-partial">{curr.partial}</h2>
          </div>
        </div>
      </div>

      <div className="fees-grid">
        {/* Detailed Breakdown */}
        <div className="breakdown-section card">
          <h3>{curr.breakdown}</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span>Tuition Fee</span>
              <span>₹35,000</span>
            </div>
            <div className="breakdown-item">
              <span>Transport Fee</span>
              <span>₹4,000</span>
            </div>
            <div className="breakdown-item">
              <span>Lab & Library</span>
              <span>₹2,500</span>
            </div>
            <div className="breakdown-item">
              <span>Exam Fee</span>
              <span>₹1,500</span>
            </div>
            <div className="breakdown-item">
              <span>Sports & Activity</span>
              <span>₹2,000</span>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="history-section card">
          <h3>{curr.history}</h3>
          <div className="table-responsive">
            <table className="fees-table">
              <thead>
                <tr>
                  <th>{curr.month}</th>
                  <th>{curr.amount}</th>
                  <th>{curr.status}</th>
                  <th>{curr.action}</th>
                </tr>
              </thead>
              <tbody>
                {parentFees.map(fee => (
                  <tr key={fee.id}>
                    <td>{fee.month} {fee.year}</td>
                    <td>₹{fee.amount}</td>
                    <td>
                      <span className={`status-pill ${fee.status.toLowerCase()}`}>
                        {fee.status === 'Paid' ? curr.paid : curr.unpaid}
                      </span>
                    </td>
                    <td>
                      {fee.status === 'Paid' ? (
                        <button className="btn-download" onClick={() => handleDownload(fee.id)}>
                          <i className="fas fa-download"></i> {curr.download}
                        </button>
                      ) : (
                        <button className="btn-pay" onClick={() => showToast('Redirecting to Payment Gateway...', 'info')}>
                          {curr.payNow}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fees;
