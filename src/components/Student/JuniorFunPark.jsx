import React, { useState, useRef, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorFunPark.css';

const JuniorFunPark = () => {
    const [activeSection, setActiveSection] = useState('menu');
    const [score, setScore] = useState(0);
    const [confetti, setConfetti] = useState(false);

    // Habitat Matcher State
    const [habitatTarget, setHabitatTarget] = useState({ name: 'Forest', icon: '🌲', animals: ['🦁', '🐯', '🐒'] });
    const [habitatOptions, setHabitatOptions] = useState(['🦁', '🐯', '🐒', '🐬', '🐋', '🐪', '🦅']);
    
    // Flower Garden State
    const [garden, setGarden] = useState(Array(6).fill({ bloomed: false, flower: '🌱', name: '' }));

    // Star Sky State
    const [stars, setStars] = useState([]);
    const [connectedStars, setConnectedStars] = useState([]);

    // Mirror State
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [emojiSticker, setEmojiSticker] = useState('👑');

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.5;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const triggerWin = () => {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
    };

    // Camera Access for Emoji Mirror
    const startCamera = async () => {
        try {
            const s = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(s);
            if (videoRef.current) videoRef.current.srcObject = s;
            speak("Look! It's you on the magic mirror!");
        } catch (err) {
            console.error("Camera error:", err);
            alert("Please allow camera access for the Magic Mirror!");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (activeSection === 'mirror') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [activeSection]);

    // Star Initialization
    useEffect(() => {
        if (activeSection === 'stars') {
            const newStars = Array(10).fill(0).map((_, i) => ({
                id: i,
                x: Math.random() * 80 + 10,
                y: Math.random() * 70 + 15,
                active: false
            }));
            setStars(newStars);
            setConnectedStars([]);
            speak("Connect the twinkling stars to make a shape!");
        }
    }, [activeSection]);

    const handleStarClick = (star) => {
        if (!connectedStars.includes(star.id)) {
            setConnectedStars(prev => [...prev, star.id]);
            setStars(prev => prev.map(s => s.id === star.id ? { ...s, active: true } : s));
            speak(`Star ${connectedStars.length + 1}!`);
            if (connectedStars.length === 9) {
                speak("Amazing! You made a constellation!");
                triggerWin();
                setScore(s => s + 100);
            }
        }
    };

    const handleFlowerClick = (index) => {
        if (!garden[index].bloomed) {
            const flowers = [
                { f: '🌹', n: 'Rose' }, { f: '🌻', n: 'Sunflower' }, 
                { f: '🌷', n: 'Tulip' }, { f: '🌸', n: 'Cherry Blossom' },
                { f: '🌼', n: 'Daisy' }, { f: '🌺', n: 'Hibiscus' }
            ];
            const randomFlower = flowers[Math.floor(Math.random() * flowers.length)];
            const newGarden = [...garden];
            newGarden[index] = { bloomed: true, flower: randomFlower.f, name: randomFlower.n };
            setGarden(newGarden);
            speak(`Wow! A beautiful ${randomFlower.n} bloomed!`);
            setScore(s => s + 20);
            if (newGarden.every(f => f.bloomed)) {
                speak("Your garden is full of magic flowers!");
                triggerWin();
            }
        }
    };

    const handleHabitatChoice = (animal) => {
        if (habitatTarget.animals.includes(animal)) {
            speak(`Yes! ${animal} lives in the ${habitatTarget.name}!`);
            setScore(s => s + 50);
            triggerWin();
            // Next Round
            setTimeout(() => {
                const targets = [
                    { name: 'Water', icon: '🌊', animals: ['🐬', '🐋', '🐙'] },
                    { name: 'Desert', icon: '🏜️', animals: ['🐪', '🦎', '🦂'] },
                    { name: 'Sky', icon: '☁️', animals: ['🦅', '🦉', '🕊️'] },
                    { name: 'Ice', icon: '❄️', animals: ['🐻‍❄️', '🐧', '🦭'] }
                ];
                const next = targets[Math.floor(Math.random() * targets.length)];
                setHabitatTarget(next);
                setHabitatOptions([...next.animals, '🦁', '🐘', '🐎', '🐊'].sort(() => Math.random() - 0.5));
                speak(`Where does the ${next.name} animals live? Find them!`);
            }, 2000);
        } else {
            speak("Try again! Where does this animal live?");
        }
    };

    return (
        <div className="junior-fun-park">
            <JuniorDashboardAnimations />
            
            {activeSection !== 'menu' && (
                <button 
                    onClick={() => setActiveSection('menu')}
                    style={{ position: 'absolute', top: '20px', left: '20px', padding: '10px 20px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 10 }}
                >
                    ⬅️ Back to Mela
                </button>
            )}

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🎡 Bal Mela 🎡</h1>
                <div style={{ fontSize: '1.5rem', opacity: 0.8 }}>Magic Score: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{score}</span></div>
            </div>

            {activeSection === 'menu' && (
                <div className="park-grid">
                    <div className="park-card" onClick={() => { setActiveSection('habitat'); speak("Let's find animal homes!"); }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🦁🏠</div>
                        <h3>Animal Homes</h3>
                        <p>Help animals find where they live!</p>
                    </div>
                    <div className="park-card" onClick={() => { setActiveSection('garden'); speak("Let's plant magic flowers!"); }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌻✨</div>
                        <h3>Magic Garden</h3>
                        <p>Click the soil to grow beautiful flowers!</p>
                    </div>
                    <div className="park-card" onClick={() => { setActiveSection('mirror'); speak("Look at the magic mirror!"); }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🪞🪄</div>
                        <h3>Magic Mirror</h3>
                        <p>See yourself with fun magic stickers!</p>
                    </div>
                    <div className="park-card" onClick={() => { setActiveSection('stars'); speak("Connect the stars in the sky!"); }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>✨🌌</div>
                        <h3>Star Twinkle</h3>
                        <p>Join the stars to make magic shapes!</p>
                    </div>
                </div>
            )}

            {activeSection === 'habitat' && (
                <div className="park-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#8b5cf6' }}>Find the {habitatTarget.name} Animals! {habitatTarget.icon}</h2>
                    <div className="habitat-zone">
                        {habitatOptions.map((ani, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleHabitatChoice(ani)}
                                className="habitat-item"
                                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}
                            >
                                {ani}
                            </button>
                        ))}
                    </div>
                    <p style={{ marginTop: '30px', fontSize: '1.2rem' }}>Which of these live in the {habitatTarget.name}?</p>
                </div>
            )}

            {activeSection === 'garden' && (
                <div className="park-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#10b981' }}>My Magic Garden 🌱✨</h2>
                    <div className="flower-garden">
                        {garden.map((f, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleFlowerClick(i)}
                                className={`flower-pot ${f.bloomed ? 'bloomed' : ''}`}
                            >
                                {f.flower}
                                {f.bloomed && <div style={{ fontSize: '0.8rem', position: 'absolute', bottom: '10px' }}>{f.name}</div>}
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setGarden(Array(6).fill({ bloomed: false, flower: '🌱', name: '' }))}
                        style={{ marginTop: '30px', padding: '10px 25px', borderRadius: '15px', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Plant Again? 🔄
                    </button>
                </div>
            )}

            {activeSection === 'mirror' && (
                <div className="park-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#ec4899', marginBottom: '20px' }}>🪞 Magic Mirror 🪞</h2>
                    <div className="mirror-container">
                        <video ref={videoRef} autoPlay playsInline className="mirror-video" />
                        <div className="emoji-sticker" style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}>
                            {emojiSticker}
                        </div>
                    </div>
                    <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        {['👑', '🕶️', '🧚', '🐱', '🦋', '🎈'].map(e => (
                            <button 
                                key={e} 
                                onClick={() => { setEmojiSticker(e); speak("Magic sticker changed!"); }}
                                style={{ fontSize: '2.5rem', background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', borderRadius: '15px', padding: '10px' }}
                            >
                                {e}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'stars' && (
                <div className="park-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', color: '#fbbf24' }}>Connect the Stars! ✨🌌</h2>
                    <div className="star-sky">
                        {stars.map(s => (
                            <div 
                                key={s.id}
                                className={`star ${s.active ? 'active' : ''}`}
                                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                                onClick={() => handleStarClick(s)}
                            />
                        ))}
                    </div>
                    <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Connected: {connectedStars.length} / 10</p>
                </div>
            )}

            {confetti && (
                <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10rem', pointerEvents: 'none', zIndex: 100 }}>
                    🎉✨🧸
                </div>
            )}
        </div>
    );
};

export default JuniorFunPark;
