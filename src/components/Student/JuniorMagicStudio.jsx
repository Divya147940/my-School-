import React, { useState, useRef, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import GamificationEngine from '../../utils/GamificationEngine';
import './JuniorMagicStudio.css';

const JuniorMagicStudio = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [floatingXPs, setFloatingXPs] = useState([]);
    
    // Module Specific States
    const [activePoem, setActivePoem] = useState(null);
    const [puzzleTask, setPuzzleTask] = useState(null);
    const [puzzleOptions, setPuzzleOptions] = useState([]);
    const [mathProblem, setMathProblem] = useState(null);
    const [mathGroups, setMathGroups] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [builtChars, setBuiltChars] = useState([]);
    const [mixedColor, setMixedColor] = useState(null);
    const [yogaPose, setYogaPose] = useState(null);
    const [rocketTarget, setRocketTarget] = useState(null);
    const [bholuOutfit, setBholuOutfit] = useState([]);
    const [weather, setWeather] = useState('sunny');
    const [foodFeedback, setFoodFeedback] = useState(null);

    // Glow Art State
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#8b5cf6');

    // Cartoon Voice Utility
    const speak = (text, isCartoon = true) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (v) utterance.voice = v;
        utterance.pitch = isCartoon ? 1.9 : 1.3;
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const playMagicSound = (type = 'chime') => {
        const sounds = {
            chime: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
            sparkle: 'https://www.soundjay.com/misc/sounds/sparkle-01.mp3',
            correct: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
            pop: 'https://www.soundjay.com/transparent-2.mp3'
        };
        const audio = new Audio(sounds[type] || sounds.chime);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    };

    const triggerWin = (xp = 100) => {
        setScore(s => s + 10);
        setShowConfetti(true);
        playMagicSound('correct');
        GamificationEngine.addXP(xp, `Magic Studio: ${activeSection}`);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // --- Module Data & Generators ---
    const MODULES = [
        { id: 'poems', icon: '📜', label: 'Poem Kingdom', color: '#8b5cf6' },
        { id: 'puzzles', icon: '🧩', label: 'Puzzle Palace', color: '#ec4899' },
        { id: 'art', icon: '✨', label: 'Glow Art', color: '#3b82f6' },
        { id: 'logic', icon: '🔍', label: 'Logic Land', color: '#10b981' },
        { id: 'math', icon: '➗', label: 'Math Magic', color: '#f59e0b' },
        { id: 'words', icon: '✍️', label: 'Word Builder', color: '#d946ef' },
        { id: 'colormix', icon: '🌈', label: 'Color Mix', color: '#f43f5e' },
        { id: 'yoga', icon: '🐘', label: 'Animal Yoga', color: '#22c55e' },
        { id: 'rocket', icon: '🚀', label: 'Rocket Phonics', color: '#6366f1' },
        { id: 'dressup', icon: '👗', label: 'Dress Bholu', color: '#f97316' },
        { id: 'garden', icon: '🎹', label: 'Sound Garden', color: '#4ade80' },
        { id: 'body', icon: '🕵️', label: 'Body Parts', color: '#06b6d4' },
        { id: 'weather', icon: '🌦️', label: 'Weather Wiz', color: '#3b82f6' },
        { id: 'food', icon: '🥗', label: 'Healthy Plate', color: '#fbbf24' },
        { id: 'clock', icon: '🕰️', label: 'Magic Clock', color: '#8b5cf6' }
    ];

    const generatePuzzle = () => {
        const items = [{ id: 1, n: 'Apple', i: '🍎' }, { id: 2, n: 'Bird', i: '🐦' }, { id: 3, n: 'Car', i: '🚗' }];
        const target = items[Math.floor(Math.random() * items.length)];
        setPuzzleTask(target);
        setPuzzleOptions([...items].sort(() => Math.random() - 0.5));
    };

    const generateMath = () => {
        const p = { total: 4, item: '🍪', div: 2, ans: 2 };
        setMathProblem(p);
        setMathGroups(new Array(p.div).fill(0));
    };

    const generateWord = () => {
        const words = [{ w: 'CAT', l: ['C', 'A', 'T'], e: '🐱' }, { w: 'DOG', l: ['D', 'O', 'G'], e: '🐶' }];
        const w = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(w);
        setBuiltChars([]);
    };

    // --- Glow Art Logic ---
    useEffect(() => {
        if (activeSection === 'art' && canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = canvas.offsetWidth;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineWidth = 10;
            ctx.shadowBlur = 15;
            ctxRef.current = ctx;
        }
    }, [activeSection]);

    const startDraw = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        if (!ctxRef.current) return;
        ctxRef.current.strokeStyle = brushColor;
        ctxRef.current.shadowColor = brushColor;
        ctxRef.current.beginPath(); ctxRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing || !ctxRef.current) return;
        const { offsetX, offsetY } = nativeEvent;
        ctxRef.current.lineTo(offsetX, offsetY); ctxRef.current.stroke();
    };

    const stopDraw = () => { if(ctxRef.current) ctxRef.current.closePath(); setIsDrawing(false); };

    // --- Render Helpers ---
    const renderHome = () => (
        <div className="module-grid">
            {MODULES.map(m => (
                <div key={m.id} className="module-card anim-bounce" onClick={() => { 
                    setActiveSection(m.id); 
                    speak(`Welcome to ${m.label}!`); 
                    if(m.id === 'puzzles') generatePuzzle();
                    if(m.id === 'math') generateMath();
                    if(m.id === 'words') generateWord();
                }}>
                    <span className="icon">{m.icon}</span>
                    <h3 style={{ color: m.color }}>{m.label}</h3>
                </div>
            ))}
        </div>
    );

    return (
        <div className="studio-root">
            <JuniorDashboardAnimations />
            
            <header className="studio-header">
                <h1 className="studio-title">Magic Studio ✨</h1>
                <div className="score-badge">⭐ {score} Stars</div>
            </header>

            {activeSection !== 'home' && (
                <button className="back-btn" onClick={() => setActiveSection('home')}>← Wapas Ghar Jao</button>
            )}

            <main className="glass-panel" style={{ padding: '40px', borderRadius: '40px' }}>
                {activeSection === 'home' && renderHome()}
                
                {activeSection === 'poems' && (
                    <div className="module-grid">
                        {[{t: 'Twinkle', i: '⭐', s: 'Twinkle twinkle little star!'}, {t: 'Baba Pink', i: '🐑', s: 'Baba baba pink sheep!'}].map(p => (
                            <div key={p.t} onClick={() => speak(p.s)} className="module-card">
                                <span className="icon">{p.i}</span>
                                <h3>{p.t}</h3>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'colormix' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Primary Colors Mix Karo! 🌈</h2>
                        <div className="color-mix-area">
                            <div className="color-drop" style={{ background: 'red' }} onClick={() => speak('Ye hai Laal rang!')}>🔴</div>
                            <div style={{ fontSize: '3rem' }}>+</div>
                            <div className="color-drop" style={{ background: 'blue' }} onClick={() => { setMixedColor('purple'); speak('Magic! Laal aur Neela ban gaya Baingani!'); triggerWin(); }}>🔵</div>
                        </div>
                        {mixedColor && <div className="mix-result anim-glow" style={{ background: mixedColor }}></div>}
                    </div>
                )}

                {activeSection === 'yoga' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Animal Yoga Time! 🐘</h2>
                        <div className="yoga-mascot anim-bounce">{yogaPose || '🐘'}</div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button className="magic-btn" onClick={() => { setYogaPose('🦒'); speak('Giraffe ki tarah lambe ho jao!'); }}>🦒 Giraffe Pose</button>
                            <button className="magic-btn" onClick={() => { setYogaPose('🦁'); speak('Lion ki tarah dahaado! Roarrr!'); }}>🦁 Lion Pose</button>
                        </div>
                    </div>
                )}

                {activeSection === 'rocket' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Rocket Phonics! 🚀</h2>
                        <div style={{ fontSize: '8rem', marginBottom: '30px' }} className="anim-bounce">🚀</div>
                        <p style={{ fontSize: '1.5rem' }}>Letter 'A' wale rocket ko pakdo!</p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {['A', 'B', 'C'].map(l => (
                                <button key={l} className="magic-btn" onClick={() => { 
                                    if(l === 'A') { speak('Sahi pakde! Blast off!'); triggerWin(); }
                                    else speak('Try again, Hero!');
                                }}>{l}</button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'weather' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Weather Wizard 🌦️</h2>
                        <div style={{ fontSize: '10rem', margin: '30px 0' }}>
                           {weather === 'sunny' ? '☀️' : weather === 'rainy' ? '🌧️' : '❄️'}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button className="magic-btn" onClick={() => { setWeather('sunny'); speak('Ah! It is so sunny and warm!'); }}>☀️ Sunny</button>
                            <button className="magic-btn" onClick={() => { setWeather('rainy'); speak('Watch out! It is raining!'); }}>🌧️ Rainy</button>
                            <button className="magic-btn" onClick={() => { setWeather('snow'); speak('Brrr! It is cold!'); }}>❄️ Snow</button>
                        </div>
                    </div>
                )}

                {activeSection === 'food' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Healthy vs Junk Food 🥗</h2>
                        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', margin: '40px 0' }}>
                            <div onClick={() => { speak('Yum yum! Seb sehat ke liye achha hai!'); triggerWin(); }} style={{ fontSize: '6rem', cursor: 'pointer' }}>🍎</div>
                            <div onClick={() => { speak('Oh no! Zyada candy nahi khani chahiye!'); }} style={{ fontSize: '6rem', cursor: 'pointer' }}>🍭</div>
                        </div>
                        <p>Healthy food par tap karo! ⭐</p>
                    </div>
                )}

                {activeSection === 'logic' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Logic Land! 🔍</h2>
                        <div style={{ fontSize: '6rem', margin: '40px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <span>🔴</span> <span>🔵</span> <span>🔴</span> <span style={{ borderBottom: '5px dashed #8b5cf6', width: '80px' }}>?</span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {['🔵', '⭐', '🌙'].map(l => (
                                <button key={l} className="magic-btn" style={{ fontSize: '3rem' }} onClick={() => {
                                    if(l === '🔵') { speak('Magic logic! You are right!'); triggerWin(); }
                                    else speak('Think again!');
                                }}>{l}</button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'dressup' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Dress Up Bholu! 👗</h2>
                        <div style={{ fontSize: '12rem', position: 'relative' }} className="anim-bounce">
                            🐻
                            <div style={{ position: 'absolute', top: '50px', left: '50%', transform: 'translateX(-50%)', fontSize: '5rem' }}>
                                {bholuOutfit.join('')}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
                            {['🎩', '👓', '🧣', '👑'].map(i => (
                                <button key={i} className="magic-btn" style={{ fontSize: '3rem' }} onClick={() => {
                                    setBholuOutfit([...bholuOutfit, i]);
                                    speak('Bholu looks so cool!');
                                    playMagicSound('pop');
                                }}>{i}</button>
                            ))}
                            <button className="magic-btn" onClick={() => setBholuOutfit([])}>Reset</button>
                        </div>
                    </div>
                )}

                {activeSection === 'garden' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Sound Garden! 🎹</h2>
                        <div className="module-grid">
                            {['🌸', '🌻', '🌵', '🍄', '🌳'].map((p, i) => (
                                <div key={i} className="module-card anim-wiggle" onClick={() => {
                                    const notes = ['C4', 'E4', 'G4', 'C5', 'A4'];
                                    speak('Ting!');
                                    playMagicSound('sparkle');
                                }}>
                                    <span className="icon">{p}</span>
                                    <p>Giggle!</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'body' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Body Parts Explorer! 🕵️</h2>
                        <div className="body-parts-map">
                            <div className="part-hotspot" style={{ top: '20px', left: '100px' }} onClick={() => speak('Ye hai Sir! Head!')}>Sir (Head)</div>
                            <div className="part-hotspot" style={{ top: '80px', left: '110px' }} onClick={() => speak('Ye hai Aankh! Eyes!')}>Aankh (Eyes)</div>
                            <div className="part-hotspot" style={{ top: '150px', left: '100px' }} onClick={() => speak('Ye hai Haath! Hands!')}>Haath (Hands)</div>
                            <div className="part-hotspot" style={{ top: '350px', left: '110px' }} onClick={() => speak('Ye hain Pair! Legs!')}>Pair (Legs)</div>
                        </div>
                    </div>
                )}

                {activeSection === 'clock' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2>Magic Clock! 🕰️</h2>
                        <div style={{ fontSize: '10rem' }} className="anim-wiggle">🕰️</div>
                        <div style={{ fontSize: '3rem', margin: '20px' }}>9:00 AM</div>
                        <p>School ka time ho gaya! Chalo school chalein!</p>
                        <button className="magic-btn" onClick={() => speak('Ab baje hain nau! Nine o clock!')}>Time Suno!</button>
                    </div>
                )}
            </main>

            {showConfetti && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', pointerEvents: 'none', zIndex: 1000 }}>
                    🎊✨🏆
                </div>
            )}
        </div>
    );
};

export default JuniorMagicStudio;
