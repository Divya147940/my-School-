import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MagicKidsWorld.css';

// ─────────────────── DATA ───────────────────
const ANIMALS = [
  { emoji: '🐶', name: 'Kutte', sound: 'Bow Bow! 🐾', color: '#f59e0b' },
  { emoji: '🐱', name: 'Billi', sound: 'Meow Meow! 😸', color: '#ec4899' },
  { emoji: '🐮', name: 'Gaay', sound: 'Moooo! 🐄', color: '#10b981' },
  { emoji: '🐸', name: 'Mendhak', sound: 'Ribbit Ribbit! 🌿', color: '#22c55e' },
  { emoji: '🦁', name: 'Sher', sound: 'Roarrr! 👑', color: '#f97316' },
  { emoji: '🐘', name: 'Haathi', sound: 'Pahhh! 🌊', color: '#8b5cf6' },
  { emoji: '🐧', name: 'Penguin', sound: 'Squeak! ❄️', color: '#3b82f6' },
  { emoji: '🦆', name: 'Batakh', sound: 'Quack Quack! 🦆', color: '#06b6d4' },
];

const FRUITS = [
  { emoji: '🍎', name: 'Seb', color: '#ef4444' },
  { emoji: '🍌', name: 'Kela', color: '#fbbf24' },
  { emoji: '🍇', name: 'Angoor', color: '#8b5cf6' },
  { emoji: '🍊', name: 'Santra', color: '#f97316' },
  { emoji: '🍓', name: 'Strawberry', color: '#ec4899' },
  { emoji: '🥭', name: 'Aam', color: '#f59e0b' },
];

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => ({
  letter: l,
  word: ['Apple','Ball','Cat','Dog','Elephant','Fish','Goat','Hat','Ice','Jar','Kite','Lion','Mango','Net','Orange','Pig','Queen','Rabbit','Sun','Tiger','Umbrella','Van','Whale','Xmas','Yak','Zebra'][i],
  emoji: ['🍎','🏀','🐱','🐶','🐘','🐟','🐐','🎩','🧊','🫙','🪁','🦁','🥭','🎣','🍊','🐷','👑','🐰','☀️','🐯','☂️','🚐','🐳','🎄','🐑','🦓'][i],
  color: `hsl(${i * 14}, 70%, 55%)`
}));

const NUMBERS = Array.from({ length: 10 }, (_, i) => ({
  num: i + 1,
  emoji: ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'][i],
  items: Array(i + 1).fill('⭐'),
  color: `hsl(${i * 36}, 70%, 55%)`
}));

const SHAPES = [
  { name: 'Circle', emoji: '⭕', color: '#ef4444', desc: 'Gol gol!' },
  { name: 'Square', emoji: '🟦', color: '#3b82f6', desc: '4 sides!' },
  { name: 'Triangle', emoji: '🔺', color: '#f59e0b', desc: '3 corners!' },
  { name: 'Star', emoji: '⭐', color: '#eab308', desc: 'Twinkling!' },
  { name: 'Heart', emoji: '❤️', color: '#ec4899', desc: 'Love love!' },
  { name: 'Diamond', emoji: '💎', color: '#06b6d4', desc: 'Shiny!' },
];

const COLORS_GAME = [
  { name: 'Laal', en: 'Red', hex: '#ef4444', emoji: '🔴' },
  { name: 'Neela', en: 'Blue', hex: '#3b82f6', emoji: '🔵' },
  { name: 'Peela', en: 'Yellow', hex: '#eab308', emoji: '🟡' },
  { name: 'Hara', en: 'Green', hex: '#22c55e', emoji: '🟢' },
  { name: 'Naarangi', en: 'Orange', hex: '#f97316', emoji: '🟠' },
  { name: 'Gulabi', en: 'Pink', hex: '#ec4899', emoji: '🩷' },
];

const SPACE_OBJECTS = [
  { name: 'Suraj', en: 'Sun', emoji: '☀️', color: '#f59e0b', fact: 'Suraj ek bada garama gola hai, jo humein roshni deta hai!' },
  { name: 'Chandamama', en: 'Moon', emoji: '🌙', color: '#cbd5e1', fact: 'Chanda raat ko chamakta hai aur dhoop ki roshni leta hai!' },
  { name: 'Dharti', en: 'Earth', emoji: '🌍', color: '#3b82f6', fact: 'Humari pyaari dharti! Yahan hum sab milkar rehte hain.' },
  { name: 'Mangal', en: 'Mars', emoji: '🔴', color: '#ef4444', fact: 'Mangal ek lal rang ka grah hai!' },
  { name: 'Shani', en: 'Saturn', emoji: '🪐', color: '#d97706', fact: 'Shani ke paas sundar rings hoti hain!' },
];

const NATURE_FACTS = [
  { id: 1, text: 'Ped humein oxygen dete hain, jis-se hum saans lete hain!', emoji: '🌳' },
  { id: 2, text: 'Paudhon ko badhne ke liye dhoop aur pani chahiye!', emoji: '💧' },
  { id: 3, text: 'Humein ped nahi kaatne chahiye, unhe lagana chahiye!', emoji: '🌱' },
];

const DISCOVERY_CARDS = [
  { topic: 'Badi Whale', emoji: '🐋', fact: 'Ek Blue Whale itni badi hoti hai ki wo 3 buses ke jitni lambi hai!' },
  { topic: 'Jungle ka Raja', emoji: '🦁', fact: 'Lion ki dahaad (roar) 3 kilometer door tak suni ja sakti hai!' },
  { topic: 'Chamakti Macchhali', emoji: '🐠', fact: 'Samudra ke neeche kai aisi macchhaliyan hain jo andhere mein chamakti hain!' },
];

// ─────────────────── SPARKLE COMPONENT ───────────────────
const Sparkles = ({ x, y }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    distance: 40 + Math.random() * 30,
    color: ['#ffd700', '#ff69b4', '#00bfff', '#7fff00', '#ff4500', '#9370db'][i % 6]
  }));
  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => (
        <div key={p.id} className="mkw-sparkle-particle" style={{
          '--angle': `${p.angle}deg`,
          '--dist': `${p.distance}px`,
          background: p.color,
        }} />
      ))}
      <div style={{ fontSize: '1.5rem', position: 'absolute', top: -20, left: -15, animation: 'mkw-pop 0.5s ease-out forwards' }}>✨</div>
    </div>
  );
};

// ─────────────────── FLOATING STAR ───────────────────
const FloatingStar = ({ style }) => (
  <div className="mkw-floating-star" style={style}>⭐</div>
);

// ─────────────────── MAGIC CARD ───────────────────
const MagicCard = ({ emoji, name, color, subText, onClick, size = 'md' }) => {
  const [hovered, setHovered] = useState(false);
  const [sparkPos, setSparkPos] = useState(null);
  const cardRef = useRef();

  const handleEnter = (e) => {
    setHovered(true);
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) setSparkPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setTimeout(() => setSparkPos(null), 600);
  };

  const sizes = { sm: { pad: '16px', emojiSize: '2.5rem', nameSize: '0.85rem' }, md: { pad: '24px', emojiSize: '3.5rem', nameSize: '1rem' }, lg: { pad: '30px', emojiSize: '4.5rem', nameSize: '1.1rem' } };
  const s = sizes[size];

  return (
    <>
      {sparkPos && <Sparkles x={sparkPos.x} y={sparkPos.y} />}
      <div
        ref={cardRef}
        className={`mkw-magic-card ${hovered ? 'mkw-magic-card--hovered' : ''}`}
        style={{ '--card-color': color, padding: s.pad, cursor: 'pointer' }}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div className="mkw-card-emoji" style={{ fontSize: s.emojiSize }}>{emoji}</div>
        <div className="mkw-card-name" style={{ fontSize: s.nameSize, color }}>{name}</div>
        {subText && <div className="mkw-card-sub">{subText}</div>}
        <div className="mkw-card-glow" style={{ background: color }} />
        {hovered && <div className="mkw-card-stars">
          {['✨', '⭐', '🌟', '💫'].map((s, i) => (
            <span key={i} className="mkw-card-star-burst" style={{ '--delay': `${i * 0.1}s`, '--x': `${(Math.random() - 0.5) * 80}px`, '--y': `${-(Math.random() * 60 + 20)}px` }}>{s}</span>
          ))}
        </div>}
      </div>
    </>
  );
};

// ─────────────────── MAGIC CURSOR TRAIL ───────────────────
const useMouseTrail = (active) => {
  const [trail, setTrail] = useState([]);
  useEffect(() => {
    if (!active) return;
    const handleMove = (e) => {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        emoji: ['✨', '⭐', '🌟', '💫', '🪄'][Math.floor(Math.random() * 5)],
        rot: Math.random() * 360,
      };
      setTrail(prev => [...prev.slice(-15), newParticle]);
    };
    window.addEventListener('mousemove', handleMove);
    const timer = setInterval(() => {
      setTrail(prev => prev.slice(1));
    }, 100);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearInterval(timer);
    };
  }, [active]);
  return trail;
};

// ─────────────────── CARTOON ELEMENTS ───────────────────
const SmilingSun = () => (
  <div className="mkw-smiling-sun">
    <div className="mkw-sun-rays">☀️</div>
    <div className="mkw-sun-face">😊</div>
  </div>
);

const Mascot = ({ onClick }) => (
  <div className="mkw-mascot" onClick={onClick}>
    <div className="mkw-mascot-emoji">🐼</div>
    <div className="mkw-mascot-chat">नमस्ते! 👋</div>
  </div>
);

// ─────────────────── MAIN COMPONENT ───────────────────
const MagicKidsWorld = () => {
  const [activeGame, setActiveGame] = useState('home');
  const [score, setScore] = useState(0);
  const [celebration, setCelebration] = useState(false);
  const [floatingStars, setFloatingStars] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [butterflies, setButterflies] = useState([]);
  const [animalResult, setAnimalResult] = useState(null);
  const [selectedAlpha, setSelectedAlpha] = useState(null);
  const [selectedNum, setSelectedNum] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [clickEffect, setClickEffect] = useState(null);
  
  // Game States
  const [balloons, setBalloons] = useState([]);
  const [peekBoxes, setPeekBoxes] = useState([
    { id: 1, open: false, animal: null },
    { id: 2, open: false, animal: null },
    { id: 3, open: false, animal: null }
  ]);
  const [poppedBalloons, setPoppedBalloons] = useState([]);

  // Discovery States
  const [discoveryMode, setDiscoveryMode] = useState('hub');
  const [selectedSpaceObj, setSelectedSpaceObj] = useState(null);
  const [plantStage, setPlantStage] = useState(0);

  const trail = useMouseTrail(true);

  // Background Atmosphere (Stars, Clouds, Butterflies)
  useEffect(() => {
    const stars = Array.from({ length: 15 }, (_, i) => ({
      id: i, x: Math.random() * 95, y: Math.random() * 95, size: Math.random() * 1.5 + 0.8,
      delay: Math.random() * 3, duration: Math.random() * 4 + 3,
    }));
    setFloatingStars(stars);

    const initialClouds = Array.from({ length: 4 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: 5 + Math.random() * 20, size: 2 + Math.random() * 3,
      speed: 15 + Math.random() * 10
    }));
    setClouds(initialClouds);

    const initialButterflies = Array.from({ length: 3 }, (_, i) => ({
      id: i, x: Math.random() * 90, y: 40 + Math.random() * 40, delay: i * 2
    }));
    setButterflies(initialButterflies);
  }, []);

  // Balloon Generation
  useEffect(() => {
    if (activeGame === 'balloons') {
      const interval = setInterval(() => {
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
        const newBalloon = {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: 110,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 1 + 0.5,
          size: Math.random() * 40 + 60,
          pop: false
        };
        setBalloons(prev => [...prev.slice(-10), newBalloon]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [activeGame]);

  useEffect(() => {
    if (activeGame === 'balloons') {
      const moveInterval = setInterval(() => {
        setBalloons(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -20));
      }, 30);
      return () => clearInterval(moveInterval);
    }
  }, [activeGame]);

  const celebrate = useCallback((fast = false) => {
    setCelebration(true);
    setScore(s => s + (fast ? 5 : 10));
    if (!fast) speak('Wah! Bahut accha! Shabash!');
    setTimeout(() => setCelebration(false), fast ? 800 : 2500);
  }, []);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.pitch = 1.8; u.rate = 1.0; u.volume = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  const playPop = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-10.mp3');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const handleBalloonPop = (id) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, pop: true } : b));
    playPop();
    celebrate(true);
    setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== id));
    }, 300);
  };

  const handlePeekBox = (id) => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setPeekBoxes(prev => prev.map(box => box.id === id ? { ...box, open: true, animal: randomAnimal } : box));
    speak(`Peek-a-boo! Dekho ${randomAnimal.name}!`);
    celebrate();
    setTimeout(() => {
      setPeekBoxes(prev => prev.map(box => box.id === id ? { ...box, open: false } : box));
    }, 3000);
  };

  const handleClick = (e) => {
    setClickEffect({ x: e.clientX, y: e.clientY, id: Date.now() });
    setTimeout(() => setClickEffect(null), 600);
  };

  const GAMES = [
    { id: 'discovery', emoji: '🚀', label: 'Gyan Planet', labelEn: 'Discovery', color: '#6366f1', bg: 'linear-gradient(135deg, #6366f1, #3b82f6)' },
    { id: 'animals', emoji: '🐶', label: 'Janwar', labelEn: 'Animals', color: '#f59e0b', bg: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { id: 'alphabet', emoji: '🔤', label: 'Varnmala', labelEn: 'A-B-C', color: '#3b82f6', bg: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' },
    { id: 'balloons', emoji: '🎈', label: 'Gubbare', labelEn: 'Pop It!', color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { id: 'numbers', emoji: '🔢', label: 'Ginti', labelEn: '1-2-3', color: '#10b981', bg: 'linear-gradient(135deg, #10b981, #22c55e)' },
    { id: 'peekaboo', emoji: '🎁', label: 'Jadui Box', labelEn: 'Mystery', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
    { id: 'shapes', emoji: '🔷', label: 'Aakritiya', labelEn: 'Shapes', color: '#ec4899', bg: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { id: 'colors', emoji: '🎨', label: 'Rang', labelEn: 'Colors', color: '#8b5cf6', bg: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
    { id: 'fruits', emoji: '🍎', label: 'Phal', labelEn: 'Fruits', color: '#ef4444', bg: 'linear-gradient(135deg, #ef4444, #f97316)' },
  ];

  return (
    <div className="mkw-root" onClick={handleClick} style={{ cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' style='font-size:30px'><text y='30'>🪄</text></svg>"), auto` }}>
      
      {/* Cartoon Atmosphere */}
      <div className="mkw-atmosphere">
        <SmilingSun />
        {clouds.map(c => (
          <div key={c.id} className="mkw-cloud" style={{ left: `${c.x}%`, top: `${c.y}%`, fontSize: `${c.size}rem`, '--speed': `${c.speed}s` }}>☁️</div>
        ))}
        {butterflies.map(b => (
          <div key={b.id} className="mkw-butterfly" style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: `${b.delay}s` }}>🦋</div>
        ))}
      </div>

      {/* Mascot */}
      <Mascot onClick={() => { celebrate(true); speak('Namaste bacho! Main hoon aapka Jadui dost!'); }} />

      {/* Mouse Trail */}
      {trail.map(p => (
        <div key={p.id} className="mkw-trail-particle" style={{ left: p.x, top: p.y, transform: `rotate(${p.rot}deg)` }}>
          {p.emoji}
        </div>
      ))}

      {/* Celebration Burst */}
      {celebration && (
        <div className="mkw-celebration">
          {['🎉','⭐','🌟','🎈','💫','🏆','✨','🎊'].map((e, i) => (
            <span key={i} className="mkw-confetti" style={{
              '--x': `${(Math.random() - 0.5) * 200}px`,
              '--y': `${-(Math.random() * 200 + 100)}px`,
              '--delay': `${i * 0.08}s`,
              left: `${30 + Math.random() * 40}%`,
            }}>{e}</span>
          ))}
          <div className="mkw-celebration-text">🎉 Shabash! +10 ⭐</div>
        </div>
      )}

      {/* Click Sparkle */}
      {clickEffect && <Sparkles x={clickEffect.x} y={clickEffect.y} />}

      {/* Floating Stars Background */}
      <div className="mkw-bg-stars">
        {floatingStars.map(s => (
          <FloatingStar key={s.id} style={{
            left: `${s.x}%`, top: `${s.y}%`,
            fontSize: `${s.size}rem`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }} />
        ))}
      </div>

        {/* Atmosphere */}
        <div className="cartoon-atmosphere">
          <div className="sun-rotating">☀️😊</div>
          <div className="cloud-drift c1">☁️</div>
          <div className="cloud-drift c2">☁️</div>
          <div className="butterfly b1">🦋</div>
          <div className="butterfly b2">🦋</div>
          <div className="balloon bl1">🎈</div>
          <div className="balloon bl2">🎈</div>
          <div className="rainbow-move">🌈</div>
          <div className="confetti-rain">✨✨✨</div>
        </div>

      {/* Header */}
      <div className="mkw-header">
        <div className="mkw-header-left">
          <span className="mkw-header-emoji">🌈</span>
          <div>
            <h1 className="mkw-title">Jadu Ki Duniya ✨</h1>
            <p className="mkw-subtitle">Class 0 - 2 ke liye Magic World! 🪄</p>
          </div>
        </div>
        <div className="mkw-score-badge">
          <span className="mkw-score-star">⭐</span>
          <span className="mkw-score-num">{score}</span>
          <span className="mkw-score-label">Stars</span>
        </div>
      </div>

      {/* Back Button */}
      {activeGame !== 'home' && (
        <button className="mkw-back-btn" onClick={() => { setActiveGame('home'); setAnimalResult(null); setSelectedAlpha(null); setSelectedNum(null); setSelectedShape(null); setSelectedColor(null); setSelectedFruit(null); }}>
          ← Wapas Jao 🏠
        </button>
      )}

      {/* ─── DISCOVERY PLANET ─── */}
      {activeGame === 'discovery' && (
        <div className="mkw-section">
          {discoveryMode === 'hub' ? (
            <div className="mkw-discovery-hub">
              <h2 className="mkw-section-title">🚀 Discovery Planet (Gyan Ki Duniya)</h2>
              <div className="mkw-grid-3">
                <button className="mkw-disco-btn" onClick={() => { setDiscoveryMode('space'); speak('Chalo Antariksh ki sair karte hain!'); }}>
                  <span style={{ fontSize: '3rem' }}>🌌</span>
                  <div className="mkw-disco-label">Antariksh (Space)</div>
                </button>
                <button className="mkw-disco-btn" onClick={() => { setDiscoveryMode('nature'); speak('Chalo Prakriti ke baare mein seekhte hain!'); }}>
                  <span style={{ fontSize: '3rem' }}>🌿</span>
                  <div className="mkw-disco-label">Hariyali (Nature)</div>
                </button>
                <button className="mkw-disco-btn" onClick={() => { setDiscoveryMode('facts'); speak('Kya aap jante hain? Mazedaar baatein!'); }}>
                  <span style={{ fontSize: '3rem' }}>💡</span>
                  <div className="mkw-disco-label">Discovery Cards</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="mkw-discovery-content">
              <button className="mkw-disco-back" onClick={() => setDiscoveryMode('hub')}>← Hub par Jao</button>

              {/* Space Voyager */}
              {discoveryMode === 'space' && (
                <div className="mkw-space-voyager">
                  <h3 className="mkw-disco-title">🌌 Space ki Sair!</h3>
                  <div className="mkw-space-scene">
                    {SPACE_OBJECTS.map(obj => (
                      <div key={obj.name} className={`mkw-space-obj ${selectedSpaceObj?.name === obj.name ? 'mkw-space-obj--zoomed' : ''}`}
                        onClick={() => { setSelectedSpaceObj(obj); speak(obj.fact); celebrate(true); }}>
                        <span style={{ fontSize: '4.5rem', filter: `drop-shadow(0 0 15px ${obj.color})` }}>{obj.emoji}</span>
                        <div className="mkw-obj-name" style={{ color: obj.color }}>{obj.name}</div>
                      </div>
                    ))}
                  </div>
                  {selectedSpaceObj && (
                    <div className="mkw-discovery-fact-box" style={{ borderColor: selectedSpaceObj.color }}>
                      <strong>{selectedSpaceObj.name} ({selectedSpaceObj.en}):</strong> {selectedSpaceObj.fact}
                    </div>
                  )}
                </div>
              )}

              {/* Nature World */}
              {discoveryMode === 'nature' && (
                <div className="mkw-nature-world">
                  <h3 className="mkw-disco-title">🌱 Jadu Ka Ped (Magic Tree)</h3>
                  <div className="mkw-nature-scene">
                    <div className={`mkw-magic-tree mkw-tree-stage-${plantStage}`}>
                      {plantStage === 0 && '🌱'}
                      {plantStage === 1 && '🌿'}
                      {plantStage === 2 && '🌳'}
                      {plantStage === 3 && '🌳🌸'}
                    </div>
                    {plantStage < 3 ? (
                      <div className="mkw-nature-controls">
                        <button className="mkw-nature-tool" onClick={() => { setPlantStage(s => s + 1); celebrate(true); speak('Bahut acccha! Dekho ped badh raha hai!'); }}>
                          {plantStage === 0 ? '💧 Pani Do' : plantStage === 1 ? '☀️ Dhoop Do' : '✨ Jadu Karo'}
                        </button>
                      </div>
                    ) : (
                      <div className="mkw-nature-success">
                        <p>✨ Wah! Aapne ek sundar ped ugaaya! ✨</p>
                        <p style={{ fontSize: '1.2rem', color: '#10b981' }}>Ped humein saans lene mein madad karte hain.</p>
                        <button className="mkw-disco-back" style={{ marginTop: '10px' }} onClick={() => setPlantStage(0)}>Restart 🔄</button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Discovery Facts */}
              {discoveryMode === 'facts' && (
                <div className="mkw-facts-world">
                  <h3 className="mkw-disco-title">💡 Kya aap jaante hain?</h3>
                  <div className="mkw-grid-3">
                    {DISCOVERY_CARDS.map(card => (
                      <div key={card.topic} className="mkw-fact-card" onClick={() => { speak(card.fact); celebrate(true); }}>
                        <span style={{ fontSize: '3rem' }}>{card.emoji}</span>
                        <h4 style={{ color: '#6366f1' }}>{card.topic}</h4>
                        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{card.fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── HOME ─── */}
      {activeGame === 'home' && (

        <div className="mkw-home">
          <p className="mkw-home-desc">Kya sikhna chaahe aaj? 👇</p>
          <div className="mkw-game-grid">
            {GAMES.map(g => (
              <button
                key={g.id}
                className="mkw-game-btn"
                style={{ '--game-bg': g.bg, '--game-color': g.color }}
                onClick={() => { setActiveGame(g.id); speak(`Chalo ${g.label} seekhte hain!`); }}
              >
                <span className="mkw-game-emoji">{g.emoji}</span>
                <span className="mkw-game-label">{g.label}</span>
                <span className="mkw-game-label-en">{g.labelEn}</span>
                <div className="mkw-game-sparkle-ring" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── ANIMALS ─── */}
      {activeGame === 'animals' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🐶 Janwaron ki Duniya!</h2>
          {animalResult && (
            <div className="mkw-result-bubble" style={{ borderColor: animalResult.color }}>
              <span style={{ fontSize: '3rem' }}>{animalResult.emoji}</span>
              <div style={{ color: animalResult.color, fontWeight: '800', fontSize: '1.3rem' }}>{animalResult.name} bolte hain:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{animalResult.sound}</div>
            </div>
          )}
          <div className="mkw-grid-4">
            {ANIMALS.map(a => (
              <MagicCard key={a.name} emoji={a.emoji} name={a.name} color={a.color} subText="👆 Click karo!" size="lg"
                onClick={() => { setAnimalResult(a); celebrate(); speak(`${a.name}! ${a.sound}`); }} />
            ))}
          </div>
        </div>
      )}

      {/* ─── ALPHABET ─── */}
      {activeGame === 'alphabet' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🔤 A B C Seekho!</h2>
          {selectedAlpha && (
            <div className="mkw-alpha-detail" style={{ borderColor: selectedAlpha.color }}>
              <span style={{ fontSize: '5rem', filter: `drop-shadow(0 0 20px ${selectedAlpha.color})` }}>{selectedAlpha.emoji}</span>
              <div style={{ fontSize: '4rem', fontWeight: '900', color: selectedAlpha.color, lineHeight: 1 }}>{selectedAlpha.letter}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>for <span style={{ color: selectedAlpha.color }}>{selectedAlpha.word}</span></div>
            </div>
          )}
          <div className="mkw-alpha-grid">
            {ALPHABETS.map(a => (
              <button key={a.letter} className={`mkw-alpha-btn ${selectedAlpha?.letter === a.letter ? 'mkw-alpha-btn--active' : ''}`}
                style={{ '--alpha-color': a.color }}
                onClick={() => { setSelectedAlpha(a); speak(`${a.letter} for ${a.word}`); celebrate(); }}>
                {a.letter}
                <span className="mkw-alpha-emoji">{a.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── NUMBERS ─── */}
      {activeGame === 'numbers' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🔢 Ginti Seekho!</h2>
          {selectedNum && (
            <div className="mkw-num-detail" style={{ borderColor: selectedNum.color }}>
              <div style={{ fontSize: '5rem', fontWeight: '900', color: selectedNum.color }}>{selectedNum.num}</div>
              <div style={{ fontSize: '2rem', letterSpacing: '4px' }}>{selectedNum.items.join('')}</div>
              <div style={{ color: selectedNum.color, fontSize: '1.2rem', fontWeight: '700' }}>{selectedNum.num} tare! ⭐</div>
            </div>
          )}
          <div className="mkw-grid-5">
            {NUMBERS.map(n => (
              <button key={n.num} className={`mkw-num-btn ${selectedNum?.num === n.num ? 'mkw-num-btn--active' : ''}`}
                style={{ '--num-color': n.color }}
                onClick={() => { setSelectedNum(n); speak(`${n.num}...`); celebrate(); }}>
                <span className="mkw-num-big">{n.num}</span>
                <span className="mkw-num-emoji">{n.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── BALLOONS POP ─── */}
      {activeGame === 'balloons' && (
        <div className="mkw-section mkw-balloons-area">
          <h2 className="mkw-section-title">🎈 Gubbare Phodo! (Pop the Balloons)</h2>
          <div className="mkw-balloon-score">Pop as many as you can! 🎯</div>
          <div className="mkw-balloons-container">
            {balloons.map(b => (
              <div
                key={b.id}
                className={`mkw-balloon ${b.pop ? 'mkw-balloon--pop' : ''}`}
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  backgroundColor: b.color,
                  width: `${b.size}px`,
                  height: `${b.size * 1.2}px`,
                  boxShadow: `inset -10px -10px 20px rgba(0,0,0,0.2), 0 10px 20px ${b.color}44`
                }}
                onClick={() => handleBalloonPop(b.id)}
              >
                <div className="mkw-balloon-shine" />
                <div className="mkw-balloon-string" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── PEEK-A-BOO ─── */}
      {activeGame === 'peekaboo' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🎁 Jadui Box (Peek-a-Boo!)</h2>
          <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '30px' }}>Box par click karo aur dekho kaun chhupa hai! 🕵️‍♂️</p>
          <div className="mkw-grid-3">
            {peekBoxes.map(box => (
              <div key={box.id} className="mkw-peek-container">
                <div 
                  className={`mkw-peek-box ${box.open ? 'mkw-peek-box--open' : ''}`}
                  onClick={() => !box.open && handlePeekBox(box.id)}
                >
                  <div className="mkw-box-lid">🎁</div>
                  <div className="mkw-box-body">
                    {box.open && (
                      <div className="mkw-peek-animal">
                        <span style={{ fontSize: '4rem' }}>{box.animal.emoji}</span>
                        <div style={{ color: box.animal.color, fontWeight: '900' }}>{box.animal.name}!</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SHAPES ─── */}
      {activeGame === 'shapes' && (

        <div className="mkw-section">
          <h2 className="mkw-section-title">🔷 Aakritiya Seekho!</h2>
          {selectedShape && (
            <div className="mkw-result-bubble" style={{ borderColor: selectedShape.color }}>
              <span style={{ fontSize: '4rem' }}>{selectedShape.emoji}</span>
              <div style={{ color: selectedShape.color, fontWeight: '800', fontSize: '1.5rem' }}>{selectedShape.name}</div>
              <div style={{ fontSize: '1.1rem', color: '#94a3b8' }}>{selectedShape.desc}</div>
            </div>
          )}
          <div className="mkw-grid-3">
            {SHAPES.map(s => (
              <MagicCard key={s.name} emoji={s.emoji} name={s.name} color={s.color} subText={s.desc} size="lg"
                onClick={() => { setSelectedShape(s); celebrate(); speak(`Ye hai ${s.name}! ${s.desc}`); }} />
            ))}
          </div>
        </div>
      )}

      {/* ─── COLORS ─── */}
      {activeGame === 'colors' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🎨 Rang Pehchano!</h2>
          {selectedColor && (
            <div className="mkw-color-result" style={{ background: selectedColor.hex }}>
              <span style={{ fontSize: '3rem' }}>{selectedColor.emoji}</span>
              <div style={{ fontWeight: '900', fontSize: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{selectedColor.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>{selectedColor.en}</div>
            </div>
          )}
          <div className="mkw-grid-3">
            {COLORS_GAME.map(c => (
              <button key={c.name} className="mkw-color-btn"
                style={{ '--c-hex': c.hex, background: c.hex }}
                onClick={() => { setSelectedColor(c); celebrate(); speak(`Ye hai ${c.name} rang!`); }}>
                <span style={{ fontSize: '2.5rem' }}>{c.emoji}</span>
                <span className="mkw-color-name">{c.name}</span>
                <div className="mkw-color-shine" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── FRUITS ─── */}
      {activeGame === 'fruits' && (
        <div className="mkw-section">
          <h2 className="mkw-section-title">🍎 Phal Seekho!</h2>
          {selectedFruit && (
            <div className="mkw-result-bubble" style={{ borderColor: selectedFruit.color }}>
              <span style={{ fontSize: '5rem' }}>{selectedFruit.emoji}</span>
              <div style={{ color: selectedFruit.color, fontWeight: '800', fontSize: '1.8rem' }}>{selectedFruit.name}</div>
            </div>
          )}
          <div className="mkw-grid-3">
            {FRUITS.map(f => (
              <MagicCard key={f.name} emoji={f.emoji} name={f.name} color={f.color} subText="Swadisht! 😋" size="lg"
                onClick={() => { setSelectedFruit(f); celebrate(); speak(`Ye hai ${f.name}! Bahut tasty!`); }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MagicKidsWorld;
