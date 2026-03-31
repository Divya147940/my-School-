import React, { useState } from 'react';
import { API_URL } from '../../config';
import './SecurityPinModal.css';

/**
 * SecurityPinModal Component
 * Challenges the user for a 4-digit security PIN before sensitive actions.
 */
const SecurityPinModal = ({ isOpen, onClose, onVerified, actionName = "this action" }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleInput = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        
        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Auto focus next input
        if (value && index < 3) {
            document.getElementById(`pin-input-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            document.getElementById(`pin-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = async () => {
        const fullPin = pin.join('');
        if (fullPin.length < 4) {
            setError('Please enter all 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // SYNC WITH BACKEND: Verify PIN
            const response = await fetch(`${API_URL}/api/security/verify-pin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: fullPin })
            });

            const result = await response.json();
            if (result.success) {
                onVerified();
                onClose();
                setPin(['', '', '', '']);
            } else {
                setError('Invalid Security PIN. Access Denied.');
                setPin(['', '', '', '']);
                document.getElementById('pin-input-0').focus();
            }
        } catch (err) {
            setError('Verification service unavailable');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="security-pin-overlay">
            <div className="security-pin-modal glass-panel">
                <div className="pin-header">
                    <span className="shield-icon">🛡️</span>
                    <h3>Action-Level MFA</h3>
                    <p>Enter your Security PIN to authorize: <strong>{actionName}</strong></p>
                </div>

                <div className="pin-inputs">
                    {pin.map((digit, i) => (
                        <input
                            key={i}
                            id={`pin-input-${i}`}
                            type="password"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleInput(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            maxLength="1"
                            autoComplete="off"
                        />
                    ))}
                </div>

                {error && <div className="pin-error">{error}</div>}

                <div className="pin-actions">
                    <button className="pin-cancel" onClick={onClose}>Cancel</button>
                    <button 
                        className="pin-verify" 
                        onClick={handleSubmit} 
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Authorize Action'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityPinModal;
