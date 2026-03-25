import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * DataMask Component
 * Masks sensitive information and reveals it only when authorized or interacts.
 */
const DataMask = ({ value, maskFunc, label = "Sensitive Data" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useAuth();
    
    const maskedValue = maskFunc ? maskFunc(value) : '********';
    
    const handleToggle = () => {
        // Only allow reveal if user is not a Student (simplified RBAC)
        if (user?.role === 'Student') {
            alert("Security Policy: Students cannot reveal sensitive administrative records.");
            return;
        }
        setIsVisible(!isVisible);
    };

    return (
        <span 
            className={`data-mask-container ${isVisible ? 'revealed' : 'masked'}`}
            style={{ 
                cursor: user?.role !== 'Student' ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
            }}
            onClick={handleToggle}
            title={user?.role !== 'Student' ? "Click to toggle visibility" : "Restricted Access"}
        >
            <span style={{ 
                fontFamily: isVisible ? 'inherit' : 'monospace',
                letterSpacing: isVisible ? 'normal' : '2px',
                background: isVisible ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
                padding: isVisible ? '0' : '2px 6px',
                borderRadius: '4px',
                color: isVisible ? 'inherit' : '#3b82f6',
                fontWeight: isVisible ? 'inherit' : 'bold'
            }}>
                {isVisible ? value : maskedValue}
            </span>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                {isVisible ? '🔓' : '🔒'}
            </span>
        </span>
    );
};

export default DataMask;
