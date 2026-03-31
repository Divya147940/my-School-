import React, { useState } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';

const BusJourney = () => {
    const [speed, setSpeed] = useState(0);
    const [obstacle, setObstacle] = useState(null);

    const speak = (msg) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.pitch = 1.9;
        utter.rate = 1.1;
        synth.speak(utter);
    };

    const handleIdentify = (item) => {
        speak(`Sahi pehchana! Ye hai ${item}!`);
        setObstacle(null);
    };

    const obstacles = [
        { i: '🚦', n: 'Signal' },
        { i: '🐄', n: 'Gai (Cow)' },
        { i: '🌴', n: 'Ped (Tree)' },
        { i: '🏫', n: 'School' }
    ];

    const generateObstacle = () => {
        const obs = obstacles[Math.floor(Math.random() * obstacles.length)];
        setObstacle(obs);
        speak(`Dekho! Raste mein kya hai? Pehchano!`);
    };

    return (
        <div className="bus-journey-container" style={{ textAlign: 'center', padding: '20px', background: '#3b82f6', borderRadius: '40px', minHeight: '600px', overflow: 'hidden', position: 'relative' }}>
            <JuniorDashboardAnimations />
            <h1 className="anim-glow" style={{ color: '#fff', fontSize: '3rem', marginBottom: '60px' }}>🚌 School Bus Journey</h1>

            {/* Road Animation */}
            <div className="road" style={{ height: '300px', background: '#334155', position: 'relative', marginTop: '100px', borderTop: '5px solid #fff', borderBottom: '5px solid #fff' }}>
                <div style={{ position: 'absolute', top: '50%', width: '100%', height: '10px', background: 'repeating-linear-gradient(90deg, #fff, #fff 50px, transparent 50px, transparent 100px)', animation: speed > 0 ? 'moveRoad 1s linear infinite' : 'none' }} />
                
                {/* School Bus */}
                <div style={{ position: 'absolute', bottom: '50px', left: '20%', fontSize: '10rem' }} className={speed > 0 ? 'anim-bounce' : ''}>
                    🚌
                    <div style={{ position: 'absolute', top: '20px', left: '40px', fontSize: '2rem' }}>👦👧</div>
                </div>

                {/* Obstacle */}
                {obstacle && (
                    <div 
                        style={{ position: 'absolute', bottom: '80px', right: '10%', fontSize: '8rem', cursor: 'pointer' }} 
                        className="anim-wiggle"
                        onClick={() => handleIdentify(obstacle.n)}
                    >
                        {obstacle.i}
                    </div>
                )}
            </div>

            <div className="controls" style={{ marginTop: '40px', display: 'flex', gap: '30px', justifyContent: 'center' }}>
                <button className="magic-btn" onClick={() => { setSpeed(1); speak("Chalo school chalein! Vroom vroom!"); }}>🚀 Start Bus</button>
                <button className="magic-btn" style={{ background: '#f43f5e' }} onClick={() => { setSpeed(0); speak("Ruk jao! Stop!"); }}>🛑 Stop Bus</button>
                <button className="magic-btn" style={{ background: '#fbbf24', color: '#000' }} onClick={generateObstacle}>🧐 Kya dikha?</button>
            </div>

            <style>{`
                @keyframes moveRoad {
                    from { background-position: 100px 0; }
                    to { background-position: 0 0; }
                }
                .magic-btn {
                    padding: 20px 40px;
                    border-radius: 25px;
                    background: #22c55e;
                    color: white;
                    border: none;
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default BusJourney;
