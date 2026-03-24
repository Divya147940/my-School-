import React, { useState, useRef, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useAuth } from '../../context/AuthContext';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import { useTheme } from '../../context/ThemeContext';
import './JuniorActivityCenter.css';

const JuniorActivityCenter = () => {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [story, setStory] = useState(null);
    const [stickers, setStickers] = useState([]);
    const [phonics, setPhonics] = useState([]);

    const [gallery, setGallery] = useState([]);
    const [activeSection, setActiveSection] = useState('drawing');
    const [selectedPhonic, setSelectedPhonic] = useState(null);
    const [storyResult, setStoryResult] = useState(null);
    const [traceLetter, setTraceLetter] = useState('A');
    const [recState, setRecState] = useState('idle'); // idle, recording, done
    const [dailyGift, setDailyGift] = useState(null);
    const [isReading, setIsReading] = useState(false);
    const [gameScore, setGameScore] = useState(0);
    const [currentProblem, setCurrentProblem] = useState({ a: 2, b: 3, answer: 5, options: [4, 5, 6] });
    
    // Toddler World States
    const [toddlerData, setToddlerData] = useState(null);
    const [bubbles, setBubbles] = useState([]);
    const [activeToddlerGame, setActiveToddlerGame] = useState('bubbles'); // bubbles, peekaboo, splash
    const [peekabooAnimal, setPeekabooAnimal] = useState(null);
    const [splashEffect, setSplashEffect] = useState(null);

    // Cartoon Corner States
    const [cartoonData, setCartoonData] = useState(null);
    const [bholuOutfit, setBholuOutfit] = useState([]); // Array of item emojis
    const [activeCartoonGame, setActiveCartoonGame] = useState('dressup'); // dressup, sounds, talk
    const [bholuMessage, setBholuMessage] = useState("");
    const [soundBlast, setSoundBlast] = useState(null);

    // Magic Land States
    const [magicActiveGame, setMagicActiveGame] = useState('rain'); // rain, rocket, garden
    const [rainDrops, setRainDrops] = useState([]);
    const [rocketPos, setRocketPos] = useState({ x: 10, y: 80, rotation: 0 });
    const [isRocketFlying, setIsRocketFlying] = useState(false);
    const [gardenFlowers, setGardenFlowers] = useState([]);

    // Fun Zone (Masti Kona) States
    const [placedStickers, setPlacedStickers] = useState([]);
    const [activeFunGame, setActiveFunGame] = useState('stickers'); // stickers, orchestra, mood, counting, balloons
    const [dancingAnimal, setDancingAnimal] = useState(null);

    // Seekho aur Khelo States
    const [countingTarget, setCountingTarget] = useState(3);
    const [countingCurrent, setCountingCurrent] = useState(0);
    const [balloonTask, setBalloonTask] = useState({ type: 'color', target: 'Red', emoji: '🎈' });
    const [gameBalloons, setGameBalloons] = useState([]);

    // Shala Kona (Class 1-2 Academics) States
    const [activeAcademicGame, setActiveAcademicGame] = useState('tables'); // tables, spelling, math
    const [tableStep, setTableStep] = useState(1);
    const [currentSpelling, setCurrentSpelling] = useState({ word: 'CAT', hint: '🐱', letters: ['C', 'A', 'T'], guessed: [] });
    const [mathMagic, setMathMagic] = useState({ a: 2, b: 3, op: '+', ans: 5, options: [4, 5, 6] });

    // GK States
    const [clockHour, setClockHour] = useState(3);
    const [targetHour, setTargetHour] = useState(6);
    const [oppositePair, setOppositePair] = useState({ q: 'BIG', a: 'Small', qIcon: '🐘', aIcon: '🐜' });
    const [habitStep, setHabitStep] = useState(0);

    const [homePair, setHomePair] = useState({ animal: '🦁', home: 'Den', name: 'Sher' });
    
    // New Features States
    const [activeGyanGame, setActiveGyanGame] = useState('hindi');
    const [hindiLetter, setHindiLetter] = useState(null);
    const [foodPair, setFoodPair] = useState({ item: '🍎', type: 'healthy', name: 'Seb' });
    const [trafficState, setTrafficState] = useState('red');
    const [transportPair, setTransportPair] = useState({ vehicle: '🚗', type: 'road', name: 'Car' });

    const [animalSoundTarget, setAnimalSoundTarget] = useState(null);
    const [colorMagic, setColorMagic] = useState({ slot1: null, slot2: null, result: null });
    const [plantStage, setPlantStage] = useState(0); // 0 to 4
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    const [currentShapeTask, setCurrentShapeTask] = useState(null);
    
    // Data States
    const [colorMixes, setColorMixes] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [shapeChallenge, setShapeChallenge] = useState([]);
    
    // Super Hero 20 States
    const [fastTrackCurriculum, setFastTrackCurriculum] = useState([]);
    const [fastTrackProgress, setFastTrackProgress] = useState(0);
    const [selectedFastTrackDay, setSelectedFastTrackDay] = useState(null);

    // Mastery Kona (Sikhlo Kona) States
    const [activeMasteryGame, setActiveMasteryGame] = useState('alphabet');
    const [masteryAlphabet, setMasteryAlphabet] = useState([]);
    const [masteryTableNum, setMasteryTableNum] = useState(2);
    const [masteryMath, setMasteryMath] = useState({ a: 10, b: 5, ans: 5, op: '-' });
    const [masteryCategory, setMasteryCategory] = useState('fruits');
    const [masteryCatData, setMasteryCatData] = useState([]);
    const [masteryChallenge, setMasteryChallenge] = useState(null);
    const [masteryHindi, setMasteryHindi] = useState([]);
    const [tracingLetter, setTracingLetter] = useState('A');
    const [showConfetti, setShowConfetti] = useState(false);
    const [activeDuniyaGame, setActiveDuniyaGame] = useState(null);

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    useEffect(() => {
        const juniorAcademics = ['Class 1', 'Class 2', 'Class 3', '1', '2', '3'];
        if (user && juniorAcademics.includes(user.class)) {
            setActiveSection('shala');
        }
    }, [user]);

    useEffect(() => {
        if (activeFunGame === 'balloons') {
            const timer = setInterval(() => {
                setGameBalloons(prev => {
                    const newBalloons = prev.map(b => ({ ...b, y: b.y - b.speed }));
                    if (newBalloons.length < 5 && Math.random() > 0.7) {
                        const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink'];
                        const letters = ['A', 'B', 'C', 'D', 'E'];
                        const type = Math.random() > 0.5 ? 'color' : 'letter';
                        newBalloons.push({
                            id: Math.random(),
                            x: Math.random() * 80 + 10,
                            y: 100,
                            speed: Math.random() * 0.5 + 0.2,
                            type,
                            val: type === 'color' ? colors[Math.floor(Math.random() * colors.length)] : letters[Math.floor(Math.random() * letters.length)],
                            color: colors[Math.floor(Math.random() * colors.length)].toLowerCase()
                        });
                    }
                    return newBalloons.filter(b => b.y > -10);
                });
            }, 50);
            return () => clearInterval(timer);
        }
    }, [activeFunGame]);

    const playMagicSound = (type = 'chime') => {
        const sounds = {
            chime: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3',
            pop: 'https://www.soundjay.com/buttons/sounds/button-37a.mp3',
            sparkle: 'https://www.soundjay.com/misc/sounds/sparkle-01.mp3'
        };
        const audio = new Audio(sounds[type] || sounds.chime);
        audio.volume = 0.2;
        audio.play().catch(() => {});
    };

    // Speech Utility with Indian Voice Support
    const speak = (text, type = 'cartoon') => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find Indian/Hindi voice
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (indianVoice) utterance.voice = indianVoice;

        if (type === 'cartoon') {
            utterance.pitch = 1.8;
            utterance.rate = 1.1;
        } else {
            utterance.pitch = 1.0;
            utterance.rate = 0.9;
        }
        window.speechSynthesis.speak(utterance);
    };
    
    // Canvas Refs
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        setStory(mockApi.getDailyStory());
        setStickers(mockApi.getStickers());
        setPhonics(mockApi.getPhonics());

        setGallery(mockApi.getJuniorGallery());
        setToddlerData(mockApi.getToddlerData());
        setCartoonData(mockApi.getCartoonData());
        setColorMixes(mockApi.getColorMixes());
        setPlanets(mockApi.getPlanets());
        setShapeChallenge(mockApi.getShapeChallenge());
        setFastTrackCurriculum(mockApi.getFastTrackCurriculum());
        setFastTrackProgress(mockApi.getFastTrackProgress());
        
        // Initial setup for new games
        const toddlerAnimals = mockApi.getToddlerData()?.animals || [];
        if (toddlerAnimals.length > 0) setAnimalSoundTarget(toddlerAnimals[0]);

        if (canvasRef.current && activeSection === 'drawing') {
            const canvas = canvasRef.current;
            canvas.width = window.innerWidth > 800 ? 600 : 300;
            canvas.height = 400;
            canvas.style.width = `${canvas.width}px`;
            canvas.style.height = `${canvas.height}px`;

            const context = canvas.getContext("2d");
            context.lineCap = "round";
            context.strokeStyle = "#fff";
            context.lineWidth = 5;
            contextRef.current = context;
        }
    }, [activeSection]);

    // Mastery Data Initializer
    useEffect(() => {
        if (activeSection === 'mastery') {
            setMasteryAlphabet(mockApi.getAlphabetData());
            setMasteryHindi(mockApi.getHindiVarnamala());
            setMasteryCatData(mockApi.getCategoryData('fruits'));
            setMasteryMath(mockApi.getMasteryMath('sub'));
        }
    }, [activeSection]);

    const startMasteryChallenge = () => {
        const types = ['letter', 'number', 'nature'];
        const type = types[Math.floor(Math.random() * types.length)];
        let question, ans, options;

        if (type === 'letter') {
            const data = mockApi.getAlphabetData();
            const item = data[Math.floor(Math.random() * data.length)];
            question = `Batao "${item.l}" kaha hai?`;
            ans = item.l;
            options = [ans, ...data.filter(d => d.l !== ans).sort(() => 0.5 - Math.random()).slice(0, 3).map(d => d.l)].sort(() => 0.5 - Math.random());
        } else if (type === 'number') {
            ans = Math.floor(Math.random() * 90) + 1;
            question = `Dosto! "${ans}" Number kaha hai?`;
            options = [ans, ans + 2, Math.max(1, ans - 1), ans + 5].sort(() => 0.5 - Math.random());
        } else {
            const cats = ['fruits', 'animals', 'birds'];
            const cat = cats[Math.floor(Math.random() * cats.length)];
            const data = mockApi.getCategoryData(cat);
            const item = data[Math.floor(Math.random() * data.length)];
            question = `Batao "${item.h}" (${item.n}) kaunsa hai?`;
            ans = item.n;
            options = [item, ...data.filter(d => d.n !== ans).sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());
        }

        setMasteryChallenge({ type, question, ans, options });
        speak(question, 'mastery');
    };

    // Rain Animation Effect
    useEffect(() => {
        let rainInterval;
        if (activeSection === 'magic' && magicActiveGame === 'rain') {
            rainInterval = setInterval(() => {
                setRainDrops(prev => prev.map(d => ({ ...d, y: d.y + 1 })).filter(d => d.y < 100));
            }, 50);
        }
        return () => clearInterval(rainInterval);
    }, [activeSection, magicActiveGame]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const saveDrawing = () => {
        const image = canvasRef.current.toDataURL();
        mockApi.saveJuniorDrawing(image);
        alert("🖼️ Your drawing has been sent to your teacher!");
    };

    const generateProblem = () => {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const ans = a + b;
        const options = [ans, ans + 1, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5);
        setCurrentProblem({ a, b, answer: ans, options });
    };

    const handleGameChoice = (choice) => {
        if (choice === currentProblem.answer) {
            setGameScore(prev => prev + 10);
            alert("🎈 POP! Correct! Great job!");
            generateProblem();
        } else {
            alert("Oops! Try again!");
        }
    };

    // Toddler Logic
    useEffect(() => {
        if (activeSection === 'toddler' && activeToddlerGame === 'bubbles') {
            const interval = setInterval(() => {
                if (bubbles.length < 15) {
                    const newBubble = {
                        id: Date.now() + Math.random(),
                        x: Math.random() * 80 + 10, // 10% to 90%
                        y: 110,
                        size: Math.random() * 40 + 40,
                        color: toddlerData?.bubbles[Math.floor(Math.random() * toddlerData.bubbles.length)] || '#fff',
                        speed: Math.random() * 0.5 + 0.2
                    };
                    setBubbles(prev => [...prev, newBubble]);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeSection, activeToddlerGame, bubbles.length, toddlerData]);

    useEffect(() => {
        if (activeSection === 'toddler' && activeToddlerGame === 'bubbles') {
            const moveInterval = setInterval(() => {
                setBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -20));
            }, 30);
            return () => clearInterval(moveInterval);
        }
    }, [activeSection, activeToddlerGame]);

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setGameScore(prev => prev + 5);
        // Play sound effect alert
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37a.mp3');
        audio.play().catch(() => console.log("Sound blocked"));
    };

    const handleSplash = (e) => {
        if (activeToddlerGame !== 'splash') return;
        const { clientX, clientY } = e;
        setSplashEffect({ x: clientX, y: clientY });
        setTimeout(() => setSplashEffect(null), 1000);
    };

    const handleColorMix = (slot, color) => {
        const newMagic = { ...colorMagic, [slot]: color };
        if (newMagic.slot1 && newMagic.slot2) {
            const mix = colorMixes.find(m => (m.c1 === newMagic.slot1 && m.c2 === newMagic.slot2) || (m.c1 === newMagic.slot2 && m.c2 === newMagic.slot1));
            if (mix) {
                newMagic.result = mix;
                speak(`Wow! ${newMagic.slot1} plus ${newMagic.slot2} made ${mix.result}!`);
            } else {
                newMagic.result = { resEmoji: '❓', result: 'Something new!' };
            }
        }
        setColorMagic(newMagic);
    };

    const handlePlanting = () => {
        if (plantStage < 4) {
            setPlantStage(s => s + 1);
            const msgs = ["Seed planted!", "Watering...", "Look, a sprout!", "It's growing!", "Beautiful tree! ⭐"];
            speak(msgs[plantStage + 1]);
            if (plantStage === 3) setGameScore(s => s + 50);
        }
    };

    return (
        <div className="junior-activity-center magic-reveal" style={{ minHeight: '90vh', background: 'var(--bg-primary)', padding: '20px', position: 'relative', color: 'var(--text-primary)' }}>
            <JuniorDashboardAnimations />
            <div className="section-tabs stagger-1" style={{ display: 'flex', gap: '15px', marginBottom: '25px', justifyContent: 'center' }}>
                <button 
                    onClick={() => { setActiveSection('drawing'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'drawing' ? 'linear-gradient(135deg, #4f46e5, #8b5cf6)' : 'var(--glass-bg)',
                        color: activeSection === 'drawing' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🎨 Drawing Slate
                </button>
                <button 
                    onClick={() => { setActiveSection('cartoon'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'cartoon' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--glass-bg)',
                        color: activeSection === 'cartoon' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'cartoon' ? '0 0 20px rgba(244,114,182,0.4)' : 'none'
                    }}
                >
                    🎭 Carton Wala Kona
                </button>
                <button 
                    onClick={() => { setActiveSection('magic'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'magic' ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'var(--glass-bg)',
                        color: activeSection === 'magic' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'magic' ? '0 0 20px rgba(139,92,246,0.4)' : 'none'
                    }}
                >
                    ✨ Jadui Duniya
                </button>
                <button 
                    onClick={() => { setActiveSection('fun'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'fun' ? 'linear-gradient(135deg, #0d9488, #2dd4bf)' : 'var(--glass-bg)',
                        color: activeSection === 'fun' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'fun' ? '0 0 20px rgba(16,185,129,0.4)' : 'none'
                    }}
                >
                    🎉 Masti Kona
                </button>
                <button 
                    onClick={() => { setActiveSection('shala'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'shala' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'var(--glass-bg)',
                        color: activeSection === 'shala' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'shala' ? '0 0 20px rgba(99,102,241,0.4)' : 'none'
                    }}
                >
                    🏫 Shala Kona
                </button>
                <button 
                    onClick={() => { setActiveSection('mastery'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'mastery' ? 'linear-gradient(135deg, #6d28d9, #9333ea)' : 'var(--glass-bg)',
                        color: activeSection === 'mastery' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'mastery' ? '0 0 20px rgba(245,158,11,0.4)' : 'none'
                    }}
                >
                    🎓 Sikhlo Kona
                </button>
                <button 
                    onClick={() => { setActiveSection('duniya'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'duniya' ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : 'var(--glass-bg)',
                        color: activeSection === 'duniya' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'duniya' ? '0 0 20px rgba(16,185,129,0.4)' : 'none'
                    }}
                >
                    🌍 Knowledge World
                </button>
                <button 
                    onClick={() => { setActiveSection('gyan'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'gyan' ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : 'var(--glass-bg)',
                        color: activeSection === 'gyan' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'gyan' ? '0 0 20px rgba(245,158,11,0.4)' : 'none'
                    }}
                >
                    🧠 Gyan Kona
                </button>
                <button 
                    onClick={() => { setActiveSection('toddler'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'toddler' ? 'linear-gradient(135deg, #059669, #10b981)' : 'var(--glass-bg)',
                        color: activeSection === 'toddler' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'toddler' ? '0 0 20px rgba(16,185,129,0.4)' : 'none'
                    }}
                >
                    👶 Chote Bachon Ki Duniya
                </button>
                <button 
                    onClick={() => { setActiveSection('story'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'story' ? 'linear-gradient(135deg, #60a5fa, #3b82f6)' : 'var(--glass-bg)',
                        color: activeSection === 'story' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    📚 AI Storyland
                </button>
                <button 
                    onClick={() => { setActiveSection('stickers'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'stickers' ? 'linear-gradient(135deg, #db2777, #ec4899)' : 'var(--glass-bg)',
                        color: activeSection === 'stickers' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    ⭐ Sticker Wall
                </button>
                <button 
                    onClick={() => { setActiveSection('games'); generateProblem(); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'games' ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--glass-bg)',
                        color: activeSection === 'games' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🎈 Fun Games
                </button>
                <button 
                    onClick={() => { setActiveSection('phonics'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'phonics' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'var(--glass-bg)',
                        color: activeSection === 'phonics' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🅰️ Phonics Board
                </button>
                <button 
                    onClick={() => { setActiveSection('tracing'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'tracing' ? 'linear-gradient(135deg, #7c3aed, #8b5cf6)' : 'var(--glass-bg)',
                        color: activeSection === 'tracing' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    ✍️ Trace Letters
                </button>
                <button 
                    onClick={() => { setActiveSection('music'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'music' ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'var(--glass-bg)',
                        color: activeSection === 'music' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🎹 Magic Piano
                </button>
                <button 
                    onClick={() => { setActiveSection('diary'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'diary' ? 'linear-gradient(135deg, #1e293b, #4f46e5)' : 'var(--glass-bg)',
                        color: activeSection === 'diary' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🎤 Mera Din
                </button>
                <button 
                    onClick={() => { setActiveSection('gallery'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'gallery' ? 'linear-gradient(135deg, #1d4ed8, #2563eb)' : 'var(--glass-bg)',
                        color: activeSection === 'gallery' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    🖼️ My Gallery
                </button>
                <button 
                    onClick={() => { setActiveSection('superhero'); playMagicSound('chime'); }}
                    style={{ 
                        padding: '15px 30px', 
                        borderRadius: '20px', 
                        border: 'none', 
                        background: activeSection === 'superhero' ? 'linear-gradient(135deg, #2563eb, #6366f1)' : 'var(--glass-bg)',
                        color: activeSection === 'superhero' ? '#fff' : 'var(--text-secondary)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: activeSection === 'superhero' ? '0 0 20px rgba(234,179,8,0.4)' : 'none'
                    }}
                >
                    🦸‍♂️ Super Hero 20
                </button>
            </div>







            <div className="center-content glass-panel magic-reveal stagger-3" style={{ padding: '40px', borderRadius: '40px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)', minHeight: '60vh', color: 'var(--text-primary)' }}>
                {activeSection === 'drawing' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '20px', color: 'var(--text-primary)' }}>Magic Drawing Slate ✨</h2>
                        <div style={{ background: theme === 'dark' ? '#0f172a' : '#f1f5f9', borderRadius: '20px', display: 'inline-block', padding: '10px', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}>
                            <canvas
                                onMouseDown={startDrawing}
                                onMouseUp={finishDrawing}
                                onMouseMove={draw}
                                ref={canvasRef}
                            />
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button onClick={clearCanvas} style={{ padding: '10px 25px', borderRadius: '15px', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer' }}>🧽 Clear Slate</button>
                            <button onClick={saveDrawing} style={{ padding: '10px 25px', borderRadius: '15px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📤 Send to Teacher</button>
                        </div>
                    </div>
                )}

                {activeSection === 'story' && story && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '40px', alignItems: 'center' }}>
                        <img 
                            src={story.image} 
                            alt={story.title} 
                            style={{ width: '100%', borderRadius: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                        />
                        <div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--accent-blue)' }}>{story.title} 🐘</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-primary)', background: 'var(--glass-bg)', padding: '25px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                {storyResult || story.content}
                            </p>
                            
                            {!storyResult ? (
                                <div style={{ marginTop: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {story.choices.map(c => (
                                        <button 
                                            key={c.id}
                                            onClick={() => setStoryResult(c.result)}
                                            style={{ padding: '20px', borderRadius: '15px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            {c.text}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <button onClick={() => setStoryResult(null)} style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#60a5fa', textDecoration: 'underline', cursor: 'pointer' }}>Read again?</button>
                            )}

                            <button 
                                onClick={() => setIsReading(!isReading)}
                                style={{ 
                                    marginTop: '25px', 
                                    padding: '15px 40px', 
                                    borderRadius: '20px', 
                                    background: isReading ? '#f43f5e' : '#10b981',
                                    color: '#fff',
                                    border: 'none',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                {isReading ? '⏹ Stop Story' : '🎧 Listen to AI Story'}
                                {isReading && <span className="voice-wave">〰️〰️〰️</span>}
                            </button>
                        </div>
                    </div>
                )}

                {activeSection === 'gallery' && (
                    <div style={{ textAlign: 'center' }}>
                         <h2 style={{ marginBottom: '30px', color: '#60a5fa' }}>My Magical Photo Gallery 🖼️✨</h2>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {gallery.map(item => (
                                <div key={item.id} className="card-vibe" style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {item.type === 'drawing' ? (
                                        <img src={item.data} style={{ width: '100%', borderRadius: '12px', marginBottom: '10px' }} alt="Drawing" />
                                    ) : (
                                        <div style={{ fontSize: '3rem', margin: '20px 0' }}>🎤</div>
                                    )}
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <span>{item.icon}</span> {item.type.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '5px' }}>{new Date(item.date).toLocaleDateString()}</div>
                                </div>
                            ))}
                         </div>
                         {gallery.length === 0 && (
                            <div style={{ padding: '60px', opacity: 0.3 }}>
                                <div style={{ fontSize: '4rem' }}>📦</div>
                                <p>Your gallery is empty. Go draw something!</p>
                            </div>
                         )}
                    </div>
                )}

                {activeSection === 'games' && (
                    <div style={{ textAlign: 'center' }}>
                         <h2 style={{ marginBottom: '30px', color: '#10b981' }}>Balloon Pop Math Challenge! 🎈</h2>
                         <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', textShadow: '0 0 20px rgba(16,185,129,0.5)', marginBottom: '30px' }}>
                            {currentProblem.a} + {currentProblem.b} = ?
                         </div>
                         <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                            {currentProblem.options.map((opt, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleGameChoice(opt)}
                                    className="game-balloon"
                                    style={{ 
                                        width: '120px', 
                                        height: '120px', 
                                        borderRadius: '50%', 
                                        border: 'none', 
                                        background: ['#f43f5e', '#3b82f6', '#fbbf24'][i % 3],
                                        color: '#fff',
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                                        animation: `float ${3 + i}s infinite ease-in-out`
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                         </div>
                         <div style={{ marginTop: '40px', fontSize: '1.5rem' }}>
                            Score: <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{gameScore}</span>
                         </div>
                    </div>
                )}

                {activeSection === 'phonics' && (
                    <div style={{ textAlign: 'center' }}>
                         <h2 style={{ marginBottom: '30px', color: '#8b5cf6' }}>Magical Phonics Board 🅰️</h2>
                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '15px', marginBottom: '40px' }}>
                            {phonics.map((p, i) => (
                                <button 
                                    key={i}
                                    onClick={() => { setSelectedPhonic(p); speak(p.letter); }}
                                    style={{ 
                                        padding: '25px', 
                                        borderRadius: '20px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        background: selectedPhonic?.letter === p.letter ? p.color : 'rgba(255,255,255,0.05)',
                                        color: '#fff',
                                        fontSize: '2.5rem',
                                        fontWeight: '900',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {p.letter}
                                </button>
                            ))}
                         </div>
                         
                         {selectedPhonic && (
                             <div className="card-vibe" style={{ display: 'inline-flex', alignItems: 'center', gap: '30px', padding: '40px', background: `${selectedPhonic.color}20`, borderRadius: '30px', border: `2px solid ${selectedPhonic.color}` }}>
                                <div style={{ fontSize: '8rem', animation: 'bounce 2s infinite' }}>{selectedPhonic.emoji}</div>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '1.2rem', opacity: 0.7 }}>{selectedPhonic.letter} is for...</div>
                                    <div style={{ fontSize: '4rem', fontWeight: '900', color: selectedPhonic.color }}>{selectedPhonic.word}!</div>
                                    <button 
                                        style={{ marginTop: '15px', padding: '10px 25px', borderRadius: '15px', background: selectedPhonic.color, border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                                        onClick={() => speak(selectedPhonic.word)}
                                    >
                                        📢 Speak Sound
                                    </button>
                                </div>
                             </div>
                         )}
                    </div>
                )}

                {activeSection === 'tracing' && (
                    <div style={{ textAlign: 'center' }}>
                         <h2 style={{ marginBottom: '20px' }}>Magic Tracing Practice ✍️</h2>
                         <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                            {['A','B','C','1','2','3'].map(l => (
                                <button key={l} onClick={() => setTraceLetter(l)} style={{ padding: '10px 20px', borderRadius: '10px', background: traceLetter === l ? '#f97316' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer' }}>{l}</button>
                            ))}
                         </div>
                         <div style={{ background: '#0f172a', borderRadius: '20px', display: 'inline-block', padding: '10px', position: 'relative' }}>
                            {/* Overlay Letter for Tracing */}
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '250px', fontWeight: '900', color: 'rgba(255,255,255,0.05)', pointerEvents: 'none', userSelect: 'none' }}>
                                {traceLetter}
                            </div>
                            <canvas
                                onMouseDown={startDrawing}
                                onMouseUp={finishDrawing}
                                onMouseMove={draw}
                                ref={canvasRef}
                                style={{ position: 'relative', zIndex: 1 }}
                            />
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={clearCanvas} style={{ padding: '10px 25px', borderRadius: '15px', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer' }}>🧽 Clean Board</button>
                        </div>
                    </div>
                )}

                {activeSection === 'music' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '40px', color: '#4ade80' }}>Magical Animal Piano 🎹🐾</h2>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', height: '300px' }}>
                            {[
                                { color: '#ef4444', ani: '🐶', note: 'Do' },
                                { color: '#fbbf24', ani: '🐱', note: 'Re' },
                                { color: '#10b981', ani: '🦁', note: 'Mi' },
                                { color: '#3b82f6', ani: '🐘', note: 'Fa' },
                                { color: '#8b5cf6', ani: '🐵', note: 'So' },
                                { color: '#ec4899', ani: '🐸', note: 'La' }
                            ].map((k, i) => (
                                <button 
                                    key={i}
                                    onClick={() => alert(`🎶 Playing ${k.note}! ${k.ani} says hello!`)}
                                    className="piano-key"
                                    style={{ 
                                        width: '80px', 
                                        height: '100%', 
                                        background: k.color, 
                                        borderRadius: '0 0 20px 20px', 
                                        border: 'none', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'flex-end', 
                                        paddingBottom: '30px', 
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.1s'
                                    }}
                                >
                                    <span style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{k.ani}</span>
                                    <span style={{ fontWeight: 'bold', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{k.note}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'diary' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '40px', color: '#f87171' }}>Recording My Day! 🎤📔</h2>
                        <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: recState === 'recording' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: `4px solid ${recState === 'recording' ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.3s' }}>
                            <button 
                                onClick={() => {
                                    if (recState === 'idle') setRecState('recording');
                                    else {
                                        setRecState('done');
                                        mockApi.saveVoiceDiary('STU2026-001', 'simulated_audio');
                                        alert("🎤 Amazing! Your voice has been sent to your teacher. Teacher will listen and give you a star! ⭐");
                                        setTimeout(() => setRecState('idle'), 2000);
                                    }
                                }}
                                style={{ 
                                    width: '120px', 
                                    height: '120px', 
                                    borderRadius: '50%', 
                                    background: recState === 'recording' ? '#ef4444' : '#fff', 
                                    border: 'none', 
                                    fontSize: '3rem', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                                    animation: recState === 'recording' ? 'pulse 1s infinite' : 'none'
                                }}
                            >
                                {recState === 'recording' ? '⏹' : '🎤'}
                            </button>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', opacity: 0.8 }}>
                            {recState === 'idle' && "Tap the Mic to start talking!"}
                            {recState === 'recording' && "Listening... Talk about your day!"}
                            {recState === 'done' && "Sent Successfully! ✅"}
                        </h3>
                        <p style={{ marginTop: '30px', color: '#94a3b8', maxWidth: '400px', margin: '30px auto 0' }}>Bataiye aaj aapne school mein kya seekha aur aapne kya maza kiya! 🐶</p>
                    </div>
                )}



                {activeSection === 'shala' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setActiveAcademicGame('tables')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'tables' ? '#6366f1' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✖️ Table Challenge</button>
                            <button onClick={() => setActiveAcademicGame('spelling')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'spelling' ? '#a855f7' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🔠 Spelling</button>
                            <button onClick={() => setActiveAcademicGame('math')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'math' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>➕ Math</button>
                            <button onClick={() => setActiveAcademicGame('body')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'body' ? '#ef4444' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>👦 Body</button>
                            <button onClick={() => {
                                setActiveAcademicGame('time');
                                setTargetHour(Math.floor(Math.random() * 12) + 1);
                                speak("Chalo time seekhte hain!");
                            }} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'time' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🕰️ Time</button>
                            <button onClick={() => setActiveAcademicGame('opposites')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'opposites' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>⬆️ Opposites</button>
                            <button onClick={() => setActiveAcademicGame('habits')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'habits' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✨ Habits</button>
                            <button onClick={() => { setActiveAcademicGame('shapes'); setCurrentShapeTask(shapeChallenge[Math.floor(Math.random()*shapeChallenge.length)]); speak("Match the shape!"); }} style={{ padding: '12px 25px', borderRadius: '15px', background: activeAcademicGame === 'shapes' ? '#06b6d4' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🟦 Shapes</button>
                        </div>

                        {activeAcademicGame === 'tables' && (
                            <div style={{ height: '450px', background: 'rgba(0,0,0,0.3)', borderRadius: '30px', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '2rem', color: '#6366f1' }}>Learning Table of 2! 🔢</h3>
                                    <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', margin: '20px 0' }}>
                                        2 x {tableStep} = <span style={{ color: '#fbbf24' }}>?</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                        {[tableStep * 2, tableStep * 2 + 2, tableStep * 2 - 2].sort((a,b) => a-b).map(val => (
                                            <button 
                                                key={val}
                                                onClick={() => {
                                                    if (val === tableStep * 2) {
                                                        speak(`Two times ${tableStep} equals ${val}`);
                                                        if (tableStep < 10) setTableStep(s => s + 1);
                                                        else {
                                                            speak("Wah! Aapne pura table seekh liya!");
                                                            setTableStep(1);
                                                        }
                                                        setGameScore(s => s + 20);
                                                    } else {
                                                        speak("Oops! Phir se socho!");
                                                    }
                                                }}
                                                style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#6366f1', color: '#fff', fontSize: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '40px', opacity: 0.6 }}>Click the correct answer to move forward! 🚀</p>
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'spelling' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                                <div style={{ fontSize: '8rem', transition: 'all 0.3s' }}>{currentSpelling.hint}</div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    {currentSpelling.letters.map((L, i) => (
                                        <div key={i} style={{ width: '80px', height: '80px', border: '4px dashed rgba(255,255,255,0.2)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: '900', color: '#a855f7' }}>
                                            {currentSpelling.guessed[i] || ''}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                                    {[...currentSpelling.letters].sort(() => Math.random() - 0.5).map((L, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => {
                                                const newGuessed = [...currentSpelling.guessed];
                                                const nextIndex = newGuessed.findIndex(val => val === undefined || val === '');
                                                const targetIndex = nextIndex === -1 ? newGuessed.length : nextIndex;
                                                
                                                if (L === currentSpelling.letters[targetIndex]) {
                                                    newGuessed[targetIndex] = L;
                                                    setCurrentSpelling({ ...currentSpelling, guessed: newGuessed });
                                                    speak(L);
                                                    if (newGuessed.filter(x => x).length === currentSpelling.letters.length) {
                                                        speak(`Wah! ${currentSpelling.word}!`);
                                                        setGameScore(s => s + 50);
                                                        setTimeout(() => {
                                                            const words = [{w:'DOG',h:'🐶'}, {w:'BALL',h:'⚽'}, {w:'SUN',h:'☀️'}];
                                                            const next = words[Math.floor(Math.random()*words.length)];
                                                            setCurrentSpelling({ word: next.w, hint: next.h, letters: next.w.split(''), guessed: [] });
                                                        }, 2000);
                                                    }
                                                } else {
                                                    speak("Ghalat! Try again!");
                                                }
                                            }}
                                            style={{ width: '70px', height: '70px', borderRadius: '15px', background: '#a855f7', color: '#fff', fontSize: '2.5rem', fontWeight: '900', border: 'none', cursor: 'pointer' }}
                                        >
                                            {L}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'math' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px' }}>
                                <div style={{ fontSize: '4rem', fontWeight: '900', color: '#fff', marginBottom: '40px' }}>
                                    {mathMagic.a} {mathMagic.op} {mathMagic.b} = ?
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                                    {Array.from({ length: mathMagic.a }).map((_, i) => <span key={`a-${i}`} style={{ fontSize: '3rem' }}>🍎</span>)}
                                    <span style={{ fontSize: '3rem', margin: '0 20px' }}>➕</span>
                                    {Array.from({ length: mathMagic.b }).map((_, i) => <span key={`b-${i}`} style={{ fontSize: '3rem' }}>🍎</span>)}
                                </div>
                                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                    {mathMagic.options.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => {
                                                if (opt === mathMagic.ans) {
                                                    speak(`Wah! ${mathMagic.a} plus ${mathMagic.b} equals ${mathMagic.ans}!`);
                                                    setGameScore(s => s + 30);
                                                    setTimeout(() => {
                                                        const a = Math.floor(Math.random() * 5) + 1;
                                                        const b = Math.floor(Math.random() * 5) + 1;
                                                        setMathMagic({ a, b, op:'+', ans: a+b, options: [a+b, a+b+1, a+b-1].sort(() => Math.random()-0.5) });
                                                    }, 2000);
                                                } else {
                                                    speak("Phir se count karo!");
                                                }
                                            }}
                                            style={{ width: '100px', height: '100px', borderRadius: '20px', background: '#f59e0b', color: '#fff', fontSize: '3rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'body' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', padding: '30px' }}>
                                <div style={{ fontSize: '15rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🧒</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center' }}>
                                    {[
                                        { icon: '👁️', name: 'Aankhein (Eyes)', use: 'dekhne ke liye' },
                                        { icon: '👂', name: 'Kaan (Ears)', use: 'sun-ne ke liye' },
                                        { icon: '👃', name: 'Naak (Nose)', use: 'soonghne ke liye' },
                                        { icon: '👄', name: 'Munh (Mouth)', use: 'bolne aur khane ke liye' },
                                        { icon: '✋', name: 'Haath (Hands)', use: 'kaam karne ke liye' }
                                    ].map(p => (
                                        <button 
                                            key={p.name} 
                                            onClick={() => speak(`Ye hamari ${p.name} hain, ${p.use}!`)}
                                            style={{ padding: '15px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '1.1rem' }}
                                        >
                                            <span style={{ fontSize: '2rem' }}>{p.icon}</span>
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'time' && (
                            <div style={{ height: '450px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                                <h3 style={{ fontSize: '2rem', color: '#10b981' }}>Chalo {targetHour} bajate hain! 🕰️</h3>
                                <div style={{ width: '250px', height: '250px', borderRadius: '50%', border: '10px solid #fff', position: 'relative', background: '#fff', boxShadow: '0 0 30px rgba(0,0,0,0.3)' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '4px', height: '80px', background: '#333', transformOrigin: 'bottom', transform: `translate(-50%, -100%) rotate(${clockHour * 30}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', background: '#333', borderRadius: '50%', transform: 'translate(-50%, -50%)' }}></div>
                                    {[12, 3, 6, 9].map(n => {
                                        const pos = {
                                            12: { top: 10, left: '50%', transform: 'translateX(-50%)' },
                                            3: { right: 15, top: '50%', transform: 'translateY(-50%)' },
                                            6: { bottom: 10, left: '50%', transform: 'translateX(-50%)' },
                                            9: { left: 15, top: '50%', transform: 'translateY(-50%)' }
                                        }[n];
                                        return (
                                            <div key={n} style={{ position: 'absolute', color: '#333', fontWeight: 'bold', fontSize: '1.5rem', ...pos }}>
                                                {n}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <button onClick={() => setClockHour(h => h > 1 ? h - 1 : 12)} style={{ padding: '10px 20px', borderRadius: '15px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>◀️</button>
                                    <button 
                                        onClick={() => {
                                            if (clockHour === targetHour) {
                                                speak(`Wah! ${targetHour} baj gaye! ⭐`);
                                                setGameScore(s => s + 30);
                                                setTimeout(() => {
                                                    setTargetHour(Math.floor(Math.random() * 12) + 1);
                                                    speak("Ab ek aur time set karo!");
                                                }, 2000);
                                            } else {
                                                speak(`${clockHour} baje hain, hame ${targetHour} bajane hain!`);
                                            }
                                        }}
                                        style={{ padding: '10px 30px', borderRadius: '15px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Check Time! ✅
                                    </button>
                                    <button onClick={() => setClockHour(h => h < 12 ? h + 1 : 1)} style={{ padding: '10px 20px', borderRadius: '15px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>▶️</button>
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'opposites' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '10rem', animation: 'bounce 2s infinite' }}>{oppositePair.qIcon}</div>
                                        <div style={{ padding: '10px 20px', borderRadius: '15px', background: '#3b82f6', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>{oppositePair.q}</div>
                                    </div>
                                    <div style={{ fontSize: '3rem', opacity: 0.3 }}>VS</div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '10rem', animation: 'bounce 2s infinite', animationDelay: '1s' }}>{oppositePair.aIcon}</div>
                                        <div style={{ padding: '10px 20px', borderRadius: '15px', background: '#f43f5e', color: '#fff', fontWeight: 'bold', fontSize: '1.5rem' }}>{oppositePair.a}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        const pairs = [
                                            { q: 'BIG', a: 'Small', qIcon: '🐘', aIcon: '🐜' },
                                            { q: 'HOT', a: 'Cold', qIcon: '☕', aIcon: '🍦' },
                                            { q: 'DAY', a: 'Night', qIcon: '☀️', aIcon: '🌙' },
                                            { q: 'UP', a: 'Down', qIcon: '⬆️', aIcon: '⬇️' }
                                        ];
                                        const next = pairs[(pairs.findIndex(p => p.q === oppositePair.q) + 1) % pairs.length];
                                        setOppositePair(next);
                                        speak(`${next.q} ka opposite hota hai ${next.a}!`);
                                    }}
                                    style={{ padding: '15px 30px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
                                >
                                    Next Opposite ➡️
                                </button>
                            </div>
                        )}

                        {activeAcademicGame === 'shapes' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '12rem', opacity: 0.1 }}>{currentShapeTask?.silhouette}</div>
                                        <div style={{ marginTop: '-80px', fontSize: '10rem', animation: 'bounce 2s infinite' }}>?</div>
                                    </div>
                                    <div style={{ fontSize: '3rem' }}>⬅️</div>
                                    <div style={{ fontSize: '2rem', color: '#06b6d4', fontWeight: 'bold' }}>Match this shape!</div>
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {shapeChallenge.map(s => (
                                        <button 
                                            key={s.id}
                                            onClick={() => {
                                                if (s.id === currentShapeTask.id) {
                                                    speak(`Wah! Ye ${s.shape} hai! ⭐`);
                                                    setGameScore(s => s + 40);
                                                    setTimeout(() => {
                                                        const next = shapeChallenge[Math.floor(Math.random() * shapeChallenge.length)];
                                                        setCurrentShapeTask(next);
                                                        speak("Ab iska match dhundo!");
                                                    }, 2000);
                                                } else {
                                                    speak("Nahi! Socho!");
                                                }
                                            }}
                                            style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div style={{ fontSize: '5rem' }}>{s.icon}</div>
                                            <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{s.shape}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeAcademicGame === 'habits' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                                {[
                                    { q: 'Hame roj Brush karna chahiye?', a: true, icon: '🪥', msg: 'Sahi! Brush karne se dant saaf rehte hain!' },
                                    { q: 'Kya hame TV ke bahut pass baithna chahiye?', a: false, icon: '📺', msg: 'Ghalat! TV dur se dekhna chahiye!' },
                                    { q: 'Khane se pehle hath dhona achha hai?', a: true, icon: '🧼', msg: 'Bilkul! Isse germs dur rehte hain!' },
                                    { q: 'Kya hame raste par kachra fekna chahiye?', a: false, icon: '🗑️', msg: 'Nahi! Kachra hamesha dustbin mein dalein!' }
                                ].slice(habitStep, habitStep + 1).map(h => (
                                    <div key={h.q} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '8rem', marginBottom: '20px' }}>{h.icon}</div>
                                        <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '40px' }}>{h.q}</h3>
                                        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => {
                                                    if (h.a === true) {
                                                        speak(h.msg);
                                                        setGameScore(s => s + 20);
                                                        setHabitStep(s => (s + 1) % 4);
                                                    } else {
                                                        speak("Socho! Kya ye sahi aadat hai?");
                                                    }
                                                }}
                                                style={{ padding: '20px 50px', borderRadius: '20px', background: '#10b981', color: '#fff', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                YES ✅
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (h.a === false) {
                                                        speak(h.msg);
                                                        setGameScore(s => s + 20);
                                                        setHabitStep(s => (s + 1) % 4);
                                                    } else {
                                                        speak("Nahi! Ye to achhi aadat hai!");
                                                    }
                                                }}
                                                style={{ padding: '20px 50px', borderRadius: '20px', background: '#ef4444', color: '#fff', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                            >
                                                NO ❌
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'mastery' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        {/* Sub-Tabs for Mastery Kona */}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                            <button onClick={() => setActiveMasteryGame('alphabet')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'alphabet' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🅰️ A-Z</button>
                            <button onClick={() => setActiveMasteryGame('hindi')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'hindi' ? '#4f46e5' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🕉️ Varnamala</button>
                            <button onClick={() => setActiveMasteryGame('counting')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'counting' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🔢 1-100</button>
                            <button onClick={() => setActiveMasteryGame('tables')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'tables' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📊 Pahada</button>
                            <button onClick={() => { setActiveMasteryGame('nature'); setMasteryCategory('fruits'); setMasteryCatData(mockApi.getCategoryData('fruits')); }} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'nature' ? '#a855f7' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🌳 Nature</button>
                            <button onClick={() => { setActiveMasteryGame('calendar'); setMasteryCatData(mockApi.getCategoryData('days')); }} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'calendar' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📅 Days</button>
                            <button onClick={() => { setActiveMasteryGame('math'); setMasteryMath(mockApi.getMasteryMath('sub')); }} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'math' ? '#f43f5e' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🧮 Math Lab</button>
                            <button onClick={() => setActiveMasteryGame('writing')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'writing' ? '#06b6d4' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✍️ Likhna Seekho</button>
                            <button onClick={() => { setActiveMasteryGame('challenge'); startMasteryChallenge(); }} style={{ padding: '10px 20px', borderRadius: '15px', background: activeMasteryGame === 'challenge' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎯 Pehchaano Mode</button>
                        </div>

                        {/* Alphabet Section */}
                        {activeMasteryGame === 'alphabet' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', maxHeight: '500px', overflowY: 'auto' }}>
                                {masteryAlphabet.map(item => (
                                    <button 
                                        key={item.l}
                                        onClick={() => speak(`${item.l} for ${item.w}! Hindi mein ${item.h}!`, 'mastery')}
                                        style={{ padding: '20px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div style={{ fontSize: '3.5rem', fontWeight: '950', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>{item.l}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '5px' }}>{item.w}</div>
                                        <div style={{ fontSize: '2rem', marginTop: '5px' }}>{item.e}</div>
                                        <div style={{ fontSize: '1rem', opacity: 0.6, marginTop: '5px' }}>{item.h}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Counting Section */}
                        {activeMasteryGame === 'counting' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', maxHeight: '500px', overflowY: 'auto' }}>
                                {mockApi.getCountingData().map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => speak(num.toString(), 'mastery')}
                                        style={{ padding: '15px 5px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', color: num % 10 === 0 ? '#10b981' : '#fff' }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Hindi Varnamala Section */}
                        {activeMasteryGame === 'hindi' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '15px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', maxHeight: '500px', overflowY: 'auto' }}>
                                {masteryHindi.map(item => (
                                    <button 
                                        key={item.l}
                                        onClick={() => speak(`${item.h}!`, 'mastery')}
                                        style={{ padding: '15px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div style={{ fontSize: '3.5rem', fontWeight: '950', color: '#ef4444' }}>{item.l}</div>
                                        <div style={{ fontSize: '2rem', marginTop: '5px' }}>{item.e}</div>
                                        <div style={{ fontSize: '0.9rem', opacity: 0.6, marginTop: '5px' }}>{item.w}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tables Section */}
                        {activeMasteryGame === 'tables' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px' }}>
                                    {Array.from({ length: 19 }, (_, i) => i + 2).map(n => (
                                        <button 
                                            key={n}
                                            onClick={() => setMasteryTableNum(n)}
                                            style={{ width: '50px', height: '50px', borderRadius: '12px', background: masteryTableNum === n ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', width: '100%', maxWidth: '500px', background: 'rgba(0,0,0,0.2)', padding: '30px', borderRadius: '30px' }}>
                                    {mockApi.getTablesData(masteryTableNum).map(row => (
                                        <div key={row.mult} onClick={() => speak(`${masteryTableNum} times ${row.mult} is ${row.res}`, 'mastery')} style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                            {masteryTableNum} × {row.mult} = <span style={{ color: '#8b5cf6' }}>{row.res}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nature & Categories Section */}
                        {(activeMasteryGame === 'nature' || activeMasteryGame === 'calendar') && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                {activeMasteryGame === 'nature' && (
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        {['fruits', 'animals', 'birds'].map(cat => (
                                            <button 
                                                key={cat}
                                                onClick={() => { setMasteryCategory(cat); setMasteryCatData(mockApi.getCategoryData(cat)); }}
                                                style={{ padding: '10px 20px', borderRadius: '12px', background: masteryCategory === cat ? '#a855f7' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', padding: '20px' }}>
                                    {masteryCatData.map(item => (
                                        <div 
                                            key={item.n}
                                            onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`, 'mastery')}
                                            style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                                        >
                                            <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                            <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Math Lab Section */}
                        {activeMasteryGame === 'math' && (
                            <div style={{ padding: '40px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <button onClick={() => setMasteryMath(mockApi.getMasteryMath('sub'))} style={{ padding: '15px 30px', borderRadius: '15px', background: masteryMath.op === '-' ? '#ef4444' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>➖ Subtraction</button>
                                    <button onClick={() => setMasteryMath(mockApi.getMasteryMath('div'))} style={{ padding: '15px 30px', borderRadius: '15px', background: masteryMath.op === '÷' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>➗ Division</button>
                                </div>
                                <div style={{ fontSize: '8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '30px' }}>
                                    <span>{masteryMath.a}</span>
                                    <span style={{ color: '#ef4444' }}>{masteryMath.op}</span>
                                    <span>{masteryMath.b}</span>
                                    <span>=</span>
                                    <div style={{ width: '150px', height: '150px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '4px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                        ?
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {[masteryMath.ans, masteryMath.ans + 2, Math.max(0, masteryMath.ans - 3)].sort(() => Math.random() - 0.5).map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => {
                                                if (opt === masteryMath.ans) {
                                                    speak(`Wah! Sahi Jawab! ${masteryMath.a} ${masteryMath.op === '-' ? 'minus' : 'divided by'} ${masteryMath.b} hota hai ${masteryMath.ans}!`, 'mastery');
                                                    setGameScore(s => s + 50);
                                                    triggerConfetti();
                                                    setTimeout(() => setMasteryMath(mockApi.getMasteryMath(masteryMath.op === '-' ? 'sub' : 'div')), 2000);
                                                } else {
                                                    speak("Nahi! Socho!");
                                                }
                                            }}
                                            style={{ padding: '20px 40px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontSize: '2rem', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pehchaano Mode (Challenge) Section */}
                        {activeMasteryGame === 'challenge' && masteryChallenge && (
                            <div style={{ padding: '40px', background: 'rgba(255,255,255,0.03)', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(245,158,11,0.2)', padding: '20px 40px', borderRadius: '30px', border: '2px solid #f59e0b' }}>
                                    <div style={{ fontSize: '4rem' }}>🤔</div>
                                    <h2 style={{ fontSize: '2.2rem', color: '#fff', margin: 0 }}>{masteryChallenge.question}</h2>
                                </div>
                                <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {masteryChallenge.options.map((opt, i) => {
                                        const isObj = typeof opt === 'object';
                                        const val = isObj ? opt.n : opt;
                                        return (
                                            <button 
                                                key={i}
                                                onClick={() => {
                                                    if (val === masteryChallenge.ans) {
                                                        speak("Shabash! Sahi Pehchana! ⭐");
                                                        setGameScore(s => s + 100);
                                                        triggerConfetti();
                                                        setTimeout(startMasteryChallenge, 2000);
                                                    } else {
                                                        speak("Nahi! Ek baar fir socho!");
                                                    }
                                                }}
                                                style={{ padding: '40px', borderRadius: '35px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', minWidth: '180px', transition: 'all 0.3s' }}
                                            >
                                                {isObj && <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{opt.e}</div>}
                                                <div style={{ fontSize: isObj ? '1.5rem' : '5rem', fontWeight: '900', color: '#fff' }}>{val}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={startMasteryChallenge} style={{ padding: '15px 30px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: '#aaa', border: 'none', cursor: 'pointer' }}>Skip Question ➡️</button>
                            </div>
                        )}

                        {/* Writing (Likhna Seekho) Section */}
                        {activeMasteryGame === 'writing' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
                                    {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => (
                                        <button 
                                            key={l}
                                            onClick={() => { setTracingLetter(l); speak(`Chalo ${l} likhte hain!`); }}
                                            style={{ width: '40px', height: '40px', borderRadius: '10px', background: tracingLetter === l ? '#06b6d4' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            {l}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ position: 'relative', width: '500px', height: '500px', background: '#fff', borderRadius: '30px', cursor: 'crosshair', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30rem', fontWeight: '900', color: 'rgba(0,0,0,0.05)', userSelect: 'none', pointerEvents: 'none' }}>
                                        {tracingLetter}
                                    </div>
                                    <canvas 
                                        onMouseDown={(e) => {
                                            const canvas = e.target;
                                            const ctx = canvas.getContext('2d');
                                            ctx.beginPath();
                                            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                            canvas.isDrawing = true;
                                            ctx.strokeStyle = '#06b6d4';
                                            ctx.lineWidth = 15;
                                            ctx.lineCap = 'round';
                                        }}
                                        onMouseMove={(e) => {
                                            if (!e.target.isDrawing) return;
                                            const canvas = e.target;
                                            const ctx = canvas.getContext('2d');
                                            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                            ctx.stroke();
                                        }}
                                        onMouseUp={(e) => e.target.isDrawing = false}
                                        onMouseLeave={(e) => e.target.isDrawing = false}
                                        width={500}
                                        height={500}
                                        style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
                                    />
                                    <button 
                                        onClick={(e) => {
                                            const canvas = e.target.parentElement.querySelector('canvas');
                                            const ctx = canvas.getContext('2d');
                                            ctx.clearRect(0, 0, 500, 500);
                                            speak("Safai ho gayi! Fir se likho!");
                                        }}
                                        style={{ position: 'absolute', bottom: '20px', right: '20px', padding: '10px 20px', borderRadius: '15px', background: '#f43f5e', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 }}
                                    >
                                        Mitao 🧹
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        
                    </div>
                )}

                {activeSection === 'duniya' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                            {[
                                { id: 'animals', icon: '🦁', name: 'Animals' },
                                { id: 'birds', icon: '🐦', name: 'Birds' },
                                { id: 'fruits', icon: '🍎', name: 'Fruits' },
                                { id: 'veggies', icon: '🥦', name: 'Veggies' },
                                { id: 'colors', icon: '🔴', name: 'Colors' },
                                { id: 'shapes', icon: '📐', name: 'Shapes' },
                                { id: 'body', icon: '🚶', name: 'Body/Senses' },
                                { id: 'time', icon: '🗓️', name: 'Time/Days' },
                                { id: 'habits', icon: '🧼', name: 'Habits' },
                                { id: 'symbols', icon: '🇮🇳', name: 'Symbols' },
                                { id: 'seasons', icon: '🌦️', name: 'Seasons' },
                                { id: 'homes', icon: '🏠', name: 'Homes' },
                                { id: 'opposites', icon: '🔄', name: 'Opposites' },
                                { id: 'actions', icon: '🏃', name: 'Actions' },
                                { id: 'space', icon: '🚀', name: 'Space' },
                                { id: 'helpers', icon: '🧑‍⚕️', name: 'Helpers' }
                            ].map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => { setActiveDuniyaGame(cat.id); playMagicSound('sparkle'); }}
                                    style={{ 
                                        padding: '12px 20px', 
                                        borderRadius: '15px', 
                                        background: activeDuniyaGame === cat.id ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(255,255,255,0.05)', 
                                        color: '#fff', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: activeDuniyaGame === cat.id ? '0 0 15px rgba(139,92,246,0.3)' : 'none'
                                    }}
                                >
                                    <span>{cat.icon}</span> {cat.name}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', padding: '10px' }}>
                            {/* Animals */}
                            {activeDuniyaGame === 'animals' && [
                                { n: 'Lion', h: 'Sher', e: '🦁' }, { n: 'Tiger', h: 'Baagh', e: '🐯' }, { n: 'Elephant', h: 'Haathi', e: '🐘' },
                                { n: 'Dog', h: 'Kutta', e: '🐶' }, { n: 'Cat', h: 'Billi', e: '🐱' }, { n: 'Horse', h: 'Ghoda', e: '🐎' },
                                { n: 'Cow', h: 'Gaay', e: '🐄' }, { n: 'Monkey', h: 'Bandar', e: '🐒' }, { n: 'Giraffe', h: 'Giraffe', e: '🦒' },
                                { n: 'Zebra', h: 'Zebra', e: '🦓' }, { n: 'Rabbit', h: 'Khargosh', e: '🐰' }, { n: 'Panda', h: 'Panda', e: '🐼' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Birds */}
                            {activeDuniyaGame === 'birds' && [
                                { n: 'Parrot', h: 'Tota', e: '🦜' }, { n: 'Peacock', h: 'Mor', e: '🦚' }, { n: 'Sparrow', h: 'Chidiya', e: '🐦' },
                                { n: 'Owl', h: 'Ullu', e: '🦉' }, { n: 'Eagle', h: 'Baaz', e: '🦅' }, { n: 'Duck', h: 'Battakh', e: '🦆' },
                                { n: 'Swan', h: 'Hans', e: '🦢' }, { n: 'Penguin', h: 'Penguin', e: '🐧' }, { n: 'Rooster', h: 'Murga', e: '🐓' },
                                { n: 'Dove', h: 'Kabootar', e: '🕊️' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Fruits */}
                            {activeDuniyaGame === 'fruits' && [
                                { n: 'Apple', h: 'Seb', e: '🍎' }, { n: 'Banana', h: 'Kela', e: '🍌' }, { n: 'Mango', h: 'Aam', e: '🥭' },
                                { n: 'Grapes', h: 'Angoor', e: '🍇' }, { n: 'Watermelon', h: 'Tarbooz', e: '🍉' }, { n: 'Orange', h: 'Santra', e: '🍊' },
                                { n: 'Strawberry', h: 'Strawberry', e: '🍓' }, { n: 'Pineapple', h: 'Ananas', e: '🍍' }, { n: 'Cherry', h: 'Cherry', e: '🍒' },
                                { n: 'Kiwi', h: 'Kiwi', e: '🥝' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Veggies */}
                            {activeDuniyaGame === 'veggies' && [
                                { n: 'Potato', h: 'Aloo', e: '🥔' }, { n: 'Tomato', h: 'Tamatar', e: '🍅' }, { n: 'Carrot', h: 'Gajar', e: '🥕' },
                                { n: 'Onion', h: 'Pyaz', e: '🧅' }, { n: 'Broccoli', h: 'Broccoli', e: '🥦' }, { n: 'Corn', h: 'Makka', e: '🌽' },
                                { n: 'Eggplant', h: 'Baingan', e: '🍆' }, { n: 'Cucumber', h: 'Kheera', e: '🥒' }, { n: 'Capsicum', h: 'Shimla Mirch', e: '🫑' },
                                { n: 'Spinach', h: 'Palak', e: '🥬' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Colors */}
                            {activeDuniyaGame === 'colors' && [
                                { n: 'Red', h: 'Laal', e: '🔴' }, { n: 'Blue', h: 'Neela', e: '🔵' }, { n: 'Green', h: 'Hara', e: '🟢' },
                                { n: 'Yellow', h: 'Peela', e: '🟡' }, { n: 'Orange', h: 'Narangi', e: '🟠' }, { n: 'Purple', h: 'Baingani', e: '🟣' },
                                { n: 'Pink', h: 'Gulabi', e: '🌸' }, { n: 'Black', h: 'Kaala', e: '⚫' }, { n: 'White', h: 'Safed', e: '⚪' },
                                { n: 'Brown', h: 'Bhura', e: '🟤' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Shapes */}
                            {activeDuniyaGame === 'shapes' && [
                                { n: 'Circle', h: 'Gola', e: '⭕' }, { n: 'Square', h: 'Varg', e: '🟦' }, { n: 'Triangle', h: 'Tikona', e: '📐' },
                                { n: 'Star', h: 'Tara', e: '⭐' }, { n: 'Heart', h: 'Dil', e: '💖' }, { n: 'Diamond', h: 'Diamond', e: '💎' },
                                { n: 'Oval', h: 'Andaakaar', e: '⚪' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Hindi mein इसे ${item.h} kehtein hain!`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Space */}
                            {activeDuniyaGame === 'space' && (planets || []).map(p => (
                                <div key={p.name} onClick={() => speak(`${p.name}. ${p.info}`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{p.icon}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{p.name}</div>
                                    <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '5px' }}>Explore Space!</div>
                                </div>
                            ))}

                            {/* Body & Senses */}
                            {activeDuniyaGame === 'body' && [
                                { n: 'Eyes', h: 'Aankhen', e: '👀', s: 'Sight (Dekhna)' },
                                { n: 'Ears', h: 'Kaan', e: '👂', s: 'Hearing (Sunna)' },
                                { n: 'Nose', h: 'Naak', e: '👃', s: 'Smell ( सूंघना)' },
                                { n: 'Tongue', h: 'Jeebh', e: '👅', s: 'Taste (Swaad)' },
                                { n: 'Hands', h: 'Haath', e: '✋', s: 'Touch (Chhuna)' },
                                { n: 'Legs', h: 'Paaw', e: '🦵', s: 'Walking (Chalna)' },
                                { n: 'Teeth', h: 'Daant', e: '🦷', s: 'Eating (Khana)' },
                                { n: 'Brain', h: 'Dimag', e: '🧠', s: 'Thinking (Sochna)' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! Used for ${item.s}`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Time & Calendar */}
                            {activeDuniyaGame === 'time' && [
                                { n: 'Monday', h: 'Somvaar', e: '📅' }, { n: 'Tuesday', h: 'Mangalvaar', e: '📅' },
                                { n: 'Wednesday', h: 'Budhvaar', e: '📅' }, { n: 'Thursday', h: 'Guruvaar', e: '📅' },
                                { n: 'Friday', h: 'Shukravaar', e: '📅' }, { n: 'Saturday', h: 'Shanivaar', e: '📅' },
                                { n: 'Sunday', h: 'Ravivaar', e: '🎉' }, { n: 'January', h: 'January', e: '❄️' },
                                { n: 'August', h: 'August', e: '🇮🇳' }, { n: 'December', h: 'December', e: '🎄' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(`${item.n}! It is a ${item.n.length > 7 ? 'Month' : 'Day'}`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Good Habits */}
                            {activeDuniyaGame === 'habits' && [
                                { n: 'Brush Teeth', h: 'Daant Saaf Karo', e: '🪥', msg: 'Har roz do baar brush karein!' },
                                { n: 'Wash Hands', h: 'Haath Dhowo', e: '🧼', msg: 'Khane se pehle haath dhowo!' },
                                { n: 'Bath Daily', h: 'Nahao', e: '🛀', msg: 'Roz nahana chahiye!' },
                                { n: 'Eat Healthy', h: 'Achha Khao', e: '🥗', msg: 'Fruits aur sabzi khao!' },
                                { n: 'Early to Bed', h: 'Jaldi Soyo', e: '😴', msg: 'Raat ko jaldi sona chahiye!' },
                                { n: 'Exercise', h: 'Kasrat', e: '🏃', msg: 'Roz thoda khelo aur exercise karo!' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(item.msg)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.n}</div>
                                    <div style={{ color: '#10b981', fontSize: '1rem', marginTop: '5px' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Opposites */}
                            {activeDuniyaGame === 'opposites' && [
                                { q: 'BIG', a: 'SMALL', e1: '🐘', e2: '🐜' },
                                { q: 'HOT', a: 'COLD', e1: '☀️', e2: '🍦' },
                                { q: 'UP', a: 'DOWN', e1: '🎈', e2: '⚓' },
                                { q: 'HAPPY', a: 'SAD', e1: '😊', e2: '😢' },
                                { q: 'DAY', a: 'NIGHT', e1: '☀️', e2: '🌙' },
                                { q: 'FAST', a: 'SLOW', e1: '🏎️', e2: '🐢' }
                            ].map(item => (
                                <div key={item.q} onClick={() => speak(`${item.q} ka ulta hota hai ${item.a}`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '4rem', marginBottom: '10px' }}>
                                        <span>{item.e1}</span>
                                        <span>{item.e2}</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.q} ↔️ {item.a}</div>
                                    <div style={{ color: '#f43f5e', fontSize: '0.9rem', marginTop: '5px' }}>Opposites</div>
                                </div>
                            ))}

                            {/* Action Words */}
                            {activeDuniyaGame === 'actions' && [
                                { n: 'Jump', h: 'Koodna', e: '🦘', msg: 'Boing! Chalo koodte hain!' },
                                { n: 'Run', h: 'Daudna', e: '🏃', msg: 'Bohot tez bhaago!' },
                                { n: 'Eat', h: 'Khana', e: '🍎', msg: 'Achha khana khao!' },
                                { n: 'Sleep', h: 'Sona', e: '😴', msg: 'Shhh! Sone do!' },
                                { n: 'Read', h: 'Padhna', e: '📚', msg: 'Chalo kahani padhte hain!' },
                                { n: 'Dance', h: 'Naachna', e: '💃', msg: 'Chalo thoda dance karte hain!' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(item.msg)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* National Symbols */}
                            {activeDuniyaGame === 'symbols' && [
                                { n: 'National Flag', h: 'Tiranga', e: '🇮🇳', s: 'Our pride, the Tricolor!' },
                                { n: 'National Animal', h: 'Baagh (Tiger)', e: '🐅', s: 'The mighty Royal Bengal Tiger!' },
                                { n: 'National Bird', h: 'Mor (Peacock)', e: '🦚', s: 'The beautiful dancing Peacock!' },
                                { n: 'National Flower', h: 'Kamal (Lotus)', e: '🪷', s: 'The symbol of purity!' },
                                { n: 'National Fruit', h: 'Aam (Mango)', e: '🥭', s: 'The King of Fruits!' },
                                { n: 'National Emblem', h: 'Ashok Stambh', e: '🏛️', s: 'Satyameva Jayate!' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(item.s)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#fbbf24', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Seasons */}
                            {activeDuniyaGame === 'seasons' && [
                                { n: 'Summer', h: 'Garmi', e: '☀️', s: 'It is very hot! Let us eat ice cream!' },
                                { n: 'Winter', h: 'Sardi', e: '❄️', s: 'Brrr! Wear your sweater and cap!' },
                                { n: 'Monsoon', h: 'Baarish', e: '🌧️', s: 'Rainy day! Use your umbrella!' },
                                { n: 'Spring', h: 'Basant', e: '🌸', s: 'Flowers are blooming everywhere!' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(item.s)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{item.e}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.n}</div>
                                    <div style={{ color: '#60a5fa', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Animal Homes */}
                            {activeDuniyaGame === 'homes' && [
                                { a: 'Lion', h: 'Den (Gupha)', e1: '🦁', e2: '🪨' },
                                { a: 'Bird', h: 'Nest (Ghosla)', e1: '🐦', e2: '🪹' },
                                { a: 'Bee', h: 'Hive (Chhatta)', e1: '🐝', e2: '🍯' },
                                { a: 'Cow', h: 'Shed (Gaushala)', e1: '🐄', e2: '🏠' },
                                { a: 'Spider', h: 'Web (Jaal)', e1: '🕷️', e2: '🕸️' },
                                { a: 'Ant', h: 'Hill (Bambi)', e1: '🐜', e2: '🏜️' }
                            ].map(item => (
                                <div key={item.a} onClick={() => speak(`${item.a} lives in a ${item.h}`)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '4rem', marginBottom: '10px' }}>
                                        <span>{item.e1}</span>
                                        <span>{item.e2}</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.a} Home</div>
                                    <div style={{ color: '#10b981', fontSize: '1.1rem' }}>{item.h}</div>
                                </div>
                            ))}

                            {/* Helpers */}
                            {activeDuniyaGame === 'helpers' && [
                                { role: 'Doctor', icon: '👨‍⚕️', msg: 'Doctor hame theek karte hain!', color: '#ef4444' },
                                { role: 'Firefighter', icon: '👩‍🚒', msg: 'Firefighter aag bujhate hain!', color: '#f59e0b' },
                                { role: 'Teacher', icon: '👩‍🏫', msg: 'Teacher hame padhate hain!', color: '#a855f7' },
                                { role: 'Police', icon: '👮', msg: 'Police hamari raksha karte hain!', color: '#3b82f6' }
                            ].map(h => (
                                <div key={h.role} onClick={() => speak(h.msg)} className="card-vibe" style={{ padding: '25px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: `2px solid ${h.color}`, cursor: 'pointer', textAlign: 'center' }}>
                                    <div style={{ fontSize: '5rem', marginBottom: '10px' }}>{h.icon}</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{h.role}</div>
                                    <div style={{ color: h.color, fontSize: '0.9rem', marginTop: '5px' }}>Community Helper</div>
                                </div>
                            ))}
                        </div>
                        
                        {!activeDuniyaGame && (
                            <div style={{ padding: '60px', opacity: 0.5 }}>
                                <div style={{ fontSize: '6rem', animation: 'bounce 3s infinite' }}>🌍</div>
                                <h2 style={{ marginTop: '20px' }}>Welcome to Knowledge World!</h2>
                                <p>Click a category above to start exploring! ✨</p>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'gyan' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setActiveGyanGame('hindi')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeGyanGame === 'hindi' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🅰️ Hindi</button>
                            <button onClick={() => setActiveGyanGame('food')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeGyanGame === 'food' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🍎 Sehat</button>
                            <button onClick={() => setActiveGyanGame('traffic')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeGyanGame === 'traffic' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🚦 Sadak</button>
                            <button onClick={() => setActiveGyanGame('transport')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeGyanGame === 'transport' ? '#6366f1' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✈️ Yatayat</button>
                        </div>

                        {activeGyanGame === 'hindi' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px' }}>
                                {[
                                    { l: 'अ', w: 'Anar', e: '🍎', c: '#ef4444' },
                                    { l: 'आ', w: 'Aam', e: '🥭', c: '#f59e0b' },
                                    { l: 'इ', w: 'Imli', e: '🍂', c: '#b45309' },
                                    { l: 'ई', w: 'Eekh', e: '🎋', c: '#10b981' },
                                    { l: 'उ', w: 'Ullu', e: '🦉', c: '#6366f1' },
                                    { l: 'क', w: 'Kabutar', e: '🐦', c: '#94a3b8' },
                                    { l: 'ख', w: 'Khargosh', e: '🐰', c: '#fff' },
                                    { l: 'ग', w: 'Gamla', e: '🪴', c: '#059669' },
                                    { l: 'घ', w: 'Ghar', e: '🏠', c: '#3b82f6' },
                                    { l: 'च', w: 'Chammach', e: '🥄', c: '#e2e8f0' }
                                ].map(item => (
                                    <button 
                                        key={item.l}
                                        onClick={() => {
                                            setHindiLetter(item);
                                            speak(`${item.l} se ${item.w}`);
                                        }}
                                        style={{ padding: '20px', borderRadius: '20px', background: item.c + '20', border: `2px solid ${item.c}`, cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div style={{ fontSize: '3rem', fontWeight: '900', color: item.c }}>{item.l}</div>
                                        {hindiLetter?.l === item.l && (
                                            <div style={{ marginTop: '10px', fontSize: '1.5rem', animation: 'bounce 1s' }}>{item.e}</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeGyanGame === 'food' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', height: '450px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', padding: '40px' }}>
                                <div style={{ fontSize: '8rem', animation: 'float 3s infinite ease-in-out' }}>{foodPair.item}</div>
                                <h3 style={{ fontSize: '2rem' }}>Ye kya hai? {foodPair.name}</h3>
                                <div style={{ display: 'flex', gap: '40px' }}>
                                    <button 
                                        onClick={() => {
                                            if (foodPair.type === 'healthy') {
                                                speak("Wah! Seb bohot sehatmand hota hai! ⭐");
                                                setGameScore(s => s + 50);
                                                const next = [{item:'🥦', type:'healthy', name:'Gobi'}, {item:'🍌', type:'healthy', name:'Kela'}, {item:'🍕', type:'junk', name:'Pizza'}][Math.floor(Math.random()*3)];
                                                setFoodPair(next);
                                            } else {
                                                speak("Nahi! Ye to junk food hai!");
                                            }
                                        }}
                                        style={{ padding: '20px 40px', borderRadius: '20px', background: '#10b981', color: '#fff', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        🥦 Sehatmand (Healthy)
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (foodPair.type === 'junk') {
                                                speak("Sahi pehchana! Hume junk food kam khana chahiye! ⭐");
                                                setGameScore(s => s + 50);
                                                const next = [{item:'🍎', type:'healthy', name:'Seb'}, {item:'🍬', type:'junk', name:'Candy'}, {item:'🥕', type:'healthy', name:'Gajar'}][Math.floor(Math.random()*3)];
                                                setFoodPair(next);
                                            } else {
                                                speak("Nahi! Fruits to sehatmand hote hain!");
                                            }
                                        }}
                                        style={{ padding: '20px 40px', borderRadius: '20px', background: '#ef4444', color: '#fff', border: 'none', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}
                                    >
                                        🍕 Junk Food
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeGyanGame === 'traffic' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', display: 'flex', gap: '50px', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ width: '100px', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: trafficState === 'red' ? '#ef4444' : '#1e1b1b', boxShadow: trafficState === 'red' ? '0 0 20px #ef4444' : 'none' }}></div>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: trafficState === 'yellow' ? '#eab308' : '#1e1b1b', boxShadow: trafficState === 'yellow' ? '0 0 20px #eab308' : 'none' }}></div>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: trafficState === 'green' ? '#10b981' : '#1e1b1b', boxShadow: trafficState === 'green' ? '0 0 20px #10b981' : 'none' }}></div>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h2 style={{ fontSize: '3rem', color: trafficState === 'red' ? '#ef4444' : trafficState === 'yellow' ? '#eab308' : '#10b981' }}>
                                        {trafficState === 'red' && 'RED: STOP! 🛑'}
                                        {trafficState === 'yellow' && 'YELLOW: WAIT! ⏳'}
                                        {trafficState === 'green' && 'GREEN: GO! 🟢'}
                                    </h2>
                                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                        <button onClick={() => { setTrafficState('red'); speak("Lal batti! Ruk jao!"); }} style={{ padding: '15px 30px', borderRadius: '15px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>RED</button>
                                        <button onClick={() => { setTrafficState('yellow'); speak("Peeli batti! Taiyar ho jao!"); }} style={{ padding: '15px 30px', borderRadius: '15px', background: '#eab308', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>YELLOW</button>
                                        <button onClick={() => { setTrafficState('green'); speak("Hari batti! Chalo!"); }} style={{ padding: '15px 30px', borderRadius: '15px', background: '#10b981', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>GREEN</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeGyanGame === 'transport' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
                                <div style={{ fontSize: '10rem', animation: 'bounce 2s infinite' }}>{transportPair.vehicle}</div>
                                <h3 style={{ fontSize: '2rem' }}>Ye {transportPair.name} kahan chalti hai?</h3>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {[
                                        { t: 'road', icon: '🛣️', n: 'Sadak' },
                                        { t: 'sky', icon: '☁️', n: 'Aasman' },
                                        { t: 'water', icon: '🌊', n: 'Pani' }
                                    ].map(path => (
                                        <button 
                                            key={path.t}
                                            onClick={() => {
                                                if (path.t === transportPair.type) {
                                                    speak(`Wah! ${transportPair.name} ${path.n} par chalti hai! ⭐`);
                                                    setGameScore(s => s + 50);
                                                    const next = [{vehicle:'🚢', type:'water', name:'Ship'}, {vehicle:'✈️', type:'sky', name:'Plane'}, {vehicle:'🚆', type:'road', name:'Train', type:'road'}][Math.floor(Math.random()*3)];
                                                    setTransportPair(next);
                                                } else {
                                                    speak("Nahi! Socho!");
                                                }
                                            }}
                                            style={{ padding: '20px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div style={{ fontSize: '4rem' }}>{path.icon}</div>
                                            <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{path.n}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'fun' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setActiveFunGame('stickers')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'stickers' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎨 Sticker Story</button>
                            <button onClick={() => setActiveFunGame('orchestra')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'orchestra' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎷 Orchestra</button>
                            <button onClick={() => setActiveFunGame('mood')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'mood' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>😊 Mood</button>
                            <button onClick={() => {
                                setActiveFunGame('counting');
                                setCountingCurrent(0);
                                setCountingTarget(Math.floor(Math.random() * 5) + 1);
                                speak("Bholu hungry hai! Mujhe khana khilao!");
                            }} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'counting' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🔢 Counting</button>
                            <button onClick={() => {
                                setActiveFunGame('balloons');
                                const task = Math.random() > 0.5 ? { type: 'color', target: 'Red' } : { type: 'letter', target: 'A' };
                                setBalloonTask(task);
                                speak(`Pop the ${task.target} balloon!`);
                            }} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'balloons' ? '#06b6d4' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎈 Balloons</button>
                            <button onClick={() => {
                                setActiveFunGame('sounds');
                                const animals = toddlerData?.animals || [];
                                setAnimalSoundTarget(animals[Math.floor(Math.random() * animals.length)]);
                                speak("Guess the animal sound!");
                            }} style={{ padding: '12px 25px', borderRadius: '15px', background: activeFunGame === 'sounds' ? '#f43f5e' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🔊 Janwar ki Awaz</button>
                        </div>

                        {activeFunGame === 'stickers' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '20px' }}>
                                <div 
                                    style={{ height: '450px', background: 'linear-gradient(to bottom, #87ceeb 60%, #4ade80 60%)', borderRadius: '30px', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '8px solid rgba(255,255,255,0.1)' }}
                                    onClick={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        const sticker = window._selectedSticker || '⭐';
                                        setPlacedStickers(prev => [...prev, { id: Math.random(), x, y, emoji: sticker }]);
                                        speak(sticker === '⭐' ? 'Star' : 'Sticker');
                                    }}
                                >
                                    {placedStickers.map(s => (
                                        <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, fontSize: '4rem', transform: 'translate(-50%, -50%)', animation: 'scaleUp 0.3s ease-out' }}>
                                            {s.emoji}
                                        </div>
                                    ))}
                                    <p style={{ position: 'absolute', top: '20px', width: '100%', opacity: 0.5, fontWeight: 'bold' }}>Tap to place stickers in the park! 🌳</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['🌈', '☀️', '🏠', '🌳', '🐶', '🌸', '🦋', '🚗'].map(s => (
                                        <button 
                                            key={s} 
                                            onClick={() => window._selectedSticker = s} 
                                            style={{ fontSize: '2.5rem', padding: '10px', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '2px solid transparent', cursor: 'pointer' }}
                                            onFocus={(e) => e.target.style.borderColor = '#10b981'}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                    <button onClick={() => setPlacedStickers([])} style={{ marginTop: 'auto', padding: '10px', borderRadius: '10px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
                                </div>
                            </div>
                        )}

                        {activeFunGame === 'orchestra' && (
                            <div style={{ height: '450px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', padding: '20px' }}>
                                {[
                                    { id: 1, ani: '🦁', name: 'Lion', sound: 'Roar!', color: '#fbbf24' },
                                    { id: 2, ani: '🐒', name: 'Monkey', sound: 'Ooh ooh aah aah!', color: '#b45309' },
                                    { id: 3, ani: '🐘', name: 'Elephant', sound: 'Pawoooo!', color: '#94a3b8' }
                                ].map(a => (
                                    <div 
                                        key={a.id} 
                                        onClick={() => {
                                            setDancingAnimal(a.id);
                                            speak(`${a.name} is playing music!`);
                                            setTimeout(() => setDancingAnimal(null), 2000);
                                        }}
                                        style={{ textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        <div style={{ 
                                            fontSize: '8rem', 
                                            animation: dancingAnimal === a.id ? 'bounce 0.5s infinite' : 'none',
                                            transform: dancingAnimal === a.id ? 'scale(1.2)' : 'scale(1)',
                                            transition: 'transform 0.3s'
                                        }}>
                                            {a.ani}
                                        </div>
                                        <div style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '15px', background: a.color, color: '#fff', fontWeight: 'bold' }}>
                                            {dancingAnimal === a.id ? a.sound : a.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeFunGame === 'mood' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px' }}>
                                <h3 style={{ fontSize: '2rem', color: '#ec4899' }}>Aaj aap kaisa feel kar rahe hain? 😊</h3>
                                <div style={{ display: 'flex', gap: '40px' }}>
                                    {[
                                        { emoji: '😊', label: 'Happy', msg: 'Waah! Aap khush hain? Bahut achha!' },
                                        { emoji: '🤩', label: 'Excited', msg: 'Zabardast! Aap bahut excited hain!' },
                                        { emoji: '😴', label: 'Sleepy', msg: 'Chalo thoda rest karte hain!' }
                                    ].map(m => (
                                        <button 
                                            key={m.label} 
                                            onClick={() => speak(m.msg)}
                                            style={{ fontSize: '7rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 3s infinite' }}
                                        >
                                            {m.emoji}
                                            <div style={{ fontSize: '1rem', color: '#fff', opacity: 0.6 }}>{m.label}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeFunGame === 'counting' && (
                            <div style={{ height: '450px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', padding: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '12rem', animation: countingCurrent === countingTarget ? 'bounce 0.5s infinite' : 'none' }}>🐶</div>
                                    <div style={{ background: '#fff', color: '#1e293b', padding: '15px 25px', borderRadius: '20px', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '-20px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                        {countingCurrent === countingTarget ? "Maza Aa Gaya! Thank You! ⭐" : `Mujhe ${countingTarget} Haddiyaan (Bones) khilao!`}
                                    </div>
                                    {countingCurrent === countingTarget && (
                                        <button 
                                            onClick={() => {
                                                setCountingCurrent(0);
                                                setCountingTarget(Math.floor(Math.random() * 5) + 1);
                                                speak("Chalo phir se khelte hain!");
                                            }}
                                            style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '15px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Play Again! 🔄
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '30px', borderRadius: '30px', border: '2px dashed rgba(255,255,255,0.1)' }}>
                                    {Array.from({ length: 9 }).map((_, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => {
                                                if (countingCurrent < countingTarget) {
                                                    const next = countingCurrent + 1;
                                                    setCountingCurrent(next);
                                                    speak(next.toString());
                                                    if (next === countingTarget) {
                                                        setTimeout(() => speak("Wah! Aapne sahi count kiya!"), 500);
                                                        setGameScore(s => s + 10);
                                                    }
                                                }
                                            }}
                                            style={{ 
                                                fontSize: '3.5rem', 
                                                background: 'none', 
                                                border: 'none', 
                                                cursor: countingCurrent < countingTarget ? 'pointer' : 'default', 
                                                opacity: i < countingCurrent ? 0.2 : 1,
                                                filter: i < countingCurrent ? 'grayscale(1)' : 'none',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            🦴
                                        </button>
                                    ))}
                                    <div style={{ gridColumn: 'span 3', marginTop: '10px', fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                                        Count: {countingCurrent} / {countingTarget}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeFunGame === 'balloons' && (
                            <div style={{ height: '450px', background: 'rgba(0,0,0,0.3)', borderRadius: '30px', position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}>
                                <div style={{ position: 'absolute', top: '20px', width: '100%', textAlign: 'center', zIndex: 10 }}>
                                    <div style={{ background: 'rgba(255,255,255,0.9)', color: '#111', padding: '10px 30px', borderRadius: '40px', display: 'inline-block', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
                                        🎯 Target: <span style={{ color: balloonTask.type === 'color' ? balloonTask.target.toLowerCase() : '#ec4899' }}>{balloonTask.target}</span>
                                    </div>
                                </div>
                                {gameBalloons.map(b => (
                                    <div 
                                        key={b.id}
                                        onClick={() => {
                                            const isMatch = (balloonTask.type === 'color' && b.val === balloonTask.target) || (balloonTask.type === 'letter' && b.val === balloonTask.target);
                                            if (isMatch) {
                                                speak("Pop! Sahi hai!");
                                                setGameScore(s => s + 5);
                                                // New task
                                                const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink'];
                                                const letters = ['A', 'B', 'C', 'D', 'E'];
                                                const newTask = Math.random() > 0.5 ? { type: 'color', target: colors[Math.floor(Math.random() * colors.length)] } : { type: 'letter', target: letters[Math.floor(Math.random() * letters.length)] };
                                                setBalloonTask(newTask);
                                                speak(`Pop the ${newTask.target} balloon!`);
                                            } else {
                                                speak("Oops! Phir se try karo!");
                                            }
                                            setGameBalloons(prev => prev.filter(bl => bl.id !== b.id));
                                        }}
                                        style={{ 
                                            position: 'absolute', 
                                            left: `${b.x}%`, 
                                            top: `${b.y}%`, 
                                            width: '80px', 
                                            height: '100px', 
                                            background: b.color, 
                                            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            color: '#fff', 
                                            fontWeight: 'bold', 
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            boxShadow: 'inset -5px -10px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {b.type === 'letter' ? b.val : ''}
                                        <div style={{ position: 'absolute', bottom: '-15px', width: '2px', height: '40px', background: 'rgba(255,255,255,0.3)' }}></div>
                                    </div>
                                ))}
                                <p style={{ position: 'absolute', bottom: '15px', width: '100%', opacity: 0.4 }}>Find the correct balloon and pop it! 🎈</p>
                            </div>
                        )}

                        {activeFunGame === 'sounds' && (
                            <div style={{ height: '450px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div 
                                    onClick={() => speak(animalSoundTarget?.sound)}
                                    style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#f43f5e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(244, 63, 94, 0.3)', marginBottom: '40px', animation: 'pulse 1.5s infinite' }}
                                >
                                    🔊
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Ye kiski awaz hai? Guess karo!</h3>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {toddlerData?.animals.map(ani => (
                                        <button 
                                            key={ani.id}
                                            onClick={() => {
                                                if (ani.id === animalSoundTarget.id) {
                                                    speak(`Sahi! Ye ${ani.name} ki awaz hai! ⭐`);
                                                    setGameScore(s => s + 30);
                                                    setTimeout(() => {
                                                        setAnimalSoundTarget(toddlerData.animals[Math.floor(Math.random() * toddlerData.animals.length)]);
                                                        speak("Ab ye wali awaz pehchano!");
                                                    }, 2000);
                                                } else {
                                                    speak("Nahi! Phir se suno!");
                                                }
                                            }}
                                            style={{ padding: '20px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.3s' }}
                                        >
                                            <div style={{ fontSize: '4rem' }}>{ani.emoji}</div>
                                            <div style={{ fontWeight: 'bold', marginTop: '10px' }}>{ani.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'magic' && (
                    <div style={{ textAlign: 'center', minHeight: '550px' }}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setMagicActiveGame('rain')} style={{ padding: '12px 25px', borderRadius: '15px', background: magicActiveGame === 'rain' ? '#60a5fa' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>☁️ Jadui Barish</button>
                            <button onClick={() => setMagicActiveGame('rocket')} style={{ padding: '12px 25px', borderRadius: '15px', background: magicActiveGame === 'rocket' ? '#f472b6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🚀 Udta Rocket</button>
                            <button onClick={() => setMagicActiveGame('garden')} style={{ padding: '12px 25px', borderRadius: '15px', background: magicActiveGame === 'garden' ? '#10b981' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🌻 Jadui Bagicha</button>
                            <button onClick={() => setMagicActiveGame('color')} style={{ padding: '12px 25px', borderRadius: '15px', background: magicActiveGame === 'color' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎨 Rangon ka Jadu</button>
                        </div>

                        {magicActiveGame === 'rain' && (
                            <div style={{ height: '400px', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '30px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={() => {
                                const newDrops = Array.from({ length: 8 }).map(() => ({
                                    id: Math.random(),
                                    x: Math.random() * 90,
                                    y: 0,
                                    emoji: ['⭐', '❤️', '🌈', '🎀', '🪄'][Math.floor(Math.random() * 5)]
                                }));
                                setRainDrops(prev => [...prev, ...newDrops]);
                            }}>
                                <div style={{ fontSize: '6rem', marginTop: '20px', animation: 'bounce 3s infinite' }}>☁️</div>
                                {rainDrops.map(d => (
                                    <div key={d.id} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, fontSize: '2rem', transition: 'top 0.1s linear' }}>
                                        {d.emoji}
                                    </div>
                                ))}
                                <p style={{ position: 'absolute', bottom: '20px', width: '100%', opacity: 0.5 }}>Tap the Cloud for Magic Rain! ✨</p>
                            </div>
                        )}

                        {magicActiveGame === 'rocket' && (
                            <div style={{ height: '400px', background: '#020617', borderRadius: '30px', position: 'relative', overflow: 'hidden' }}>
                                <div 
                                    onClick={() => {
                                        if (isRocketFlying) return;
                                        setIsRocketFlying(true);
                                        let start = Date.now();
                                        const animate = () => {
                                            let progress = (Date.now() - start) / 2000;
                                            if (progress < 1) {
                                                setRocketPos({
                                                    x: progress * 85 + 5,
                                                    y: 80 - (Math.sin(progress * Math.PI) * 60),
                                                    rotation: (progress - 0.5) * 90
                                                });
                                                requestAnimationFrame(animate);
                                            } else {
                                                setIsRocketFlying(false);
                                                setRocketPos({ x: 10, y: 80, rotation: 0 });
                                            }
                                        };
                                        requestAnimationFrame(animate);
                                    }}
                                    style={{ 
                                        position: 'absolute', 
                                        left: `${rocketPos.x}%`, 
                                        top: `${rocketPos.y}%`, 
                                        fontSize: '5rem', 
                                        transform: `rotate(${rocketPos.rotation}deg)`,
                                        cursor: 'pointer',
                                        transition: isRocketFlying ? 'none' : 'all 0.5s'
                                    }}
                                >
                                    🚀
                                </div>
                                {isRocketFlying && <div style={{ position: 'absolute', left: `${rocketPos.x}%`, top: `${rocketPos.y + 10}%`, fontSize: '1.5rem', opacity: 0.6 }}>💨</div>}
                                <p style={{ marginTop: '180px', opacity: 0.4 }}>Tap the Rocket to Launch! 🌠</p>
                            </div>
                        )}

                        {magicActiveGame === 'garden' && (
                            <div style={{ height: '400px', background: 'linear-gradient(to bottom, #87ceeb, #22c55e)', borderRadius: '30px', position: 'relative', overflow: 'hidden', cursor: 'pointer' }} onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                setGardenFlowers(prev => [...prev, { id: Math.random(), x, y, emoji: ['🌻', '🌸', '🌹', '🦋', '🍄'][Math.floor(Math.random() * 5)] }]);
                            }}>
                                {gardenFlowers.map(f => (
                                    <div key={f.id} style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, fontSize: '4rem', animation: 'scaleUp 0.3s ease-out forwards', transformOrigin: 'bottom' }}>
                                        {f.emoji}
                                    </div>
                                ))}
                                <p style={{ position: 'absolute', bottom: '20px', width: '100%', color: '#fff', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Tap the ground to grow Magic Flowers! 🌷</p>
                            </div>
                        )}

                        {magicActiveGame === 'color' && (
                            <div style={{ height: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '30px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '40px' }}>
                                    <div style={{ width: '100px', height: '100px', border: '4px dashed rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                        {colorMixes.find(m => m.c1 === colorMagic.slot1 || m.c2 === colorMagic.slot1)?.emoji1 || colorMixes.find(m => m.c1 === colorMagic.slot1 || m.c2 === colorMagic.slot1)?.emoji2 || '❓'}
                                    </div>
                                    <div style={{ fontSize: '2rem' }}>➕</div>
                                    <div style={{ width: '100px', height: '100px', border: '4px dashed rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                        {colorMixes.find(m => m.c1 === colorMagic.slot2 || m.c2 === colorMagic.slot2)?.emoji1 || colorMixes.find(m => m.c1 === colorMagic.slot2 || m.c2 === colorMagic.slot2)?.emoji2 || '❓'}
                                    </div>
                                    <div style={{ fontSize: '2rem' }}>🟰</div>
                                    <div style={{ width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', animation: colorMagic.result ? 'pulse 1s infinite' : 'none' }}>
                                        {colorMagic.result?.resEmoji || '🧪'}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    {['Red', 'Blue', 'Yellow', 'White'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => {
                                                if (!colorMagic.slot1) handleColorMix('slot1', c);
                                                else if (!colorMagic.slot2) handleColorMix('slot2', c);
                                                else {
                                                    const newMagic = { slot1: c, slot2: null, result: null };
                                                    setColorMagic(newMagic);
                                                    speak(`Selected ${c}. Pick one more color!`);
                                                }
                                            }}
                                            style={{ padding: '15px 25px', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                    <button onClick={() => setColorMagic({ slot1: null, slot2: null, result: null })} style={{ padding: '15px 25px', borderRadius: '15px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Reset 🔄</button>
                                </div>
                                {colorMagic.result && (
                                    <h3 style={{ marginTop: '20px', color: '#fbbf24' }}>Jadu! Aapne {colorMagic.result.result} banaya! ✨</h3>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'cartoon' && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '40px' }}>
                            <button onClick={() => setActiveCartoonGame('dressup')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeCartoonGame === 'dressup' ? '#f472b6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>👔 Dress-up</button>
                            <button onClick={() => setActiveCartoonGame('sounds')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeCartoonGame === 'sounds' ? '#8b5cf6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🎵 Sounds</button>
                            <button onClick={() => setActiveCartoonGame('talk')} style={{ padding: '12px 25px', borderRadius: '15px', background: activeCartoonGame === 'talk' ? '#fbbf24' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>💬 Talking Bholu</button>
                        </div>

                        {activeCartoonGame === 'dressup' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 300px', gap: '40px', alignItems: 'center' }}>
                                <div style={{ position: 'relative', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px dashed rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: '10rem', animation: 'bounce 2s infinite' }}>🐶</div>
                                    {/* Outfit Overlays */}
                                    <div style={{ position: 'absolute', top: '10px', fontSize: '5rem', pointerEvents: 'none', zIndex: 2 }}>
                                        {bholuOutfit.includes('🎩') && '🎩'}
                                        {bholuOutfit.includes('👑') && '👑'}
                                    </div>
                                    <div style={{ position: 'absolute', top: '90px', fontSize: '4rem', pointerEvents: 'none', zIndex: 3 }}>
                                        {bholuOutfit.includes('🕶️') && '🕶️'}
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '60px', fontSize: '4rem', pointerEvents: 'none', zIndex: 1 }}>
                                        {bholuOutfit.includes('🎀') && '🎀'}
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {cartoonData?.dressUp.map(item => (
                                        <button 
                                            key={item.id}
                                            onClick={() => setBholuOutfit(prev => prev.includes(item.emoji) ? prev.filter(i => i !== item.emoji) : [...prev, item.emoji])}
                                            className="card-vibe"
                                            style={{ padding: '20px', borderRadius: '20px', background: bholuOutfit.includes(item.emoji) ? '#f472b6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                                        >
                                            <div style={{ fontSize: '3rem' }}>{item.emoji}</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#fff', fontWeight: 'bold' }}>{item.name}</div>
                                        </button>
                                    ))}
                                    <button onClick={() => setBholuOutfit([])} style={{ gridColumn: 'span 2', padding: '15px', borderRadius: '15px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>🏃 Clear All</button>
                                </div>
                            </div>
                        )}

                        {activeCartoonGame === 'sounds' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                                {cartoonData?.sounds.map(s => (
                                    <button 
                                        key={s.id}
                                        onClick={() => {
                                            setSoundBlast(s.icon);
                                            setTimeout(() => setSoundBlast(null), 1000);
                                            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
                                            audio.play().catch(() => {});
                                        }}
                                        className="card-vibe"
                                        style={{ padding: '30px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', color: '#fff' }}
                                    >
                                        <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{s.icon}</div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{s.name}</div>
                                    </button>
                                ))}
                                {soundBlast && (
                                    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20rem', animation: 'pulse 0.5s infinite', pointerEvents: 'none', zIndex: 1000 }}>
                                        {soundBlast}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeCartoonGame === 'talk' && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div style={{ fontSize: '12rem', cursor: 'pointer', animation: 'bounce 2s infinite' }} onClick={() => {
                                        const msg = cartoonData.phrases[Math.floor(Math.random() * cartoonData.phrases.length)];
                                        setBholuMessage(msg);
                                        speak(msg);
                                    }}>🐶</div>
                                    {bholuMessage && (
                                        <div style={{ position: 'absolute', top: '-60px', left: '180px', background: '#fff', color: '#1e293b', padding: '25px 35px', borderRadius: '40px', fontWeight: 'bold', fontSize: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', minWidth: '250px', animation: 'fadeInUp 0.3s forwards' }}>
                                            {bholuMessage}
                                            <div style={{ position: 'absolute', bottom: '10px', left: '-15px', borderRight: '20px solid #fff', borderTop: '20px solid transparent', borderBottom: '20px solid transparent' }}></div>
                                        </div>
                                    )}
                                </div>
                                <p style={{ marginTop: '60px', fontSize: '1.5rem', opacity: 0.7, color: '#fbbf24', fontWeight: 'bold' }}>Tap Bholu to hear him talk! 🐾✨</p>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'toddler' && (
                    <div style={{ textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: '500px' }} onClick={handleSplash}>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                            <button onClick={() => setActiveToddlerGame('bubbles')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeToddlerGame === 'bubbles' ? '#60a5fa' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🫧 Bubbles</button>
                            <button onClick={() => setActiveToddlerGame('peekaboo')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeToddlerGame === 'peekaboo' ? '#fbbf24' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🙈 Peek-a-boo</button>
                            <button onClick={() => setActiveToddlerGame('splash')} style={{ padding: '10px 20px', borderRadius: '15px', background: activeToddlerGame === 'splash' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✨ Color Splash</button>
                        </div>

                        {activeToddlerGame === 'bubbles' && (
                            <div style={{ height: '400px', background: 'rgba(0,0,0,0.2)', borderRadius: '30px', position: 'relative', cursor: 'crosshair', overflow: 'hidden' }}>
                                {bubbles.map(b => (
                                    <div 
                                        key={b.id} 
                                        onClick={(e) => { e.stopPropagation(); popBubble(b.id); }}
                                        style={{ 
                                            position: 'absolute', 
                                            left: `${b.x}%`, 
                                            top: `${b.y}%`, 
                                            width: `${b.size}px`, 
                                            height: `${b.size}px`, 
                                            borderRadius: '50%', 
                                            background: `radial-gradient(circle at 30% 30%, white, ${b.color})`, 
                                            opacity: 0.6, 
                                            boxShadow: `0 0 10px ${b.color}`,
                                            cursor: 'pointer',
                                            transition: 'transform 0.1s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                ))}
                                {bubbles.length === 0 && <p style={{ marginTop: '180px', opacity: 0.5 }}>Bubbles are coming... 🫧</p>}
                            </div>
                        )}

                        {activeToddlerGame === 'peekaboo' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', padding: '20px' }}>
                                {toddlerData?.animals.map(ani => (
                                    <div 
                                        key={ani.id} 
                                        onClick={() => {
                                            setPeekabooAnimal(ani.id === peekabooAnimal ? null : ani.id);
                                            if (ani.id !== peekabooAnimal) speak(ani.name);
                                        }}
                                        style={{ 
                                            background: 'rgba(255,255,255,0.05)', 
                                            height: '180px', 
                                            borderRadius: '30px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            cursor: 'pointer', 
                                            position: 'relative',
                                            border: `2px solid ${peekabooAnimal === ani.id ? ani.color : 'transparent'}`
                                        }}
                                    >
                                        {peekabooAnimal === ani.id ? (
                                            <div style={{ fontSize: '6rem', animation: 'bounce 1s infinite' }}>{ani.emoji}</div>
                                        ) : (
                                            <div style={{ fontSize: '5rem', opacity: 0.3 }}>📦</div>
                                        )}
                                        <div style={{ position: 'absolute', bottom: '15px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            {peekabooAnimal === ani.id ? ani.name : 'Tap to see!'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeToddlerGame === 'splash' && (
                            <div style={{ height: '400px', background: 'rgba(0,0,0,0.4)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Tap anywhere for Magic! ✨</p>
                                {splashEffect && (
                                    <div style={{ 
                                        position: 'fixed', 
                                        left: splashEffect.x - 50, 
                                        top: splashEffect.y - 50, 
                                        fontSize: '5rem', 
                                        animation: 'pulse 1s forwards',
                                        pointerEvents: 'none',
                                        zIndex: 9999
                                    }}>
                                        {['❤️', '⭐', '🌈', '🌸', '🪄'][Math.floor(Math.random() * 5)]}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {activeSection === 'superhero' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fbbf24' }}>🦸‍♂️ Super Hero 20 Challenge</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '30px' }}>Learn a whole year in just 20 days! Are you ready, Hero?</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '30px' }}>
                            {fastTrackCurriculum.map((day) => {
                                const isLocked = day.day > (fastTrackProgress + 1);
                                const isCompleted = day.day <= fastTrackProgress;
                                const isCurrent = day.day === (fastTrackProgress + 1);

                                return (
                                    <div 
                                        key={day.day}
                                        onClick={() => !isLocked && setSelectedFastTrackDay(day)}
                                        style={{
                                            padding: '20px',
                                            borderRadius: '25px',
                                            background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : (isCurrent ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.02)'),
                                            border: isCurrent ? '2px solid #fbbf24' : (isCompleted ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)'),
                                            cursor: isLocked ? 'not-allowed' : 'pointer',
                                            opacity: isLocked ? 0.4 : 1,
                                            transition: 'transform 0.3s, background 0.3s',
                                            position: 'relative'
                                        }}
                                        className={!isLocked ? "card-vibe" : ""}
                                    >
                                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '5px' }}>DAY {day.day}</div>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                                            {isLocked ? '🔒' : (day.category === 'Language' ? '🅰️' : day.category === 'Math' ? '🔢' : day.category === 'Nature' ? '🌿' : day.category === 'Creative' ? '🎨' : '🤝')}
                                        </div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{day.title}</div>
                                        {isCompleted && <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' }}>✅</div>}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Day Detail Modal/Overlay */}
                        {selectedFastTrackDay && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                <div style={{ background: '#1e293b', width: '900px', maxWidth: '100%', borderRadius: '40px', padding: '40px', position: 'relative', border: '2px solid #fbbf24', boxShadow: '0 0 50px rgba(251,191,36,0.2)' }}>
                                    <button 
                                        onClick={() => setSelectedFastTrackDay(null)}
                                        style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                    
                                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                        <span style={{ background: '#fbbf24', color: '#000', padding: '5px 20px', borderRadius: '20px', fontWeight: '900', fontSize: '0.8rem' }}>DAY {selectedFastTrackDay.day}: {selectedFastTrackDay.category.toUpperCase()}</span>
                                        <h3 style={{ fontSize: '2.5rem', margin: '15px 0' }}>{selectedFastTrackDay.title}</h3>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) 1fr', gap: '30px' }}>
                                        <div style={{ borderRadius: '25px', overflow: 'hidden', background: '#000', aspectRatio: '16/9' }}>
                                            <iframe 
                                                width="100%" 
                                                height="100%" 
                                                src={selectedFastTrackDay.video} 
                                                title="Learning Video" 
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                <h4 style={{ color: '#fbbf24', margin: '0 0 10px 0' }}>🎯 YOUR HERO TASK:</h4>
                                                <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>{selectedFastTrackDay.task}</p>
                                            </div>
                                            
                                            <button 
                                                onClick={() => {
                                                    const newProg = mockApi.saveFastTrackProgress(selectedFastTrackDay.day);
                                                    setFastTrackProgress(newProg);
                                                    setSelectedFastTrackDay(null);
                                                    speak(`Wow! You completed Day ${selectedFastTrackDay.day}! You are a Super Hero!`);
                                                    alert(`🏆 DAY ${selectedFastTrackDay.day} COMPLETED! Keep going, Hero!`);
                                                }}
                                                style={{ 
                                                    padding: '20px', 
                                                    borderRadius: '25px', 
                                                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                                                    color: '#000', 
                                                    border: 'none', 
                                                    fontWeight: '900', 
                                                    fontSize: '1.2rem', 
                                                    cursor: 'pointer',
                                                    boxShadow: '0 10px 30px rgba(251,191,36,0.4)',
                                                    transition: 'transform 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            >
                                                ✅ I DID IT! NEXT DAY!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'stickers' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '30px' }}>My Magical Sticker Wall 🌈</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', justifyContent: 'center' }}>
                            {stickers.map(s => (
                                <div
                                    key={s.id}
                                    className="sticker-item card-vibe"
                                    onClick={() => alert(`🎵 Playing sound for ${s.label}! ✨ yay!!`)}
                                    style={{
                                        width: '150px',
                                        padding: '20px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '25px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>{s.sticker}</div>
                                    <div style={{ fontWeight: 'bold' }}>{s.label}</div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '5px' }}>{s.date}</div>
                                </div>
                            ))}
                            <div className="sticker-placeholder" style={{
                                width: '150px',
                                padding: '20px',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                borderRadius: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'rgba(255,255,255,0.1)',
                                fontSize: '2rem'
                            }}>
                                ❔
                            </div>
                        </div>
                        <p style={{ marginTop: '40px', color: '#94a3b8' }}>Complete your home tasks to earn more magic stickers!</p>
                    </div>
                )}
            </div>
            {/* Confetti Celebration Overlay */}
            {showConfetti && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10000, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden' }}>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div 
                            key={i} 
                            style={{
                                width: '10px', height: '10px', 
                                background: ['#fbbf24', '#f43f5e', '#3b82f6', '#10b981', '#a855f7'][i % 5],
                                borderRadius: '2px',
                                animation: `confettiFall ${Math.random() * 2 + 1}s linear ${Math.random() * 2}s infinite`
                            }}
                        />
                    ))}
                </div>
            )}

            <JuniorDashboardAnimations />

            <style>{`
                @keyframes confettiFall {
                    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default JuniorActivityCenter;
