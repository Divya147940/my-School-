import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import './FeeInvoice.css';

const FeeInvoice = ({ studentName = 'Aman Gupta' }) => {
    const [step, setStep] = useState('summary');
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const feeRecord = mockApi.getFees().find(f => f.student === studentName) || { total: 0, paid: 0 };
    const balance = feeRecord.total - feeRecord.paid;

    const handlePayment = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            mockApi.updateFeePayment(studentName, balance);
            setIsProcessing(false);
            setStep('success');
        }, 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    if (step === 'success') {
        return (
            <div className="fee-success-view">
                <div className="success-icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>₹{balance.toLocaleString()} has been paid towards fees.</p>
                <div className="invoice-actions no-print">
                    <button className="print-btn" onClick={handlePrint}>Download Receipt (PDF)</button>
                    <button className="back-btn" onClick={() => setStep('summary')}>Back to Fees</button>
                </div>

                <div className="receipt-print print-only">
                    <div className="receipt-header">
                        <h3>NSGI GROUP OF INSTITUTIONS</h3>
                        <p>OFFICIAL FEE RECEIPT</p>
                    </div>
                    <hr />
                    <div className="receipt-details">
                        <p><strong>Student:</strong> {studentName}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                        <p><strong>Receipt No:</strong> NSGI-{Date.now()}</p>
                        <p><strong>Amount Paid:</strong> ₹{balance.toLocaleString()}</p>
                        <p><strong>Status:</strong> FULLY PAID</p>
                    </div>
                    <div className="receipt-footer">
                        <p>This is a computer-generated receipt.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'checkout') {
        return (
            <div className="fee-checkout">
                <h3>💳 Secure Payment</h3>
                <p>Paying balance for: **{studentName}**</p>
                <form className="payment-form" onSubmit={handlePayment}>
                    <div className="amount-highlight">₹{balance.toLocaleString()}</div>
                    <input 
                        type="text" 
                        placeholder="Card Number (0000 0000 0000 0000)" 
                        required 
                        maxLength="19"
                        value={cardData.number}
                        onChange={e => setCardData({...cardData, number: e.target.value})}
                    />
                    <div className="form-row">
                        <input type="text" placeholder="MM/YY" required value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} />
                        <input type="text" placeholder="CVV" required value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} />
                    </div>
                    <button type="submit" disabled={isProcessing}>
                        {isProcessing ? 'Processing Securely...' : `Pay ₹${balance.toLocaleString()}`}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => setStep('summary')}>Cancel</button>
                </form>
            </div>
        );
    }

    return (
        <div className="fee-summary-view">
            <header className="fee-header">
                <h2>💰 Fee Management & Invoices</h2>
                <div className="fee-badge">{feeRecord.status}</div>
            </header>

            <div className="fee-details-grid">
                <div className="fee-card">
                    <label>Total Annual Fee</label>
                    <p>₹{feeRecord.total.toLocaleString()}</p>
                </div>
                <div className="fee-card">
                    <label>Amount Paid</label>
                    <p className="paid">₹{feeRecord.paid.toLocaleString()}</p>
                </div>
                <div className="fee-card highlight">
                    <label>Pending Balance</label>
                    <p className="balance">₹{balance.toLocaleString()}</p>
                </div>
            </div>

            <div className="fee-actions">
                {balance > 0 ? (
                    <button className="pay-now-btn" onClick={() => setStep('checkout')}>Pay Balance Now</button>
                ) : (
                    <button className="receipt-btn" onClick={() => setStep('success')}>View Last Receipt</button>
                )}
            </div>
        </div>
    );
};

export default FeeInvoice;
