import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ScreenWatermark = () => {
    const { user } = useAuth();
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString());
            setOffset(prev => (prev + 1) % 100); // Subtle shift
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!user) return null;

    const watermarkText = `${user.name} | ${user.role} | 192.168.1.45 | ${time} | NSGI-SECURE-FORENSIC-TRACER`;

    return (
        <div className="nsgi-forensic-watermark" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 999999,
            overflow: 'hidden',
            opacity: 0.04,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            alignContent: 'space-around',
            userSelect: 'none',
            background: 'transparent'
        }}>
            {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{
                    transform: `rotate(-20deg) translate(${offset / 10}px, ${offset / 10}px)`,
                    whiteSpace: 'nowrap',
                    fontSize: '12px',
                    fontWeight: '900',
                    margin: '80px',
                    color: '#000',
                    fontFamily: 'monospace',
                    letterSpacing: '2px'
                }}>
                    {watermarkText}
                </div>
            ))}
        </div>
    );
};

export default ScreenWatermark;
