import React, { useState, useRef, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const MagicColorBook = () => {
    const canvasRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('#f43f5e');

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        // Draw a simple shape (e.g., an Apple)
        ctx.beginPath();
        ctx.arc(200, 200, 100, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(200, 100);
        ctx.lineTo(220, 50);
        ctx.stroke();
    }, []);

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple "Magic Fill" logic: draw a large circle at click
        ctx.fillStyle = selectedColor;
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.fill();
        speak("Sunder color! Wow!");
    };

    return (
        <div className="color-book-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#ec4899', fontSize: '3rem', marginBottom: '40px' }}>🖌️ Magic Coloring Book</h1>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '40px', display: 'inline-block' }}>
                <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    {['#f43f5e', '#3b82f6', '#fbbf24', '#22c55e', '#a855f7', '#000'].map(c => (
                        <div 
                            key={c} 
                            onClick={() => setSelectedColor(c)} 
                            style={{ 
                                width: '50px', 
                                height: '50px', 
                                background: c, 
                                borderRadius: '50%', 
                                cursor: 'pointer',
                                border: selectedColor === c ? '5px solid #fff' : 'none',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }} 
                        />
                    ))}
                    <button className="magic-btn" onClick={() => {
                        const ctx = canvasRef.current.getContext('2d');
                        ctx.clearRect(0, 0, 400, 400);
                        ctx.beginPath();
                        ctx.arc(200, 200, 100, 0, Math.PI * 2);
                        ctx.stroke();
                    }}>Clear</button>
                </div>
                <canvas 
                    ref={canvasRef} 
                    width={400} 
                    height={400} 
                    onClick={handleCanvasClick}
                    style={{ background: '#fff', borderRadius: '20px', cursor: 'crosshair', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }} 
                />
            </div>
            <p style={{ marginTop: '20px', fontSize: '1.5rem' }}>Shape mein touch karo aur magic dekho! ✨</p>

            <style>{`
                .magic-btn {
                    padding: 10px 25px;
                    border-radius: 15px;
                    background: #374151;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                }
            `}</style>
        </div>
    );
};

export default MagicColorBook;
