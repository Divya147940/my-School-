import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './MagicWritingTracer.css';

// ─── Data ────────────────────────────────────────────────────────────────────

const ENGLISH_LETTERS = [
    { char: 'A', word: 'Apple', emoji: '🍎', color: '#ef4444' },
    { char: 'B', word: 'Ball', emoji: '⚽', color: '#f97316' },
    { char: 'C', word: 'Cat', emoji: '🐱', color: '#eab308' },
    { char: 'D', word: 'Dog', emoji: '🐶', color: '#22c55e' },
    { char: 'E', word: 'Elephant', emoji: '🐘', color: '#3b82f6' },
    { char: 'F', word: 'Fish', emoji: '🐟', color: '#8b5cf6' },
    { char: 'G', word: 'Goat', emoji: '🐐', color: '#ec4899' },
    { char: 'H', word: 'House', emoji: '🏠', color: '#f97316' },
    { char: 'I', word: 'Ice Cream', emoji: '🍦', color: '#06b6d4' },
    { char: 'J', word: 'Jug', emoji: '🫙', color: '#a855f7' },
    { char: 'K', word: 'Kite', emoji: '🪁', color: '#ef4444' },
    { char: 'L', word: 'Lion', emoji: '🦁', color: '#eab308' },
    { char: 'M', word: 'Mango', emoji: '🥭', color: '#f97316' },
    { char: 'N', word: 'Nest', emoji: '🪺', color: '#22c55e' },
    { char: 'O', word: 'Orange', emoji: '🍊', color: '#f97316' },
    { char: 'P', word: 'Parrot', emoji: '🦜', color: '#22c55e' },
    { char: 'Q', word: 'Queen', emoji: '👑', color: '#eab308' },
    { char: 'R', word: 'Rabbit', emoji: '🐰', color: '#ec4899' },
    { char: 'S', word: 'Sun', emoji: '☀️', color: '#eab308' },
    { char: 'T', word: 'Tiger', emoji: '🐯', color: '#f97316' },
    { char: 'U', word: 'Umbrella', emoji: '☂️', color: '#3b82f6' },
    { char: 'V', word: 'Van', emoji: '🚐', color: '#8b5cf6' },
    { char: 'W', word: 'Watermelon', emoji: '🍉', color: '#22c55e' },
    { char: 'X', word: 'Xylophone', emoji: '🎵', color: '#ec4899' },
    { char: 'Y', word: 'Yak', emoji: '🐃', color: '#a855f7' },
    { char: 'Z', word: 'Zebra', emoji: '🦓', color: '#374151' },
];

const HINDI_LETTERS = [
    { char: 'अ', word: 'अनार', emoji: '🍎', color: '#ef4444' },
    { char: 'आ', word: 'आम', emoji: '🥭', color: '#f97316' },
    { char: 'इ', word: 'इमली', emoji: '🌿', color: '#eab308' },
    { char: 'ई', word: 'ईख', emoji: '🎋', color: '#22c55e' },
    { char: 'उ', word: 'उल्लू', emoji: '🦉', color: '#3b82f6' },
    { char: 'ऊ', word: 'ऊंट', emoji: '🐪', color: '#8b5cf6' },
    { char: 'ए', word: 'एड़ी', emoji: '🦶', color: '#ec4899' },
    { char: 'ओ', word: 'ओस', emoji: '💧', color: '#06b6d4' },
    { char: 'क', word: 'कमल', emoji: '🌸', color: '#ef4444' },
    { char: 'ख', word: 'खरगोश', emoji: '🐇', color: '#f97316' },
    { char: 'ग', word: 'गाय', emoji: '🐄', color: '#eab308' },
    { char: 'घ', word: 'घर', emoji: '🏠', color: '#22c55e' },
    { char: 'च', word: 'चाँद', emoji: '🌙', color: '#3b82f6' },
    { char: 'छ', word: 'छाता', emoji: '☂️', color: '#8b5cf6' },
    { char: 'ज', word: 'जल', emoji: '💧', color: '#ec4899' },
    { char: 'झ', word: 'झंडा', emoji: '🚩', color: '#f97316' },
    { char: 'ट', word: 'टमाटर', emoji: '🍅', color: '#ef4444' },
    { char: 'ड', word: 'डम्बल', emoji: '🏋️', color: '#eab308' },
    { char: 'त', word: 'तारा', emoji: '⭐', color: '#22c55e' },
    { char: 'थ', word: 'थाली', emoji: '🍽️', color: '#3b82f6' },
    { char: 'द', word: 'दही', emoji: '🥛', color: '#8b5cf6' },
    { char: 'न', word: 'नाव', emoji: '⛵', color: '#ec4899' },
    { char: 'प', word: 'पानी', emoji: '💧', color: '#06b6d4' },
    { char: 'फ', word: 'फूल', emoji: '🌸', color: '#a855f7' },
    { char: 'ब', word: 'बकरी', emoji: '🐐', color: '#ef4444' },
    { char: 'भ', word: 'भालू', emoji: '🐻', color: '#f97316' },
    { char: 'म', word: 'मछली', emoji: '🐟', color: '#eab308' },
    { char: 'य', word: 'यात्रा', emoji: '✈️', color: '#22c55e' },
    { char: 'र', word: 'रोटी', emoji: '🫓', color: '#3b82f6' },
    { char: 'ल', word: 'लड्डू', emoji: '🟡', color: '#8b5cf6' },
    { char: 'व', word: 'वर्षा', emoji: '🌧️', color: '#ec4899' },
    { char: 'श', word: 'शेर', emoji: '🦁', color: '#f97316' },
    { char: 'स', word: 'सेब', emoji: '🍎', color: '#06b6d4' },
    { char: 'ह', word: 'हाथी', emoji: '🐘', color: '#a855f7' },
];

const NUM_WORDS = ['','Ek','Do','Teen','Chaar','Paanch','Chhah','Saat','Aath','Nau','Das',
    'Gyarah','Barah','Terah','Chaudah','Pandrah','Solah','Satrah','Atharah','Unnis','Bees',
    'Ikkis','Baees','Teis','Chaubis','Pachees','Chhabbis','Sattaees','Atthaees','Untees','Tees',
    'Ikattees','Battees','Tettees','Chautees','Paintees','Chhattees','Saintees','Adtees','Untaalees','Chaalees',
    'Iktaalees','Bayaalees','Tentaalees','Chawaalees','Paintaalees','Chhiyaalees','Saintaalees','Adtaalees','Unchaas','Pachaas',
    'Ikyaavan','Baavan','Tirpan','Chawwan','Pachpan','Chhappan','Sattavan','Atthaavan','Unsath','Saath',
    'Iksath','Basath','Tirsath','Chausath','Painsath','Chhiyasath','Sarsath','Adsath','Unhattar','Sattar',
    'Ikahattar','Bahattar','Tihattar','Chauhattar','Pachahattar','Chhiyahattar','Sathattar','Atthahattar','Unassi','Assi',
    'Ikyaasi','Bayaasi','Tiraasi','Chaurasi','Pachaasi','Chhiyaasi','Sataasi','Atthaasi','Nawasi','Nabbe',
    'Ikyaanve','Baanve','Tiraanve','Chauraanve','Pachaanve','Chhiyaanve','Sataanve','Atthaanve','Ninnyanve','Sau'
];

const NUM_EMOJIS = ['🍎','⭐','🎈','🌸','🦋','🐥','💎','🎵','🍭','🏆'];

const NUM_COLORS = [
    '#ef4444','#f97316','#eab308','#22c55e','#3b82f6',
    '#8b5cf6','#ec4899','#06b6d4','#a855f7','#10b981'
];

const NUMBERS = Array.from({ length: 100 }, (_, i) => ({
    char: String(i + 1),
    word: NUM_WORDS[i + 1],
    emoji: NUM_EMOJIS[i % 10],
    color: NUM_COLORS[i % 10],
    dots: i + 1,
}));

const STAR_MESSAGES = [
    '🌟 Wah wah! Kya sundar likha!',
    '⭐ Bahut badhiya! Tum toh expert ho!',
    '🎉 Zabardast! Keep it up!',
    '🏆 Sher ke bachchon jaise likha!',
    '🚀 Ek dum rocket ho tum!',
    '🥇 First place medal tum ko!',
    '💪 Itna acha likhte ho!',
    '🎈 Bahut pyaara! Teacher khush hogi!',
];

const COLORS_PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#ffffff', '#1a1a2e'];

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MagicWritingTracer({ onWatchMovie }) {
    const { user } = useAuth();
    const [mode, setMode] = useState('english'); // 'english' | 'hindi' | 'numbers'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [brushColor, setBrushColor] = useState('#ec4899');
    const [brushSize, setBrushSize] = useState(12);
    const [stars, setStars] = useState(0);
    const [totalDone, setTotalDone] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebMsg, setCelebMsg] = useState('');
    const [strokeCount, setStrokeCount] = useState(0);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [particles, setParticles] = useState([]);

    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const lastPressure = useRef(0.5);
    const strokesRef = useRef(0);
    const [penType, setPenType] = useState('pen'); // 'pen' | 'touch' | 'mouse'
    const [penMode, setPenMode] = useState('pen'); // 'pen' | 'pencil' | 'marker'

    // Pen mode config
    const PEN_MODES = {
        pen:    { baseWidth: 3,  pressureMul: 8,  shadow: 0,    opacity: 1.0,  name: '🖊️ Pen' },
        pencil: { baseWidth: 1,  pressureMul: 5,  shadow: 0,    opacity: 0.85, name: '✏️ Pencil' },
        marker: { baseWidth: 8,  pressureMul: 14, shadow: 3,    opacity: 0.7,  name: '🖍️ Marker' },
    };
    const pm = PEN_MODES[penMode];


    const dataset = mode === 'english' ? ENGLISH_LETTERS : mode === 'hindi' ? HINDI_LETTERS : NUMBERS;
    const current = dataset[currentIndex];

    // ── Canvas Setup ────────────────────────────────────────────────────────
    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(window.innerWidth - 60, 340);
        canvas.style.width = size + 'px';
        canvas.style.height = size + 'px';
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        drawGuideCharacter(ctx, size, current);
    }, [current]);

    // ── Guide Character Drawing ─────────────────────────────────────────────
    const drawGuideCharacter = (ctx, size, item) => {
        ctx.clearRect(0, 0, size, size);

        // Background grid dots
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        for (let x = 20; x < size; x += 30) {
            for (let y = 20; y < size; y += 30) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Dotted guide lines (like notebook)
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1;
        [size * 0.25, size * 0.5, size * 0.75].forEach(y => {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(size, y); ctx.stroke();
        });
        ctx.setLineDash([]);

        // Guide letter (faded, to trace over)
        const fontSize = item.char.length > 1 ? size * 0.38 : size * 0.55;
        ctx.font = `bold ${fontSize}px 'Baloo Bhaijaan 2', 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow glow
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 30;
        ctx.fillStyle = `${item.color}22`;
        ctx.fillText(item.char, size / 2, size / 2);

        // Dotted guide
        ctx.shadowBlur = 0;
        ctx.setLineDash([4, 8]);
        ctx.strokeStyle = `${item.color}55`;
        ctx.lineWidth = 3;
        ctx.strokeText(item.char, size / 2, size / 2);
        ctx.setLineDash([]);

        // Numbered start arrows (simple dots at corners)
        ctx.fillStyle = item.color + 'aa';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('✏️ Yahaan se shuru karo!', 8, 8);
    };

    useEffect(() => {
        setupCanvas();
        setHasDrawn(false);
        strokesRef.current = 0;
        setStrokeCount(0);
    }, [currentIndex, mode, setupCanvas]);

    // ── Pointer Events (Pen / Stylus / Touch / Mouse) ───────────────────────
    const getCanvasPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = useCallback((e) => {
        e.preventDefault();
        canvasRef.current.setPointerCapture(e.pointerId);
        isDrawing.current = true;
        lastPos.current = getCanvasPos(e);
        lastPressure.current = e.pressure > 0 ? e.pressure : 0.5;
        setPenType(e.pointerType || 'mouse');
        setHasDrawn(true);
    }, []);

    const onPointerMove = useCallback((e) => {
        e.preventDefault();
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getCanvasPos(e);

        // Pressure: stylus gives real 0-1; mouse/touch fallback to 0.5
        const rawPressure = e.pressure > 0 ? e.pressure : 0.5;
        // Smooth pressure
        const pressure = lastPressure.current * 0.4 + rawPressure * 0.6;
        lastPressure.current = pressure;

        const currentPm = PEN_MODES[penMode];
        const lineW = Math.max(0.5, currentPm.baseWidth + pressure * currentPm.pressureMul);

        // Draw a tapered segment using quadratic bezier
        const midX = (lastPos.current.x + pos.x) / 2;
        const midY = (lastPos.current.y + pos.y) / 2;

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.quadraticCurveTo(lastPos.current.x, lastPos.current.y, midX, midY);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = lineW;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = currentPm.opacity;

        if (currentPm.shadow > 0) {
            ctx.shadowColor = brushColor;
            ctx.shadowBlur = currentPm.shadow;
        }

        // Pencil texture: slight randomness
        if (penMode === 'pencil') {
            ctx.setLineDash([1, Math.random() * 2]);
        } else {
            ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);

        lastPos.current = pos;
    }, [brushColor, penMode]);

    const onPointerUp = useCallback((e) => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        strokesRef.current += 1;
        setStrokeCount(strokesRef.current);
    }, []);

    // Legacy fallbacks (for non-pointer browsers)
    const startDraw = useCallback((e) => {
        e.preventDefault();
        const src = e.touches ? e.touches[0] : e;
        const rect = canvasRef.current.getBoundingClientRect();
        isDrawing.current = true;
        lastPos.current = { x: src.clientX - rect.left, y: src.clientY - rect.top };
        lastPressure.current = 0.5;
        setHasDrawn(true);
    }, []);

    const draw = useCallback((e) => {
        e.preventDefault();
        if (!isDrawing.current) return;
        const src = e.touches ? e.touches[0] : e;
        const rect = canvasRef.current.getBoundingClientRect();
        const pos = { x: src.clientX - rect.left, y: src.clientY - rect.top };
        const ctx = canvasRef.current.getContext('2d');
        const currentPm = PEN_MODES[penMode];
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = currentPm.baseWidth + 0.5 * currentPm.pressureMul;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = currentPm.opacity;
        ctx.stroke();
        ctx.globalAlpha = 1;
        lastPos.current = pos;
    }, [brushColor, penMode]);

    const endDraw = useCallback(() => {
        if (!isDrawing.current) return;
        isDrawing.current = false;
        strokesRef.current += 1;
        setStrokeCount(strokesRef.current);
    }, []);


    // ── Celebrate! ──────────────────────────────────────────────────────────
    const celebrate = useCallback(() => {
        const msg = STAR_MESSAGES[Math.floor(Math.random() * STAR_MESSAGES.length)];
        setCelebMsg(msg);
        setShowCelebration(true);
        setStars(s => s + 1);
        setTotalDone(t => t + 1);

        // Speak it
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(msg.replace(/[🌟⭐🎉🏆🚀🥇💪🎈]/gu, ''));
            u.pitch = 1.6;
            u.rate = 0.95;
            u.lang = 'hi-IN';
            window.speechSynthesis.speak(u);
        }

        // Spawn particles
        setParticles(Array.from({ length: 20 }, (_, i) => ({
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 60 + 20,
            emoji: ['⭐', '🌟', '🎉', '💫', '✨'][Math.floor(Math.random() * 5)],
            size: Math.random() * 24 + 14,
            delay: Math.random() * 0.5,
        })));

        setTimeout(() => {
            setShowCelebration(false);
            setParticles([]);
        }, 3000);
    }, []);

    const handleDone = useCallback(() => {
        if (!hasDrawn) return;
        celebrate();
        setTimeout(() => {
            // Auto-advance after 2s
            setCurrentIndex(i => (i + 1) % dataset.length);
        }, 2200);
    }, [hasDrawn, celebrate, dataset.length]);

    const handleClear = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = parseFloat(canvas.style.width);
        drawGuideCharacter(ctx, size, current);
        setHasDrawn(false);
        strokesRef.current = 0;
        setStrokeCount(0);
    }, [current]);

    const speakItem = () => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const text = mode === 'hindi' ? `${current.char} — ${current.word}` : `${current.char} for ${current.word}`;
        const u = new SpeechSynthesisUtterance(text);
        u.pitch = 1.5;
        u.rate = 0.85;
        u.lang = mode === 'hindi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(u);
    };

    const prevItem = () => setCurrentIndex(i => (i - 1 + dataset.length) % dataset.length);
    const nextItem = () => setCurrentIndex(i => (i + 1) % dataset.length);

    // ── Keyboard support ────────────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'ArrowRight') nextItem();
            if (e.key === 'ArrowLeft') prevItem();
            if (e.key === ' ') { e.preventDefault(); handleClear(); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    });

    return (
        <div className="mwt-root">
            {/* Floating particles */}
            {particles.map(p => (
                <span key={p.id} className="mwt-particle" style={{
                    left: `${p.x}%`, top: `${p.y}%`,
                    fontSize: p.size, animationDelay: `${p.delay}s`
                }}>{p.emoji}</span>
            ))}

            {/* Header */}
            <div className="mwt-header">
                <div className="mwt-title-area">
                    <span className="mwt-mascot">🐣</span>
                    <div>
                        <h1 className="mwt-title">Jadui Likhna Seekho!</h1>
                        <p className="mwt-subtitle">Aaoo likhna seekhein milke 🎉</p>
                    </div>
                    <div className="mwt-stars-badge">
                        <span>⭐</span>
                        <span className="mwt-stars-count">{stars}</span>
                        <span className="mwt-stars-label">Stars</span>
                    </div>
                </div>

                {/* Mode Tabs */}
                <div className="mwt-mode-tabs">
                    {[
                        { id: 'english', label: 'A B C', icon: '🔤', color: '#3b82f6' },
                        { id: 'hindi', label: 'क ख ग', icon: '🇮🇳', color: '#f97316' },
                        { id: 'numbers', label: '1 2 3', icon: '🔢', color: '#22c55e' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`mwt-tab ${mode === tab.id ? 'mwt-tab-active' : ''}`}
                            style={mode === tab.id ? { background: tab.color, boxShadow: `0 0 20px ${tab.color}80` } : {}}
                            onClick={() => { setMode(tab.id); setCurrentIndex(0); }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mwt-progress-wrap">
                <div className="mwt-progress-bar" style={{ width: `${((currentIndex + 1) / dataset.length) * 100}%`, background: current.color }} />
                <span className="mwt-progress-label">{currentIndex + 1} / {dataset.length}</span>
            </div>

            {/* Grid: Nav + Canvas + Info */}
            <div className="mwt-main">
                {/* Quick letter grid */}
                <div className="mwt-letter-grid">
                    {dataset.map((item, idx) => (
                        <button
                            key={idx}
                            className={`mwt-letter-chip ${currentIndex === idx ? 'mwt-chip-active' : ''}`}
                            style={currentIndex === idx ? { background: item.color, boxShadow: `0 0 12px ${item.color}` } : {}}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            {item.char}
                        </button>
                    ))}
                </div>

                {/* Canvas Area */}
                <div className="mwt-canvas-section">
                    {/* Current item info */}
                    <div className="mwt-item-info" style={{ borderColor: current.color }}>
                        <span className="mwt-item-emoji" onClick={speakItem} title="Sunne ke liye click karo">
                            {current.emoji}
                        </span>
                        <div className="mwt-item-text">
                            <span className="mwt-item-char" style={{ color: current.color }}>{current.char}</span>
                            <span className="mwt-item-word">{current.word}</span>
                        </div>
                        <button className="mwt-speak-btn" onClick={speakItem} style={{ background: current.color }}>
                            🔊 Suno
                        </button>
                    </div>

                    {/* Canvas */}
                    <div className="mwt-canvas-wrap" style={{ borderColor: current.color, boxShadow: `0 0 30px ${current.color}44` }}>
                        {/* Pen Type Badge */}
                        <div className="mwt-pen-badge" style={{ background: current.color + '22', border: `1px solid ${current.color}55` }}>
                            <span>
                                {penType === 'pen' ? '🖊️ Stylus' : penType === 'touch' ? '☝️ Ungli' : '🖱️ Mouse'}
                            </span>
                        </div>

                        <canvas
                            ref={canvasRef}
                            className="mwt-canvas"
                            style={{ cursor: penType === 'pen' ? 'crosshair' : 'default', touchAction: 'none' }}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerLeave={onPointerUp}
                            onPointerCancel={onPointerUp}
                        />
                        {!hasDrawn && (
                            <div className="mwt-hint-overlay">
                                <span>✏️ Pen / Pencil / Ungli — likhna shuru karo!</span>
                            </div>
                        )}
                    </div>

                    {/* Stroke counter */}
                    {strokeCount > 0 && (
                        <div className="mwt-stroke-info">
                            ✏️ {strokeCount} stroke{strokeCount > 1 ? 's' : ''} likhe
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mwt-actions">
                        <button className="mwt-btn mwt-btn-clear" onClick={handleClear}>
                            🧽 Saaf Karo
                        </button>
                        <button
                            className={`mwt-btn mwt-btn-done ${hasDrawn ? '' : 'mwt-btn-disabled'}`}
                            onClick={handleDone}
                            disabled={!hasDrawn}
                        >
                            ✅ Ho Gaya!
                        </button>
                        <button className="mwt-btn mwt-btn-next" onClick={nextItem}>
                            Agla ➡️
                        </button>
                    </div>
                </div>

                {/* Right Panel: Brush + Stats */}
                <div className="mwt-right-panel">
                    {/* Pen Mode Selector */}
                    <div className="mwt-panel-card">
                        <h3 className="mwt-panel-title">🖊️ Pen Chunna</h3>
                        <div className="mwt-pen-modes">
                            {Object.entries(PEN_MODES).map(([key, val]) => (
                                <button
                                    key={key}
                                    className={`mwt-pen-mode-btn ${penMode === key ? 'mwt-pen-mode-active' : ''}`}
                                    style={penMode === key ? { background: current.color, boxShadow: `0 0 12px ${current.color}` } : {}}
                                    onClick={() => setPenMode(key)}
                                >
                                    {val.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mwt-panel-card">
                        <h3 className="mwt-panel-title">🎨 Rang Chuno</h3>
                        <div className="mwt-color-grid">
                            {COLORS_PALETTE.map(c => (
                                <button
                                    key={c}
                                    className={`mwt-color-btn ${brushColor === c ? 'mwt-color-selected' : ''}`}
                                    style={{ background: c, border: brushColor === c ? '3px solid #fff' : '3px solid transparent' }}
                                    onClick={() => setBrushColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Brush Size */}
                    <div className="mwt-panel-card">
                        <h3 className="mwt-panel-title">✏️ Moti Ya Patli?</h3>
                        <div className="mwt-size-btns">
                            {[6, 10, 14, 20, 28].map(s => (
                                <button
                                    key={s}
                                    className={`mwt-size-btn ${brushSize === s ? 'mwt-size-selected' : ''}`}
                                    style={brushSize === s ? { background: brushColor, transform: 'scale(1.2)' } : {}}
                                    onClick={() => setBrushSize(s)}
                                >
                                    <span style={{ width: s * 0.7, height: s * 0.7, borderRadius: '50%', background: brushColor === '#1a1a2e' ? '#fff' : brushColor, display: 'block' }} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mwt-panel-card mwt-stats-card">
                        <h3 className="mwt-panel-title">🏆 Mera Score</h3>
                        <div className="mwt-stat">
                            <span>⭐ Stars milí</span>
                            <span className="mwt-stat-val" style={{ color: '#fbbf24' }}>{stars}</span>
                        </div>
                        <div className="mwt-stat">
                            <span>✅ Letters likhé</span>
                            <span className="mwt-stat-val" style={{ color: '#22c55e' }}>{totalDone}</span>
                        </div>
                        <div className="mwt-stat">
                            <span>📚 Baaki hain</span>
                            <span className="mwt-stat-val" style={{ color: '#f97316' }}>{dataset.length - currentIndex - 1}</span>
                        </div>

                        {totalDone >= 5 && (
                            <div className="mwt-badge">
                                🥇 {totalDone >= 26 ? 'Champion!' : totalDone >= 10 ? 'Star Writer!' : 'Super Kid!'}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="mwt-nav-btns">
                        <button className="mwt-nav-btn" onClick={prevItem}>⬅️ Pehla</button>
                        <button className="mwt-nav-btn" onClick={nextItem}>Agla ➡️</button>
                    </div>
                </div>
            </div>

            {/* Numbers Counting Visual */}
            {mode === 'numbers' && (
                <div className="mwt-dots-section">
                    <h3 className="mwt-dots-title">
                        Gino! <span style={{ color: current.color, fontSize: '1.4rem' }}>{current.char}</span> = {current.word}
                    </h3>
                    {current.dots <= 10 ? (
                        // 1–10: individual emoji dots
                        <div className="mwt-dots-row">
                            {Array.from({ length: current.dots }).map((_, i) => (
                                <span key={i} className="mwt-dot" style={{ background: current.color + '33', animationDelay: `${i * 0.08}s` }}>
                                    {NUM_EMOJIS[i % 10]}
                                </span>
                            ))}
                        </div>
                    ) : (
                        // 11–100: groups of 10 rows
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginBottom: '10px' }}>
                                {Array.from({ length: Math.floor(current.dots / 10) }).map((_, gi) => (
                                    <div key={gi} className="mwt-group-10" style={{ borderColor: current.color }}>
                                        <span style={{ fontSize: '0.7rem', color: current.color, fontWeight: 800 }}>{(gi + 1) * 10}</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                                            {Array.from({ length: 10 }).map((_, di) => (
                                                <span key={di} style={{ fontSize: '1rem' }}>{NUM_EMOJIS[(gi + di) % 10]}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {/* Remaining dots */}
                                {current.dots % 10 > 0 && (
                                    <div className="mwt-group-10" style={{ borderColor: current.color, opacity: 0.7 }}>
                                        <span style={{ fontSize: '0.7rem', color: current.color, fontWeight: 800 }}>+{current.dots % 10}</span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                                            {Array.from({ length: current.dots % 10 }).map((_, di) => (
                                                <span key={di} style={{ fontSize: '1rem' }}>{NUM_EMOJIS[di % 10]}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                                {Math.floor(current.dots / 10)} group{Math.floor(current.dots / 10) > 1 ? 's' : ''} of 10{current.dots % 10 > 0 ? ` + ${current.dots % 10}` : ''} = {current.dots}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="mwt-celebration">
                    <div className="mwt-celeb-card">
                        <div className="mwt-celeb-emoji">🌟</div>
                        <p className="mwt-celeb-msg">{celebMsg}</p>
                        <div className="mwt-celeb-stars" style={{ marginBottom: '20px' }}>
                            {['⭐', '🌟', '✨'].map((s, i) => (
                                <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>{s}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => { setShowCelebration(false); nextItem(); }}
                                style={{ padding: '10px 25px', borderRadius: '15px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Agla ➡️
                            </button>
                            {mode === 'english' && currentIndex < 12 && onWatchMovie && (
                                <button 
                                    onClick={() => { setShowCelebration(false); onWatchMovie(); }}
                                    style={{ padding: '10px 25px', borderRadius: '15px', background: 'linear-gradient(135deg, #f43f5e, #fbbf24)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    🎬 Watch Movie
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Teacher Report Note */}
            <div className="mwt-teacher-note">
                <span>👩‍🏫 Teacher ko report: Aaj {user?.name || 'Bacche'} ne {totalDone} letter{totalDone !== 1 ? 's' : ''} likhe aur {stars} ⭐ star kamaye!</span>
            </div>
        </div>
    );
}


