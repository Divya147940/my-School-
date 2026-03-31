import React, { useState } from 'react';

const SafeImage = ({ src, fallback = '👤', alt, className, style }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`image-fallback ${className}`} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '50%',
                fontSize: '1.5rem',
                ...style 
            }}>
                {fallback}
            </div>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={className} 
            style={style} 
            onError={() => setError(true)} 
        />
    );
};

export default SafeImage;
