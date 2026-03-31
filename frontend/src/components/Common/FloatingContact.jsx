import React, { useState } from 'react';
import './FloatingContact.css';

const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const actions = [
        { icon: '📞', label: 'Call Us', href: 'tel:+919792799550', color: '#3b82f6' },
        { icon: '💬', label: 'WhatsApp', href: 'https://wa.me/919792799550', color: '#22c55e' },
        { icon: '📝', label: 'Admissions', href: '/admissions', color: '#8b5cf6' },
    ];

    return (
        <div className={`floating-contact-container ${isOpen ? 'open' : ''}`}>
            <div className="floating-menu">
                {actions.map((action, index) => (
                    <a
                        key={index}
                        href={action.href}
                        className="floating-action-item"
                        style={{ '--bg-color': action.color, '--delay': `${index * 0.1}s` }}
                        target={action.href.startsWith('http') ? '_blank' : '_self'}
                        rel="noreferrer"
                    >
                        <span className="action-label">{action.label}</span>
                        <span className="action-icon">{action.icon}</span>
                    </a>
                ))}
            </div>
            <button 
                className={`floating-main-btn ${isOpen ? 'active' : ''}`} 
                onClick={toggleMenu}
                aria-label="Contact Options"
            >
                <div className="btn-icon-wrapper">
                    <span className="icon-plus">+</span>
                    <span className="icon-msg">💬</span>
                </div>
            </button>
        </div>
    );
};

export default FloatingContact;
