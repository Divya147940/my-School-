import React, { useState, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorActivityCenter.css';

const JuniorDiscoveryHub = () => {
    const [activeTab, setActiveTab] = useState('science'); 
    const [confetti, setConfetti] = useState(false);
    
    // States
    const [color1, setColor1] = useState(null);
    const [color2, setColor2] = useState(null);
    const [mixedColor, setMixedColor] = useState(null);
    const [trafficLight, setTrafficLight] = useState('red');
    const [dailyStep, setDailyStep] = useState(0); 
    const [selectedBaby, setSelectedBaby] = useState(null);
    const [weather, setWeather] = useState('sunny');
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [activeBodyPart, setActiveBodyPart] = useState(null);
    const [activePianoKey, setActivePianoKey] = useState(null);
    const [selectedRhyme, setSelectedRhyme] = useState(null);
    const [activeHelper, setActiveHelper] = useState(null);

    // Data
    const HABITS = [
        { id: 0, n: 'Savere Utho', e: '🌅', d: 'Suraj ko Namaste bolo!' },
        { id: 1, n: 'Brush Karo', e: '🪥', d: 'Daant achhe se saaf karo!' },
        { id: 2, n: 'Nahao', e: '🚿', d: 'Sabun se nahakar taaza ho jao!' },
        { id: 3, n: 'Nashta Karo', e: '🥣', d: 'Healthy khana Khao!' }
    ];

    const ANIMAL_FAMILIES = [
        { m: 'Cow (Gaay) 🐄', b: 'Calf', me: '🐄', be: '🐮', c: '#f59e0b' },
        { m: 'Lion (Sher) 🦁', b: 'Cub', me: '🦁', be: '🦁', c: '#f97316' },
        { m: 'Cat (Billi) 🐱', b: 'Kitten', me: '🐱', be: '🐈', c: '#ec4899' },
        { m: 'Hen (Murgi) 🐔', b: 'Chick', me: '🐔', be: '🐥', c: '#eab308' }
    ];

    const BODY_PARTS = [
        { n: 'Aankhein', e: 'Eyes 👁️', s: 'Meri aankhein dekhne ke liye hain!' },
        { n: 'Kaan', e: 'Eras 👂', s: 'Mere kaan sunne ke liye hain!' },
        { n: 'Naak', e: 'Nose 👃', s: 'Meri naak soonghne ke liye hai!' },
        { n: 'Haath', e: 'Hands ✋', s: 'Mere haath kaam karne ke liye hain!' },
        { n: 'Pair', e: 'Legs 🦶', s: 'Mere pair chalne aur doudne ke liye hain!' }
    ];

    const EMOTIONS = [
        { n: 'Khushi', e: 'Happy 😄', s: 'Jab main khush hota hoon, main muskuraata hoon!' },
        { n: 'Udaasi', e: 'Sad 😔', s: 'Jab main udaas hota hoon, toh main hoshyaar banta hoon.' },
        { n: 'Gussa', e: 'Angry 😡', s: 'Main lamba saans lekar gussa thanda karta hoon!' },
        { n: 'Masti', e: 'Silly 🤪', s: 'Aao thodi masti karein!' }
    ];

    const WEATHER_TYPES = [
        { id: 'sunny', n: 'Dhoop', e: '☀️', c: '#f59e0b', clothes: '🕶️ Hat aur Sunglasses' },
        { id: 'rainy', n: 'Baarish', e: '🌧️', c: '#3b82f6', clothes: '☂️ Raincoat aur Chhata' },
        { id: 'winter', n: 'Thand', e: '❄️', c: '#8b5cf6', clothes: '🧣 Sweater aur Muffler' },
        { id: 'stormy', n: 'Toofan', e: '⛈️', c: '#475569', clothes: '🏠 Ghar ke andar raho' }
    ];

    const PIANO_KEYS = [
        { id: 'c', e: '🐱', c: '#ef4444', s: 'Meow!' },
        { id: 'd', e: '🐶', c: '#f97316', s: 'Woof!' },
        { id: 'e', e: '🦁', c: '#f59e0b', s: 'Roar!' },
        { id: 'f', e: '🐘', c: '#10b981', s: 'Trumpet!' },
        { id: 'g', e: '🐑', c: '#3b82f6', s: 'Baa!' },
        { id: 'a', e: '🐄', c: '#6366f1', s: 'Moo!' },
        { id: 'b', e: '🐔', c: '#a855f7', s: 'Cluck!' },
        { id: 'c2', e: '🐒', c: '#ec4899', s: 'Hee-Hee!' }
    ];

    const RHYMES = [
        { id: 'hathi', t: 'Haathi Raja', e: '🐘', v: 'https://www.youtube.com/embed/n4XWvM6S-B0', c: '#f97316' },
        { id: 'chanda', t: 'Chanda Mama', e: '🌙', v: 'https://www.youtube.com/embed/H0_99ZpG2OQ', c: '#3b82f6' },
        { id: 'wheels', t: 'Wheels on the Bus', e: '🚌', v: 'https://www.youtube.com/embed/e_04ZrNroTo', c: '#ef4444' },
        { id: 'nani', t: 'Nani Teri Morni', e: '🦚', v: 'https://www.youtube.com/embed/vH87d65JIsM', c: '#10b981' }
    ];

    const CITY_HELPERS = [
        { id: 'doc', n: 'Doctor', e: '👨‍⚕️', s: 'Main aapki tabiyat theek karta hoon!', c: '#ef4444' },
        { id: 'fire', n: 'Fireman', e: '👨‍🚒', s: 'Main aag bujhata hoon!', c: '#f97316' },
        { id: 'poly', n: 'Police', e: '👮', s: 'Main sheher ki raksha karta hoon!', c: '#3b82f6' },
        { id: 'teacher', n: 'Teacher', e: '👩‍🏫', s: 'Main bachhon ko seekhati hoon!', c: '#a855f7' }
    ];

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const triggerWin = () => {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
    };

    useEffect(() => {
        if (color1 && color2) {
            const pairs = {
                '🔴+🔵': { c: '#8b5cf6', n: 'Purple' },
                '🔵+🔴': { c: '#8b5cf6', n: 'Purple' },
                '🔴+🟡': { c: '#f97316', n: 'Orange' },
                '🟡+🔴': { c: '#f97316', n: 'Orange' },
                '🔵+🟡': { c: '#22c55e', n: 'Green' },
                '🟡+🔵': { c: '#22c55e', n: 'Green' },
                '⚪+🔴': { c: '#fb7185', n: 'Pink' },
                '🔴+⚪': { c: '#fb7185', n: 'Pink' }
            };
            const pairKey = `${color1.e}+${color2.e}`;
            const mix = pairs[pairKey];
            if (mix) {
                setMixedColor(mix);
                speak(`Mixing ${color1.n} and ${color2.n} makes ${mix.n}!`);
                triggerWin();
            } else {
                setMixedColor(null);
            }
        }
    }, [color1, color2]);

    return (
        <div className="discovery-hub-container" style={{ minHeight: '90vh', background: '#020617', padding: '20px' }}>
            <JuniorDashboardAnimations />
            
            <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '3rem', color: '#22c55e', marginBottom: '10px' }}>Discovery Hub 🔬</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', maxWidth: '1000px', margin: '0 auto' }}>
                    {['science', 'safety', 'habits', 'animals', 'body', 'weather', 'emotions', 'piano', 'rhymes', 'world'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            padding: '12px',
                            borderRadius: '15px',
                            background: activeTab === tab ? '#22c55e' : 'rgba(255,255,255,0.05)',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                        }}>
                             {tab === 'rhymes' ? '🎵' : tab === 'piano' ? '🎹' : '✨'} {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="glass-panel" style={{ padding: '30px', borderRadius: '30px', minHeight: '60vh', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {activeTab === 'science' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff' }}>Jadui Rang (Color Mixing) 🧪</h2>
                        <div style={{ position: 'relative', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ width: '180px', height: '180px', background: mixedColor?.c || '#333', borderRadius: '50% 50% 40% 40%', border: '6px solid #111', boxShadow: mixedColor ? `0 0 40px ${mixedColor.c}` : 'none', transition: '0.5s all', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontSize: '5rem' }}>{mixedColor ? '✨' : '❔'}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                            {[{e:'🔴', n:'Red', c:'#ef4444'}, {e:'🔵', n:'Blue', c:'#3b82f6'}, {e:'🟡', n:'Yellow', c:'#eab308'}, {e:'⚪', n:'White', c:'#fff'}].map(c => (
                                <button key={c.n} onClick={() => !color1 ? setColor1(c) : setColor2(c)} style={{ padding: '15px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', fontSize: '2.5rem', cursor: 'pointer' }}>{c.e}</button>
                            ))}
                            <button onClick={() => { setColor1(null); setColor2(null); setMixedColor(null); }} style={{ padding: '10px 20px', borderRadius: '10px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>Mitao 🧹</button>
                        </div>
                        {mixedColor && <h3 style={{ color: mixedColor.c, marginTop: '20px' }}>Ye bana {mixedColor.n}!</h3>}
                    </div>
                )}

                {activeTab === 'safety' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '30px' }}>Safety Hero! 🛡️</h2>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                             <div className="card-vibe" style={{ padding: '20px', borderRadius: '25px', background: 'rgba(0,0,0,0.3)', width: '200px' }}>
                                <div style={{ background: '#111', width: '60px', margin: '0 auto', padding: '10px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: trafficLight === 'red' ? '#ef4444' : '#222' }}></div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: trafficLight === 'yellow' ? '#f59e0b' : '#222' }}></div>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: trafficLight === 'green' ? '#22c55e' : '#222' }}></div>
                                </div>
                                <div style={{ marginTop: '15px', color: '#fff' }}>{trafficLight === 'red' ? 'Stop!' : trafficLight === 'yellow' ? 'Wait!' : 'Go!'}</div>
                                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '15px' }}>
                                    {['red', 'yellow', 'green'].map(l => <button key={l} onClick={() => setTrafficLight(l)} style={{ background: l, width: '30px', height: '30px', borderRadius: '5px', border: 'none' }}></button>)}
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'habits' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Good Habits 🧼</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            {HABITS.map((h, i) => (
                                <div key={h.id} onClick={() => { if(dailyStep === i) { setDailyStep(i+1); speak(h.d); if(i===3) triggerWin(); } }} className="card-vibe" style={{ padding: '20px', borderRadius: '20px', background: dailyStep > i ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)', border: dailyStep === i ? '2px solid #22c55e' : '1px solid #444' }}>
                                    <div style={{ fontSize: '3rem' }}>{h.e}</div>
                                    <div style={{ color: '#fff', marginTop: '10px' }}>{h.n}</div>
                                    {dailyStep > i && <div style={{ color: '#22c55e' }}>Done! ✅</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'piano' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Animal Piano 🎹</h2>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', background: '#111', padding: '20px', borderRadius: '20px' }}>
                            {PIANO_KEYS.map(pk => (
                                <button key={pk.id} onMouseDown={() => { setActivePianoKey(pk.id); speak(pk.s); }} onMouseUp={() => setActivePianoKey(null)} style={{ width: '60px', height: '180px', background: activePianoKey === pk.id ? '#fff' : pk.c, borderRadius: '0 0 10px 10px', border: '2px solid #000', cursor: 'pointer', transform: activePianoKey === pk.id ? 'translateY(5px)' : 'none' }}>
                                    <div style={{ fontSize: '1.5rem' }}>{pk.e}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'rhymes' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Nursery Rhymes 🎵</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                            {RHYMES.map(r => (
                                <div key={r.id} onClick={() => setSelectedRhyme(r)} className="card-vibe" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: `2px solid ${r.c}`, cursor: 'pointer' }}>
                                    <div style={{ fontSize: '4rem' }}>{r.e}</div>
                                    <div style={{ color: '#fff', fontWeight: 'bold' }}>{r.t}</div>
                                </div>
                            ))}
                        </div>
                        {selectedRhyme && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ background: '#1e293b', padding: '15px', borderRadius: '20px', width: '90%', maxWidth: '800px' }}>
                                    <button onClick={() => setSelectedRhyme(null)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', marginBottom: '10px' }}>✕ Close</button>
                                    <div style={{ aspectRatio: '16/9' }}>
                                        <iframe width="100%" height="100%" src={selectedRhyme.v} frameBorder="0" allowFullScreen></iframe>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'world' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Hamare Madadgaar (Helpers) 🧑‍🚒</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                            {CITY_HELPERS.map(h => (
                                <div key={h.id} onClick={() => { setActiveHelper(h); speak(h.s); }} className="card-vibe" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: activeHelper?.id === h.id ? `2px solid ${h.c}` : '1px solid #444', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '4rem' }}>{h.e}</div>
                                    <div style={{ color: h.c, fontWeight: 'bold' }}>{h.n}</div>
                                    {activeHelper?.id === h.id && <p style={{ color: '#fff', fontSize: '0.9rem' }}>{h.s}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'emotions' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Emotions Garden 😊</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                            {EMOTIONS.map(emo => (
                                <div key={emo.n} onClick={() => { setSelectedEmotion(emo); speak(emo.s); }} className="card-vibe" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: selectedEmotion?.n === emo.n ? '2px solid #ec4899' : '1px solid #444', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '4rem' }}>{emo.e.split(' ')[1]}</div>
                                    <div style={{ color: '#ec4899', fontWeight: 'bold' }}>{emo.n}</div>
                                    {selectedEmotion?.n === emo.n && <p style={{ color: '#fff', fontSize: '0.8rem' }}>{emo.s}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'animals' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Find the Baby! 🐮</h2>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                             {ANIMAL_FAMILIES.map(ani => (
                                 <div key={ani.m} className="card-vibe" style={{ padding: '20px', borderRadius: '25px', background: 'rgba(255,255,255,0.02)', border: `2px solid ${ani.c}`, width: '220px' }}>
                                     <div style={{ fontSize: '4rem' }}>{ani.me}</div>
                                     <div style={{ color: '#fff' }}>Mama {ani.m.split(' ')[0]}</div>
                                     <div onClick={() => { setSelectedBaby(ani.m); speak(`This is the ${ani.b}`); triggerWin(); }} style={{ fontSize: '2.5rem', margin: '15px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '15px', cursor: 'pointer' }}>
                                         {selectedBaby === ani.m ? ani.be : '❓'}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}

                {activeTab === 'body' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Body Magic 👤</h2>
                        <div style={{ fontSize: '8rem' }}>🧒</div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            {BODY_PARTS.map(part => (
                                <button key={part.n} onClick={() => { setActiveBodyPart(part); speak(part.s); }} style={{ padding: '10px 15px', borderRadius: '10px', background: activeBodyPart?.n === part.n ? '#ef4444' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer' }}>{part.n}</button>
                            ))}
                        </div>
                        {activeBodyPart && <p style={{ color: '#fff', marginTop: '20px' }}>{activeBodyPart.s}</p>}
                    </div>
                )}

                {activeTab === 'weather' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '25px' }}>Weather Magic 🌦️</h2>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px' }}>
                            {WEATHER_TYPES.map(w => (
                                <button key={w.id} onClick={() => { setWeather(w.id); speak(`It is ${w.n}! Wear ${w.clothes}`); }} style={{ fontSize: '2.5rem', background: weather === w.id ? w.c : 'transparent', border: 'none', cursor: 'pointer', borderRadius: '15px', padding: '10px' }}>{w.e}</button>
                            ))}
                        </div>
                        <div className="card-vibe" style={{ padding: '30px', borderRadius: '30px', border: `2px solid ${WEATHER_TYPES.find(wt => wt.id === weather).c}` }}>
                             <div style={{ fontSize: '5rem' }}>{weather === 'sunny' ? '☀️🌳' : weather === 'rainy' ? '🌧️🌲' : '❄️🏔️'}</div>
                             <h3 style={{ color: '#fff' }}>{WEATHER_TYPES.find(wt => wt.id === weather).n}</h3>
                             <p style={{ color: 'rgba(255,255,255,0.7)' }}>{WEATHER_TYPES.find(wt => wt.id === weather).clothes}</p>
                        </div>
                    </div>
                )}

                {confetti && (
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', pointerEvents: 'none' }}>🎉✨🧪</div>
                )}
            </main>
        </div>
    );
};

export default JuniorDiscoveryHub;
