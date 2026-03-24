import React, { useState, useEffect, useRef } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorActivityCenter.css';

const JuniorBabyWorld = () => {
    const [activeGame, setActiveGame] = useState('elephant'); // elephant, balloons, bubbles, animals, piano
    const [elephantIndex, setElephantIndex] = useState(0);
    const [balloons, setBalloons] = useState([]);
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);

    // Speech & Sound
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.5;
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    };

    const playSound = (type) => {
        const sounds = {
            pop: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
            bubble: 'https://www.soundjay.com/misc/sounds/bubble-gum-pop-01.mp3',
            meow: 'https://www.soundjay.com/human/sounds/baby-giggle-01.mp3', // placeholder for animal
        };
        new Audio(sounds[type] || sounds.pop).play().catch(() => {});
    };

    const bubblePopSound = 'https://www.soundjay.com/misc/sounds/bubble-gum-pop-01.mp3';

    // --- Alphabet Data ---
    const alphabet = [
        { l: 'A', w: 'Apple', e: '🍎' }, { l: 'B', w: 'Ball', e: '⚽' }, { l: 'C', w: 'Cat', e: '🐱' },
        { l: 'D', w: 'Dog', e: '🐶' }, { l: 'E', w: 'Elephant', e: '🐘' }, { l: 'F', w: 'Fish', e: '🐟' },
        { l: 'G', w: 'Grapes', e: '🍇' }, { l: 'H', w: 'Hat', e: '🎩' }, { l: 'I', w: 'Ice Cream', e: '🍦' },
        { l: 'J', w: 'Jug', e: '🏺' }, { l: 'K', w: 'Kite', e: '🪁' }, { l: 'L', w: 'Lion', e: '🦁' },
        { l: 'M', w: 'Monkey', e: '🐵' }, { l: 'N', w: 'Nest', e: '🪹' }, { l: 'O', w: 'Orange', e: '🍊' },
        { l: 'P', w: 'Peacock', e: '🦚' }, { l: 'Q', w: 'Queen', e: '👸' }, { l: 'R', w: 'Rabbit', e: '🐰' },
        { l: 'S', w: 'Sun', e: '☀️' }, { l: 'T', w: 'Tiger', e: '🐅' }, { l: 'U', w: 'Umbrella', e: '☂️' },
        { l: 'V', w: 'Van', e: '🚐' }, { l: 'W', w: 'Watch', e: '⌚' }, { l: 'X', w: 'Xylophone', e: '🎹' },
        { l: 'Y', w: 'Yo-Yo', e: '🪀' }, { l: 'Z', w: 'Zebra', e: '🦓' }
    ];

    const nextElephant = () => {
        const nextIdx = (elephantIndex + 1) % alphabet.length;
        setElephantIndex(nextIdx);
        speak(`${alphabet[nextIdx].l} for ${alphabet[nextIdx].w}`);
        playSound('pop');
    };

    const prevElephant = () => {
        const prevIdx = (elephantIndex - 1 + alphabet.length) % alphabet.length;
        setElephantIndex(prevIdx);
        speak(`${alphabet[prevIdx].l} for ${alphabet[prevIdx].w}`);
        playSound('pop');
    };

    // --- Balloon Game (ABC) ---
    const spawnBalloon = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const colors = ['#ff4d4d', '#ffcc00', '#33ccff', '#ff66ff', '#00ff99'];
        const newBalloon = {
            id: Date.now() + Math.random(),
            letter,
            color: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 80 + 10,
            bottom: -100,
            speed: Math.random() * 2 + 1
        };
        setBalloons(prev => [...prev.slice(-15), newBalloon]);
    };

    useEffect(() => {
        if (activeGame === 'balloons') {
            const interval = setInterval(spawnBalloon, 2000);
            return () => clearInterval(interval);
        }
    }, [activeGame]);

    useEffect(() => {
        const moveInterval = setInterval(() => {
            setBalloons(prev => prev.map(b => ({ ...b, bottom: b.bottom + b.speed })).filter(b => b.bottom < 110));
            setBubbles(prev => prev.map(b => ({ ...b, bottom: b.bottom + b.speed })).filter(b => b.bottom < 110));
        }, 30);
        return () => clearInterval(moveInterval);
    }, []);

    // --- Bubble Game (123) ---
    const spawnBubble = () => {
        const num = Math.floor(Math.random() * 10) + 1;
        const newBubble = {
            id: Date.now() + Math.random(),
            num,
            left: Math.random() * 80 + 10,
            bottom: -100,
            speed: Math.random() * 1.5 + 0.5,
            size: Math.random() * 50 + 80
        };
        setBubbles(prev => [...prev.slice(-20), newBubble]);
    };

    useEffect(() => {
        if (activeGame === 'bubbles') {
            const interval = setInterval(spawnBubble, 1500);
            return () => clearInterval(interval);
        }
    }, [activeGame]);

    const popBalloon = (id, letter) => {
        playSound('pop');
        speak(`${letter}!`);
        setBalloons(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 5);
    };

    const popBubble = (id, num) => {
        playSound('bubble');
        speak(`${num}`);
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 5);
    };

    return (
        <div className="junior-activity-center" style={{ minHeight: '90vh', background: '#020617', padding: '20px', overflow: 'hidden', position: 'relative' }}>
            <JuniorDashboardAnimations />

            <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '2rem', color: '#fff', zIndex: 100 }}>
                🍼 Baby Hub • XP: {score}
            </div>

            <nav style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveGame('elephant')} style={{ padding: '20px 40px', borderRadius: '30px', fontSize: '1.5rem', background: activeGame === 'elephant' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>🐘 Hathi ABC</button>
                <button onClick={() => setActiveGame('balloons')} style={{ padding: '20px 40px', borderRadius: '30px', fontSize: '1.5rem', background: activeGame === 'balloons' ? '#ff4d4d' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>🎈 Balloon Pop</button>
                <button onClick={() => setActiveGame('bubbles')} style={{ padding: '20px 40px', borderRadius: '30px', fontSize: '1.5rem', background: activeGame === 'bubbles' ? '#33ccff' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>🫧 123 Bubbles</button>
                <button onClick={() => setActiveGame('animals')} style={{ padding: '20px 40px', borderRadius: '30px', fontSize: '1.5rem', background: activeGame === 'animals' ? '#ffcc00' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>🐾 Animal Fun</button>
                <button onClick={() => setActiveGame('piano')} style={{ padding: '20px 40px', borderRadius: '30px', fontSize: '1.5rem', background: activeGame === 'piano' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>🎹 Magic Piano</button>
            </nav>

            <div className="glass-panel" style={{ height: '70vh', position: 'relative', overflow: 'hidden', borderRadius: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {activeGame === 'elephant' && (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginBottom: '40px' }}>
                            <div style={{ fontSize: '15rem', textShadow: '0 0 30px rgba(139,92,246,0.5)', color: '#fff' }}>{alphabet[elephantIndex].l}</div>
                            <div style={{ fontSize: '12rem', animation: 'float 3s infinite ease-in-out' }}>🐘</div>
                        </div>
                        <div style={{ fontSize: '4rem', color: '#fbbf24', marginBottom: '50px' }}>
                            {alphabet[elephantIndex].w} {alphabet[elephantIndex].e}
                        </div>
                        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
                            <button onClick={prevElephant} style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', fontSize: '3rem', color: '#fff', cursor: 'pointer' }}>⬅️</button>
                            <button onClick={nextElephant} style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#8b5cf6', border: 'none', fontSize: '4rem', color: '#fff', cursor: 'pointer', boxShadow: '0 10px 30px rgba(139,92,246,0.4)' }}>➡️</button>
                        </div>
                        <div style={{ marginTop: '30px', color: 'rgba(255,255,255,0.4)' }}>{elephantIndex + 1} / 26</div>
                    </div>
                )}

                {activeGame === 'balloons' && balloons.map(b => (
                    <div 
                        key={b.id} 
                        onClick={() => popBalloon(b.id, b.letter)}
                        style={{ 
                            position: 'absolute', left: `${b.left}%`, bottom: `${b.bottom}%`, 
                            width: '120px', height: '150px', background: b.color, 
                            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '4rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer',
                            boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.2)',
                            transition: 'transform 0.1s'
                        }}
                    >
                        {b.letter}
                        <div style={{ position: 'absolute', bottom: '-40px', width: '2px', height: '40px', background: 'rgba(255,255,255,0.5)' }}></div>
                    </div>
                ))}

                {activeGame === 'bubbles' && bubbles.map(b => (
                    <div 
                        key={b.id} 
                        onClick={() => popBubble(b.id, b.num)}
                        style={{ 
                            position: 'absolute', left: `${b.left}%`, bottom: `${b.bottom}%`, 
                            width: `${b.size}px`, height: `${b.size}px`, 
                            background: 'rgba(51, 204, 255, 0.2)', 
                            border: '2px solid rgba(255,255,255,0.5)',
                            borderRadius: '50%', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '3rem', color: '#fff', cursor: 'pointer',
                            backdropFilter: 'blur(5px)',
                            boxShadow: '0 0 20px rgba(51, 204, 255, 0.4)'
                        }}
                    >
                        {b.num}
                    </div>
                ))}

                {activeGame === 'animals' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', padding: '40px' }}>
                        {[
                            { n: 'Lion', s: 'Roar!', e: '🦁' },
                            { n: 'Cow', s: 'Moo!', e: '🐄' },
                            { n: 'Cat', s: 'Meow!', e: '🐱' },
                            { n: 'Dog', s: 'Woof!', e: '🐶' },
                            { n: 'Duck', s: 'Quack!', e: '🦆' },
                            { n: 'Elephant', s: 'Pawoo!', e: '🐘' }
                        ].map(a => (
                            <div key={a.n} onClick={() => { speak(a.n); playSound('pop'); alert(`${a.e} says ${a.s}`); }} className="card-vibe" style={{ padding: '30px', borderRadius: '40px', background: 'rgba(255,255,255,0.05)', textAlign: 'center', cursor: 'pointer' }}>
                                <div style={{ fontSize: '6rem' }}>{a.e}</div>
                                <h3 style={{ color: '#fff', fontSize: '2rem' }}>{a.n}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {activeGame === 'piano' && (
                    <div style={{ display: 'flex', height: '100%', padding: '20px', gap: '10px' }}>
                        {[
                            { c: '#ff4d4d', n: 'Do' }, { c: '#ff9933', n: 'Re' }, { c: '#ffcc00', n: 'Mi' },
                            { c: '#33cc33', n: 'Fa' }, { c: '#33ccff', n: 'So' }, { c: '#3366ff', n: 'La' },
                            { c: '#8b5cf6', n: 'Ti' }, { c: '#ff66ff', n: 'Do' }
                        ].map(k => (
                            <div key={k.n} onClick={() => { playSound('pop'); speak(k.n); }} style={{ flex: 1, background: k.c, borderRadius: '20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '40px', fontSize: '2rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer', border: '5px solid rgba(0,0,0,0.1)', boxShadow: '0 10px 0 rgba(0,0,0,0.2)' }}>
                                {k.n}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JuniorBabyWorld;
