import React, { useState, useEffect, useRef } from 'react';
import './JuniorCartoonWorld.css';

const JuniorCartoonWorld = () => {
    const [activeWorld, setActiveWorld] = useState(null);
    const [score, setScore] = useState(0);
    const [sparkles, setSparkles] = useState([]);
    const audioRef = useRef(null);

    const playSound = (type) => {
        const sounds = {
            sparkle: 'https://assets.mixkit.co/active_storage/sfx/2558/2558-preview.mp3',
            pop: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
            rocket: 'https://assets.mixkit.co/active_storage/sfx/2522/2522-preview.mp3',
            magic: 'https://assets.mixkit.co/active_storage/sfx/2559/2559-preview.mp3'
        };
        if (audioRef.current) {
            audioRef.current.src = sounds[type] || sounds.sparkle;
            audioRef.current.play().catch(e => console.log('Audio wait'));
        }
    };

    const worlds = [
        { id: 'space', name: 'Space Voyage', icon: '🚀', color: '#1e293b', desc: 'Solve math to fly!' },
        { id: 'puppet', name: 'Puppet Theatre', icon: '🎭', color: '#ef4444', desc: 'Pull the strings!' },
        { id: 'kitchen', name: 'Magic Kitchen', icon: '🧁', color: '#fbbf24', desc: 'Bake a cake!' },
        { id: 'train', name: 'Alpha Train', icon: '🚂', color: '#10b981', desc: 'Chug along A-Z!' },
        { id: 'dino', name: 'Dino Park', icon: '🦖', color: '#8b5cf6', desc: 'Roar with Dinos!' },
        { id: 'rainbow', name: 'Rainbow Canvas', icon: '🌈', color: '#ec4899', desc: 'Paint with magic!' },
        { id: 'castle', name: 'Poem Castle', icon: '🏰', color: '#3b82f6', desc: 'Rhyme in the castle!' },
        { id: 'pilot', name: 'Cloud Pilot', icon: '🚁', color: '#06b6d4', desc: 'Fly in the clouds!' },
        { id: 'science', name: 'Science Lab', icon: '🧲', color: '#6366f1', desc: 'Bubbles & Sparks!' },
        { id: 'carnival', name: 'Word Ferris Wheel', icon: '🎡', color: '#f59e0b', desc: 'Carnival of words!' }
    ];

    const renderWorld = () => {
        switch(activeWorld) {
            case 'space': return <SpaceVoyage onScore={() => setScore(s => s + 10)} />;
            case 'puppet': return <PuppetTheatre />;
            case 'kitchen': return <MagicKitchen />;
            case 'train': return <AlphaTrain />;
            case 'dino': return <DinoPark />;
            case 'rainbow': return <RainbowCanvas />;
            case 'castle': return <PoemCastle />;
            case 'pilot': return <CloudPilot />;
            case 'science': return <ScienceLab />;
            case 'carnival': return <WordFerrisWheel />;
            default: return null;
        }
    };

    return (
        <div 
            className="cartoon-world-root"
            onMouseMove={(e) => {
                if (Math.random() > 0.8) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const newSparkle = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
                    setSparkles(prev => [...prev.slice(-10), newSparkle]);
                    setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== newSparkle.id)), 800);
                }
            }}
        >
            {sparkles.map(s => (
                <div key={s.id} className="magic-sparkle" style={{ left: s.x, top: s.y }}>✨</div>
            ))}
            <audio ref={audioRef} />
            
            {/* Background Parallax */}
            <div className="cartoon-bg-layer clouds-layer"></div>
            <div className="cartoon-bg-layer hills-layer"></div>
            
            <div className="sun-glow">🌞</div>

            <div style={{ position: 'relative', zIndex: 10, padding: '40px' }}>
                {!activeWorld ? (
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                            Welcome to Cartoon World! ✨
                        </h1>
                        <p style={{ fontSize: '1.5rem', color: '#fff', opacity: 0.9, marginBottom: '40px' }}>
                            Choose a magical world to explore!
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {worlds.map(w => (
                                <div 
                                    key={w.id} 
                                    className="magic-hover-card"
                                    onClick={() => { setActiveWorld(w.id); playSound('magic'); }}
                                >
                                    <div className="magic-icon" style={{ fontSize: '4rem', marginBottom: '15px' }}>{w.icon}</div>
                                    <h3 style={{ fontSize: '1.5rem', color: w.color }}>{w.name}</h3>
                                    <p style={{ opacity: 0.7 }}>{w.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <button 
                            onClick={() => setActiveWorld(null)}
                            style={{ 
                                padding: '10px 25px', borderRadius: '15px', background: 'white', color: '#334155', 
                                border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            🏠 Back to Hub
                        </button>
                        
                        <div className="world-container magic-reveal" style={{ 
                            background: 'white', borderRadius: '40px', padding: '40px', 
                            minHeight: '500px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {renderWorld()}
                        </div>
                    </div>
                )}
            </div>

            {/* Score Badge */}
            <div style={{ 
                position: 'fixed', bottom: '30px', right: '30px', 
                padding: '15px 30px', borderRadius: '30px', background: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100,
                display: 'flex', alignItems: 'center', gap: '10px'
            }}>
                <span style={{ fontSize: '1.5rem' }}>⭐ Stars:</span>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{score}</span>
            </div>
        </div>
    );
};

// --- Sub-Components for 10 Worlds ---

const SpaceVoyage = ({ onScore }) => {
    const [problem, setProblem] = useState({ a: 2, b: 3, ans: 5 });
    const [rocketPos, setRocketPos] = useState(0);

    const generate = () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        setProblem({ a, b, ans: a + b });
    };

    return (
        <div style={{ textAlign: 'center', color: '#1e293b' }}>
            <div style={{ fontSize: '6rem', margin: '40px 0' }} className="anim-rocket">🚀</div>
            <h2 style={{ fontSize: '2.5rem' }}>{problem.a} + {problem.b} = ?</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                {[problem.ans, problem.ans + 1, problem.ans - 1].sort().map(n => (
                    <button 
                        key={n}
                        onClick={() => {
                            if (n === problem.ans) {
                                onScore();
                                setRocketPos(prev => prev + 50);
                                generate();
                            }
                        }}
                        style={{ padding: '20px 40px', borderRadius: '20px', fontSize: '2rem', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
};

const PuppetTheatre = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    return (
        <div 
            style={{ height: '400px', border: '10px solid #ef4444', borderRadius: '20px', position: 'relative', overflow: 'hidden', background: '#450a0a' }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPos({ x: e.clientX - rect.left - 50, y: e.clientY - rect.top - 50 });
            }}
        >
            <div style={{ 
                position: 'absolute', left: pos.x, top: pos.y, 
                fontSize: '8rem', transition: 'all 0.1s linear',
                filter: 'drop-shadow(0 20px 10px rgba(0,0,0,0.5))'
            }}>
                🤡
            </div>
            <div style={{ position: 'absolute', top: 0, left: pos.x + 50, width: '4px', height: pos.y, background: '#fff', opacity: 0.3 }} />
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: 'white', opacity: 0.5 }}>
                Move mouse to dance with the puppet!
            </div>
        </div>
    );
};

const MagicKitchen = () => {
    const [step, setStep] = useState(0);
    const steps = ['Mixing Eggs...', 'Adding Flour...', 'Whisking Magic!', 'Baking...', 'CUPCAKE DONE! 🧁'];
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '8rem', marginBottom: '30px' }}>
                {step === 0 && '🥚'}
                {step === 1 && '🌾'}
                {step === 2 && '🥣'}
                {step === 3 && <span className="anim-steam">♨️</span>}
                {step === 4 && <span className="anim-dino">🧁</span>}
            </div>
            <h2 style={{ fontSize: '2.5rem', color: '#f97316' }}>{steps[step]}</h2>
            <button 
                onClick={() => setStep(s => (s + 1) % 5)}
                style={{ padding: '20px 50px', borderRadius: '25px', background: '#fbbf24', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer' }}
            >
                {step === 4 ? 'Bake Again' : 'Mix Next Magic'}
            </button>
        </div>
    );
};

const AlphaTrain = () => {
    const [letter, setLetter] = useState('A');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (
        <div style={{ overflow: 'hidden', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', animation: 'moveHills 10s infinite linear' }}>
                <div className="anim-train" style={{ fontSize: '10rem', display: 'flex', alignItems: 'center' }}>
                    🚂
                    <div style={{ background: '#3b82f6', width: '150px', height: '150px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '6rem', marginLeft: '-20px' }}>
                        {letter}
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '40px' }}>
                {alphabet.map(l => (
                    <button key={l} onClick={() => setLetter(l)} style={{ width: '50px', height: '50px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>{l}</button>
                ))}
            </div>
        </div>
    );
};

const DinoPark = () => {
    const [dino, setDino] = useState('🦖');
    return (
        <div style={{ textAlign: 'center', padding: '40px', background: 'linear-gradient(to bottom, #ecfdf5, #d1fae5)', borderRadius: '30px' }}>
            <div className="anim-dino" style={{ fontSize: '12rem', cursor: 'pointer' }} onClick={() => {
                const u = new SpeechSynthesisUtterance("ROARRRR!"); u.pitch = 0.5; window.speechSynthesis.speak(u);
            }}>
                {dino}
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                {['🦖', '🦕', '🐊', '🐢'].map(d => (
                    <button key={d} onClick={() => setDino(d)} style={{ fontSize: '3rem', padding: '10px', borderRadius: '15px', border: 'none', background: 'white' }}>{d}</button>
                ))}
            </div>
        </div>
    );
};

const RainbowCanvas = () => {
    const [color, setColor] = useState('red');
    const [dots, setDots] = useState([]);
    return (
        <div 
            style={{ height: '400px', background: '#f8fafc', borderRadius: '20px', cursor: 'crosshair', position: 'relative' }}
            onMouseMove={(e) => {
                if (e.buttons !== 1) return;
                const rect = e.currentTarget.getBoundingClientRect();
                setDots(prev => [...prev.slice(-50), { x: e.clientX - rect.left, y: e.clientY - rect.top, c: color }]);
            }}
        >
            {dots.map((d, i) => (
                <div key={i} style={{ position: 'absolute', left: d.x, top: d.y, width: '20px', height: '20px', borderRadius: '50%', background: d.c, opacity: 0.5 }} />
            ))}
            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '5px' }}>
                {['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map(c => (
                    <button key={c} onClick={() => setColor(c)} style={{ width: '30px', height: '30px', background: c, borderRadius: '50%', border: '2px solid white' }} />
                ))}
            </div>
            <p style={{ position: 'absolute', bottom: '10px', width: '100%', textAlign: 'center', opacity: 0.3 }}>Click and drag to paint magic!</p>
        </div>
    );
};

const PoemCastle = () => {
    const poems = [
        { t: 'Twinkle Twinkle', e: '⭐', p: 'Twinkle twinkle little star, how I wonder what you are!' },
        { t: 'Baa Baa Black Sheep', e: '🐑', p: 'Baa baa black sheep, have you any wool?' },
        { t: 'Rain Rain Go Away', e: '🌧️', p: 'Rain rain go away, come again another day!' }
    ];
    const [idx, setIdx] = useState(0);
    return (
        <div style={{ textAlign: 'center', color: '#1e3a8a' }}>
            <div style={{ fontSize: '8rem', transition: 'all 0.5s' }} className="anim-dino">{poems[idx].e}</div>
            <h2 style={{ fontSize: '2rem', margin: '20px 0' }}>{poems[idx].t}</h2>
            <div style={{ background: '#eff6ff', padding: '30px', borderRadius: '20px', fontSize: '1.2rem', fontStyle: 'italic' }}>
                {poems[idx].p}
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                {poems.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: idx === i ? '#3b82f6' : '#dbeafe' }}>{i + 1}</button>
                ))}
            </div>
        </div>
    );
};

const CloudPilot = () => {
    const [hPos, setHPos] = useState({ x: 50, y: 50 });
    return (
        <div style={{ height: '400px', background: 'var(--cartoon-sky)', borderRadius: '20px', position: 'relative', overflow: 'hidden' }}>
            <div className="cartoon-bg-layer clouds-layer"></div>
            <div style={{ 
                position: 'absolute', left: `${hPos.x}%`, top: `${hPos.y}%`, 
                fontSize: '6rem', transform: 'translate(-50%, -50%)', transition: 'all 0.5s' 
            }}>
                🚁
            </div>
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => setHPos(p => ({ ...p, x: Math.max(0, p.x-10) }))}>⬅️</button>
                <button onClick={() => setHPos(p => ({ ...p, y: Math.max(0, p.y-10) }))}>⬆️</button>
                <button onClick={() => setHPos(p => ({ ...p, y: Math.min(100, p.y+10) }))}>⬇️</button>
                <button onClick={() => setHPos(p => ({ ...p, x: Math.min(100, p.x+10) }))}>➡️</button>
            </div>
        </div>
    );
};

const ScienceLab = () => {
    const [effect, setEffect] = useState(null);
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {effect === 'bubbles' && <div style={{ fontSize: '5rem', animation: 'moveClouds 2s infinite' }}>🫧🫧🫧</div>}
                {effect === 'sparks' && <div style={{ fontSize: '5rem', animation: 'bouncePop 0.5s infinite' }}>⚡✨🔥</div>}
                {effect === 'magnet' && <div style={{ fontSize: '8rem' }}>🧲 📎📎📎</div>}
                {!effect && <div style={{ fontSize: '8rem' }}>🧪</div>}
            </div>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                <button onClick={() => setEffect('bubbles')} style={{ padding: '15px 30px', borderRadius: '15px', background: '#06b6d4', color: 'white', border: 'none' }}>Bubbles</button>
                <button onClick={() => setEffect('sparks')} style={{ padding: '15px 30px', borderRadius: '15px', background: '#f59e0b', color: 'white', border: 'none' }}>Sparks</button>
                <button onClick={() => setEffect('magnet')} style={{ padding: '15px 30px', borderRadius: '15px', background: '#3b82f6', color: 'white', border: 'none' }}>Magnet</button>
            </div>
        </div>
    );
};

const WordFerrisWheel = () => {
    const words = ['Apple', 'Ball', 'Cat', 'Dog', 'Egg', 'Fish', 'Goat', 'Hat'];
    const [rot, setRot] = useState(0);
    return (
        <div style={{ textAlign: 'center', height: '450px', position: 'relative' }}>
            <div style={{ 
                width: '300px', height: '300px', border: '8px solid #f59e0b', borderRadius: '50%',
                margin: '0 auto', position: 'relative', transform: `rotate(${rot}deg)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {words.map((w, i) => (
                    <div key={w} style={{ 
                        position: 'absolute', top: '50%', left: '50%', 
                        transform: `rotate(${i * 45}deg) translateY(-140px) rotate(-${i * 45 + rot}deg)`,
                        background: 'white', padding: '10px', borderRadius: '10px', border: '2px solid #f59e0b',
                        fontWeight: 'bold', minWidth: '60px'
                    }}>
                        {w}
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setRot(r => r + 45)}
                style={{ padding: '15px 40px', background: '#f59e0b', border: 'none', borderRadius: '20px', color: 'white', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer' }}
            >
                Spin the Wheel! 🎡
            </button>
        </div>
    );
};

export default JuniorCartoonWorld;
