import React, { useState, useRef, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import GamificationEngine from '../../utils/GamificationEngine';
import './JuniorActivityCenter.css'; // Reusing established junior styles

const JuniorMagicStudio = () => {
    const [activeSection, setActiveSection] = useState('poems');
    const [activePoem, setActivePoem] = useState(null);
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [floatingXPs, setFloatingXPs] = useState([]);
    
    // Logic Puzzles State
    const [puzzleTask, setPuzzleTask] = useState(null);
    const [puzzleOptions, setPuzzleOptions] = useState([]);

    // Math Magic State
    const [mathProblem, setMathProblem] = useState(null);
    const [mathGroups, setMathGroups] = useState([]);
    const [mathTarget, setMathTarget] = useState(0);

    // Word Builder State
    const [currentWord, setCurrentWord] = useState(null);
    const [builtChars, setBuiltChars] = useState([]);

    // Glow Art State
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#8b5cf6');

    useEffect(() => {
        if (activeSection === 'poems') playMagicSound('chime');
        if (activeSection === 'puzzles') generatePuzzle();
        if (activeSection === 'logic') generateLogic();
        if (activeSection === 'math') generateMath();
        if (activeSection === 'words') generateWord();
    }, [activeSection]);

    // Speech Utility
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (indianVoice) utterance.voice = indianVoice;
        utterance.pitch = 1.3;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const playMagicSound = (type = 'chime') => {
        const sounds = {
            chime: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
            sparkle: 'https://www.soundjay.com/misc/sounds/sparkle-01.mp3',
            correct: 'https://www.soundjay.com/buttons/sounds/button-10.mp3'
        };
        const audio = new Audio(sounds[type] || sounds.chime);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    };

    const spawnXp = (amount) => {
        const id = Date.now();
        setFloatingXPs(prev => [...prev, { id, amount, x: 40 + Math.random() * 20, y: 40 + Math.random() * 20 }]);
        setTimeout(() => setFloatingXPs(prev => prev.filter(f => f.id !== id)), 1500);
    };

    const triggerConfetti = (xpAmount = 150) => {
        setScore(s => s + 10);
        setShowConfetti(true);
        GamificationEngine.addXP(xpAmount, `Magic Studio: ${activeSection}`);
        spawnXp(xpAmount);
        playMagicSound('correct');
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // --- Sections Data ---
    const poemsList = [
        { id: 1, title: 'Twinkle Twinkle', icon: '⭐', text: 'Twinkle, twinkle, little star, How I wonder what you are!', audio: 'Twinkle twinkle little star. You are a shining star!' },
        { id: 2, title: 'Johny Johny', icon: '👦', text: 'Johny Johny, Yes Papa? Eating Sugar? No Papa!', audio: 'Johny Johny Yes Papa. Eating sugar? No Papa. Telling lies? No Papa. Open your mouth? Ha ha ha!' },
        { id: 3, title: 'Hathi Raja', icon: '🐘', text: 'Hathi raja kahan chale? Soond hilakar kahan chale?', audio: 'Hathi raja kahan chale? Soond hilakar kahan chale? Mere ghar bhi aao na, Halwa poori khao na!' },
        { id: 4, title: 'Rain Rain Go Away', icon: '🌧️', text: 'Rain, rain, go away, Come again another day!', audio: 'Rain rain go away. Little Johny wants to play!' }
    ];

    const generatePuzzle = () => {
        const items = [
            { id: 1, name: 'Apple', icon: '🍎', shadow: '⬛' },
            { id: 2, name: 'Butterfly', icon: '🦋', shadow: '⬛' },
            { id: 3, name: 'Sun', icon: '☀️', shadow: '⬛' },
            { id: 4, name: 'Car', icon: '🚗', shadow: '⬛' }
        ];
        const target = items[Math.floor(Math.random() * items.length)];
        setPuzzleTask(target);
        setPuzzleOptions([...items].sort(() => Math.random() - 0.5));
    };

    const generateLogic = () => {
        const patterns = [
            { seq: ['🔴', '🔵', '🔴'], ans: '🔵' },
            { seq: ['⭐', '🌙', '⭐'], ans: '🌙' },
            { seq: ['🍎', '🍌', '🍎'], ans: '🍌' },
            { seq: ['🚗', '🚲', '🚗'], ans: '🚲' }
        ];
        const p = patterns[Math.floor(Math.random() * patterns.length)];
        setPuzzleTask(p);
        const opts = ['🔵', '🌙', '🍌', '🚲', '🚗', '⭐'].filter(o => o !== p.ans).slice(0, 3);
        setPuzzleOptions([p.ans, ...opts].sort(() => Math.random() - 0.5));
    };

    const generateMath = () => {
        const problems = [
            { total: 4, div: 2, ans: 2, item: '🍪' },
            { total: 6, div: 2, ans: 3, item: '🍎' },
            { total: 9, div: 3, ans: 3, item: '🍭' },
            { total: 8, div: 2, ans: 4, item: '🍓' }
        ];
        const p = problems[Math.floor(Math.random() * problems.length)];
        setMathProblem(p);
        setMathGroups(new Array(p.div).fill(0));
        setMathTarget(p.ans);
    };

    const handleMathClick = (groupIndex) => {
        if (mathGroups.reduce((a,b) => a+b, 0) < mathProblem.total) {
            const newGroups = [...mathGroups];
            newGroups[groupIndex] += 1;
            setMathGroups(newGroups);
            playMagicSound('sparkle');
            
            if (newGroups.reduce((a,b) => a+b, 0) === mathProblem.total) {
                const isCorrect = newGroups.every(g => g === mathProblem.ans);
                if (isCorrect) triggerConfetti();
                else {
                    speak("Oh! The sharing is not equal. Let us try again!");
                    setTimeout(generateMath, 2000);
                }
            }
        }
    };

    const generateWord = () => {
        const words = [
            { w: 'CAT', l: ['C', 'A', 'T'], e: '🐱', lang: 'en' },
            { w: 'DOG', l: ['D', 'O', 'G'], e: '🐶', lang: 'en' },
            { w: 'SUN', l: ['S', 'U', 'N'], e: '☀️', lang: 'en' },
            { w: 'KAMAL', l: ['क', 'म', 'ल'], e: '🪷', lang: 'hi' },
            { w: 'AMAR', l: ['अ', 'म', 'र'], e: '👦', lang: 'hi' },
            { w: 'GHAR', l: ['घ', 'र'], e: '🏠', lang: 'hi' }
        ];
        const w = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(w);
        setBuiltChars([]);
        speak(w.lang === 'hi' ? "Chalo shabd banate hain!" : "Let us build a word!");
    };

    const addChar = (char) => {
        if (currentWord && builtChars.length < currentWord.l.length) {
            if (currentWord.l[builtChars.length] === char) {
                const newBuilt = [...builtChars, char];
                setBuiltChars(newBuilt);
                speak(char);
                playMagicSound('sparkle');
                if (newBuilt.length === currentWord.l.length) {
                    speak(`${currentWord.w}! Very good!`);
                    triggerWin();
                }
            } else {
                speak("Try another letter!");
            }
        }
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
        ctxRef.current.strokeStyle = brushColor;
        ctxRef.current.shadowColor = brushColor;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        ctxRef.current.lineTo(offsetX, offsetY);
        ctxRef.current.stroke();
    };

    const stopDraw = () => {
        ctxRef.current.closePath();
        setIsDrawing(false);
    };

    return (
        <div className="junior-activity-center" style={{ minHeight: '90vh', background: '#020617', padding: '20px' }}>
            <JuniorDashboardAnimations />
            
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', color: '#fff', textShadow: '0 0 20px #8b5cf6' }}>Magic Studio ✨</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Dosto, chalo jaadu seekhein!</p>
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveSection('poems')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'poems' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📜 Poem Kingdom</button>
                    <button onClick={() => setActiveSection('puzzles')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'puzzles' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🧩 Puzzle Palace</button>
                    <button onClick={() => setActiveSection('art')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'art' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✨ Glow Art</button>
                    <button onClick={() => setActiveSection('logic')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'logic' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🔍 Logic Land</button>
                    <button onClick={() => setActiveSection('math')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'math' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>➗ Math Magic</button>
                    <button onClick={() => setActiveSection('words')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeSection === 'words' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✍️ Word Builder</button>
                </div>
            </header>

            <main className="glass-panel" style={{ padding: '40px', borderRadius: '40px' }}>
                {activeSection === 'poems' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                        {poemsList.map(p => (
                            <div key={p.id} onClick={() => { setActivePoem(p); speak(p.audio); }} className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                <div style={{ fontSize: '5rem', marginBottom: '15px' }}>{p.icon}</div>
                                <h3 style={{ color: '#fff', marginBottom: '10px' }}>{p.title}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{p.text}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeSection === 'puzzles' && puzzleTask && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '30px' }}>Shadow Match! 🕵️‍♂️</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Can you find the icon that matches this shadow?</p>
                        <div style={{ fontSize: '10rem', background: 'rgba(255,255,255,0.03)', display: 'inline-flex', padding: '40px', borderRadius: '50px', marginBottom: '50px', border: '2px dashed rgba(139,92,246,0.5)' }}>
                            <span style={{ filter: 'brightness(0) blur(2px)' }}>{puzzleTask.icon}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {puzzleOptions.map(opt => (
                                <button 
                                    key={opt.id} 
                                    onClick={() => opt.id === puzzleTask.id ? (triggerConfetti(), generatePuzzle()) : speak('Opps! Try again!')} 
                                    className="card-vibe"
                                    style={{ fontSize: '4rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '20px', cursor: 'pointer' }}
                                >
                                    {opt.icon}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'art' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            {['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#fbbf24', '#fff'].map(c => (
                                <div key={c} onClick={() => setBrushColor(c)} style={{ width: '40px', height: '40px', background: c, borderRadius: '50%', cursor: 'pointer', border: brushColor === c ? '4px solid #fff' : 'none' }}></div>
                            ))}
                            <button onClick={() => ctxRef.current.clearRect(0,0,800,400)} style={{ marginLeft: '20px', padding: '0 20px', borderRadius: '15px' }}>Clear</button>
                        </div>
                        <canvas 
                            ref={canvasRef}
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={stopDraw}
                            onMouseLeave={stopDraw}
                            style={{ background: '#000', borderRadius: '30px', width: '100%', height: '400px', cursor: 'crosshair', border: '5px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                )}

                {activeSection === 'logic' && puzzleTask && !puzzleTask.id && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Logic Land! Complete the pattern:</h2>
                        <div style={{ fontSize: '6rem', marginBottom: '50px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {puzzleTask.seq.map((s, i) => <span key={i}>{s}</span>)}
                            <span style={{ borderBottom: '5px dashed #8b5cf6', width: '80px' }}>?</span>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                            {puzzleOptions.map((opt, i) => (
                                <button key={i} onClick={() => opt === puzzleTask.ans ? triggerConfetti() : speak('Think again, friend!')} style={{ fontSize: '5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', padding: '20px', cursor: 'pointer' }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'math' && mathProblem && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Sharing is Caring! ➗</h2>
                        <p style={{ color: '#fbbf24', fontSize: '1.5rem', marginBottom: '40px' }}>
                            Share {mathProblem.total} {mathProblem.item} equally among {mathProblem.div} monsters!
                        </p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginBottom: '50px' }}>
                            {mathGroups.map((count, idx) => (
                                <div key={idx} onClick={() => handleMathClick(idx)} className="card-vibe" style={{ width: '250px', minHeight: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px solid #8b5cf6' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '20px' }}>👾</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                                        {Array.from({ length: count }).map((_, i) => (
                                            <span key={i} style={{ fontSize: '2.5rem' }}>{mathProblem.item}</span>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: 'auto', color: '#fff', fontSize: '1.2rem' }}>Got: {count}</div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Remaining: {mathProblem.total - mathGroups.reduce((a,b) => a+b, 0)} {mathProblem.item}
                        </div>
                        <button onClick={generateMath} style={{ marginTop: '30px', padding: '10px 20px', borderRadius: '15px' }}>Restart Level</button>
                    </div>
                )}

                {activeSection === 'words' && currentWord && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '30px' }}>Shabd Banaiye! (Word Builder) ✍️</h2>
                        {builtChars.length === currentWord.l.length && (
                            <div style={{ animation: 'bounce 1s infinite', fontSize: '8rem', marginBottom: '20px' }}>{currentWord.e}</div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '50px' }}>
                            {currentWord.l.map((char, i) => (
                                <div key={i} style={{ width: '80px', height: '100px', background: builtChars[i] ? '#8b5cf6' : 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '2px dashed #8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#fff' }}>
                                    {builtChars[i] || ''}
                                </div>
                            ))}
                        </div>
                        
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>Pick the correct letter to build the word:</p>
                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {['क', 'म', 'ल', 'अ', 'र', 'घ', 'C', 'A', 'T', 'D', 'O', 'G', 'S', 'U', 'N'].sort(() => Math.random() - 0.5).map(char => (
                                    <button 
                                        key={char} 
                                        onClick={() => addChar(char)}
                                        style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}
                                    >
                                        {char}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button onClick={generateWord} style={{ marginTop: '30px', padding: '10px 20px', borderRadius: '15px' }}>Next Word ➡️</button>
                    </div>
                )}

                {showConfetti && (
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', pointerEvents: 'none', animation: 'bounce 1s infinite' }}>
                        🎊✨🏆
                    </div>
                )}

                {floatingXPs.map(f => (
                    <div 
                        key={f.id} 
                        className="floating-xp-pop"
                        style={{ left: `${f.x}%`, top: `${f.y}%` }}
                    >
                        +{f.amount} XP
                    </div>
                ))}
            </main>

            <footer style={{ marginTop: '50px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(139,92,246,0.2)', padding: '20px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '2rem' }}>⭐ Grade A+</span>
                    <span style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.2)' }}></span>
                    <span style={{ fontSize: '2rem' }}>XP: {score}</span>
                </div>
            </footer>
        </div>
    );
};

export default JuniorMagicStudio;
