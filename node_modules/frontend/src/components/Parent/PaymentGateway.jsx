import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './PaymentGateway.css';

const PaymentGateway = ({ amount, onSuccess, onClose }) => {
    const { theme } = useTheme();
    const [step, setStep] = useState('method'); // method, processing, success
    const [selectedMethod, setSelectedMethod] = useState(null);

    const handlePay = () => {
        setStep('processing');
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }, 2000);
    };

    return (
        <div className={`payment-overlay ${theme === 'light' ? 'light-mode' : ''}`}>
            <div className="payment-modal glass-panel">
                <button className="close-btn" onClick={onClose}>×</button>
                
                {step === 'method' && (
                    <>
                        <div className="payment-header">
                            <h3>Secure Checkout</h3>
                            <div className="amount-badge">₹{amount}</div>
                        </div>
                        <div className="payment-methods">
                            <div 
                                className={`method-card ${selectedMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setSelectedMethod('upi')}
                            >
                                <span className="method-icon">📱</span>
                                <div className="method-info">
                                    <h4>UPI</h4>
                                    <p>Google Pay, PhonePe, Paytm</p>
                                </div>
                            </div>
                            <div 
                                className={`method-card ${selectedMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setSelectedMethod('card')}
                            >
                                <span className="method-icon">💳</span>
                                <div className="method-info">
                                    <h4>Card</h4>
                                    <p>Visa, Mastercard, RuPay</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            className="pay-btn" 
                            disabled={!selectedMethod}
                            onClick={handlePay}
                        >
                            Pay Securely
                        </button>
                    </>
                )}

                {step === 'processing' && (
                    <div className="processing-state">
                        <div className="spinner"></div>
                        <h3>Processing Payment</h3>
                        <p>Please do not refresh or close the window...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="success-state">
                        <div className="success-icon">✅</div>
                        <h3>Payment Successful!</h3>
                        <p>Transaction ID: TXN{Math.floor(Math.random() * 1000000)}</p>
                        <p>Your receipt is being generated...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentGateway;
