import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const EmojiMessenger = () => {
    const [sentEmoji, setSentEmoji] = useState(null);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const emojis = [
        { i: '👍', n: 'Thums Up', msg: "Mene teacher ko Thums Up bhej diya! Sahi hai!" },
        { i: '❤️', n: 'Pyar', msg: "Dher saara pyar bhej diya! ❤️" },
        { i: '🍕', n: 'Pizza', msg: "Mmm! Pizza party bhej di!" },
        { i: '🎮', n: 'Game', msg: "Chalo game khelte hain! Emoji bhej diya!" },
        { i: '🌈', n: 'Rainbow', msg: "Sunder Indra-dhanush bhej diya!" },
        { i: '🚀', n: 'Rocket', msg: "Rocket ki tarah message gaya! Shuuu!" }
    ];

    const handleSend = (e) => {
        setSentEmoji(e.i);
        speak(e.msg);
        setTimeout(() => setSentEmoji(null), 3000);
    };

    return (
        <div className="emoji-messenger-container" style={{ textAlign: 'center', padding: '20px' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#ec4899', fontSize: '3rem', marginBottom: '60px' }}>🤝 Junior Messenger</h1>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '40px', border: '2px solid #ec4899', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                <p style={{ fontSize: '1.8rem', marginBottom: '40px' }}>Apne friends ko magic emojis bhejo! ✨</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {emojis.map((e, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleSend(e)}
                            className="module-card anim-bounce"
                            style={{ 
                                padding: '30px', 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '25px', 
                                cursor: 'pointer',
                                fontSize: '5rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {e.i}
                        </div>
                    ))}
                </div>

                {sentEmoji && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '15rem', pointerEvents: 'none' }} className="anim-rotate">
                        {sentEmoji}
                        <div style={{ fontSize: '2rem', color: '#fff' }}>Message Sent! 🚀</div>
                    </div>
                )}
            </div>

            <style>{`
                .module-card:hover {
                    transform: scale(1.1);
                    background: rgba(236, 72, 153, 0.2);
                    box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);
                }
            `}</style>
        </div>
    );
};

export default EmojiMessenger;
