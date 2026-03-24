import React, { useState, useEffect, useCallback } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorActivityCenter.css';

const JuniorBrainBoost = () => {
    const [activeTab, setActiveTab] = useState('memory'); // memory, logic, skills, nature
    const [score, setScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- Speech & Sound ---
    const speak = (text, lang = 'en-IN') => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const triggerWin = () => {
        setShowConfetti(true);
        const audio = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-01.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
        setTimeout(() => setShowConfetti(false), 3000);
    };

    // --- 1. Memory Master (Concentration) ---
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const initializeMemoryGame = useCallback(() => {
        const emojis = ['🐘', '🦁', '🦉', '🦋', '🍎', '🌈', '🍦', '🎨'];
        const deck = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji }));
        setCards(deck);
        setSolved([]);
        setFlipped([]);
    }, []);

    useEffect(() => {
        if (activeTab === 'memory') initializeMemoryGame();
    }, [activeTab, initializeMemoryGame]);

    const handleCardClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;
        
        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
            const [firstId, secondId] = newFlipped;
            if (cards[firstId].emoji === cards[secondId].emoji) {
                setSolved(prev => [...prev, firstId, secondId]);
                setFlipped([]);
                setDisabled(false);
                setScore(s => s + 50);
                if (solved.length + 2 === cards.length) triggerWin();
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    // --- 2. Logic Quest (Patterns) ---
    const [patternTask, setPatternTask] = useState(null);
    const generatePattern = () => {
        const patterns = [
            { sequence: ['🍎', '🍌', '🍎', '🍌'], next: '🍎', options: ['🍎', '🍇', '🍌'] },
            { sequence: ['🔴', '🔵', '🟢', '🔴', '🔵'], next: '🟢', options: ['🟢', '🟡', '🔴'] },
            { sequence: ['1️⃣', '2️⃣', '1️⃣', '2️⃣'], next: '1️⃣', options: ['1️⃣', '3️⃣', '2️⃣'] },
            { sequence: ['🌞', '🌙', '🌞', '🌙'], next: '🌞', options: ['⭐', '🌞', '☁️'] }
        ];
        setPatternTask(patterns[Math.floor(Math.random() * patterns.length)]);
    };

    useEffect(() => {
        if (activeTab === 'logic') generatePattern();
    }, [activeTab]);

    // --- 3. Skill Mirror (Bilingual) ---
    const commonPhrases = [
        { en: "Hello, how are you?", hi: "नमस्ते, आप कैसे हैं?", icon: "👋" },
        { en: "I am hungry.", hi: "मुझे भूख लगी है।", icon: "🍱" },
        { en: "Thank you very much.", hi: "आपका बहुत-बहुत धन्यवाद।", icon: "🙏" },
        { en: "Can I play?", hi: "क्या मैं खेल सकता हूँ?", icon: "⚽" },
        { en: "It is a beautiful day.", hi: "आज बहुत सुंदर दिन है।", icon: "☀️" }
    ];

    // --- 4. Nature's Secret (Science) ---
    const [plantStage, setPlantStage] = useState(0); // 0 (Seed) to 4 (Tree)
    const plantStages = [
        { name: 'Seed', icon: '🫘', desc: 'Plant the seed in the soil.' },
        { name: 'Sprout', icon: '🌱', desc: 'Add some water to see it grow!' },
        { name: 'Small Plant', icon: '🌿', desc: 'Keep watering for more magic.' },
        { name: 'Blooming', icon: '🪴', desc: 'Look! It is flowering!' },
        { name: 'Big Tree', icon: '🌳', desc: 'Wow! A big beautiful tree!' }
    ];

    return (
        <div className="junior-activity-center" style={{ minHeight: '90vh', background: '#020617', padding: '20px', position: 'relative' }}>
            <JuniorDashboardAnimations />
            
            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 10 }}>
                <h1 style={{ fontSize: '3.5rem', color: '#8b5cf6', textShadow: '0 0 25px rgba(139,92,246,0.6)' }}>Brain Boost Hub 🧠</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Chalo apne dimaag ko aur tez banayein!</p>
                <div style={{ position: 'absolute', top: 0, right: '20px', fontSize: '1.5rem', color: '#fbbf24' }}>⭐ XP: {score}</div>
                
                <nav style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveTab('memory')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'memory' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🃏 Memory Master</button>
                    <button onClick={() => setActiveTab('logic')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'logic' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🧩 Logic Quest</button>
                    <button onClick={() => setActiveTab('skills')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'skills' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🗣️ Skill Mirror</button>
                    <button onClick={() => setActiveTab('nature')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'nature' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🌳 Nature Magic</button>
                </nav>
            </header>

            <main className="glass-panel" style={{ padding: '40px', borderRadius: '40px', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                
                {activeTab === 'memory' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '30px' }}>Match the Pairs! 🃏</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '500px', margin: '0 auto' }}>
                            {cards.map((card, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => handleCardClick(index)}
                                    style={{ 
                                        height: '100px', borderRadius: '15px', 
                                        background: flipped.includes(index) || solved.includes(index) ? 'rgba(139,92,246,0.3)' : '#1e293b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
                                        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        border: solved.includes(index) ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                        transform: flipped.includes(index) ? 'rotateY(180deg)' : 'none'
                                    }}
                                >
                                    {(flipped.includes(index) || solved.includes(index)) ? card.emoji : '❓'}
                                </div>
                            ))}
                        </div>
                        <button onClick={initializeMemoryGame} style={{ marginTop: '30px', background: 'transparent', color: '#8b5cf6', border: '1px solid #8b5cf6', padding: '10px 20px', borderRadius: '15px', cursor: 'pointer' }}>Reset Game</button>
                    </div>
                )}

                {activeTab === 'logic' && patternTask && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>What Comes Next? 🧩</h2>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '50px', fontSize: '5rem' }}>
                            {patternTask.sequence.map((s, idx) => <div key={idx} style={{ animation: `bounce 2s infinite ${idx * 0.2}s` }}>{s}</div>)}
                            <div style={{ width: '100px', borderBottom: '5px dashed #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>?</div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {patternTask.options.map(opt => (
                                <button 
                                    key={opt}
                                    onClick={() => {
                                        if (opt === patternTask.next) {
                                            triggerWin();
                                            setScore(s => s + 30);
                                            generatePattern();
                                        } else {
                                            speak("Try again, buddy!");
                                        }
                                    }}
                                    style={{ fontSize: '4rem', padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer' }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Speak Like a Wizard! 🗣️</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', padding: '20px' }}>
                            {commonPhrases.map((phrase, idx) => (
                                <div key={idx} className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{phrase.icon}</div>
                                    <div style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 'bold' }}>{phrase.en}</div>
                                    <div style={{ color: '#fff', fontSize: '1.2rem', margin: '10px 0' }}>{phrase.hi}</div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button onClick={() => speak(phrase.en, 'en-US')} style={{ padding: '10px 15px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer' }}>🇺🇸 Listen ENG</button>
                                        <button onClick={() => speak(phrase.hi, 'hi-IN')} style={{ padding: '10px 15px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>🇮🇳 Listen HIN</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'nature' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Nature Magic: Plant a Tree! 🌳</h2>
                        <div style={{ position: 'relative', width: '300px', height: '300px', margin: '0 auto', marginBottom: '40px' }}>
                            <div style={{ fontSize: '10rem', animation: 'float 3s infinite ease-in-out' }}>
                                {plantStages[plantStage].icon}
                            </div>
                            {plantStage < 4 && (
                                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '3rem', animation: 'bounce 2s infinite' }}>🚿</div>
                            )}
                        </div>
                        <h3 style={{ color: '#f59e0b', fontSize: '2rem' }}>{plantStages[plantStage].name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', margin: '20px auto' }}>{plantStages[plantStage].desc}</p>
                        
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                            {plantStage < 4 ? (
                                <button 
                                    onClick={() => {
                                        setPlantStage(s => s + 1);
                                        setScore(s => s + 20);
                                        speak("Look! It's growing!");
                                    }} 
                                    style={{ padding: '20px 40px', borderRadius: '30px', background: '#10b981', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.4)' }}
                                >
                                    💦 Water the Plant
                                </button>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setPlantStage(0);
                                        triggerWin();
                                    }} 
                                    style={{ padding: '20px 40px', borderRadius: '30px', background: '#3b82f6', color: '#fff', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                                >
                                    🌟 Start Again
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {showConfetti && (
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12rem', pointerEvents: 'none', zIndex: 1000 }}>
                        🎉✨🎊
                    </div>
                )}

            </main>
        </div>
    );
};

export default JuniorBrainBoost;
