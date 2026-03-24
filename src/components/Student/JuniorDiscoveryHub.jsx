import React, { useState, useEffect } from 'react';
import JuniorDashboardAnimations from '../Common/JuniorDashboardAnimations';
import './JuniorActivityCenter.css';

const JuniorDiscoveryHub = () => {
    const [activeTab, setActiveTab] = useState('science'); // science, safety, values, world
    const [confetti, setConfetti] = useState(false);
    
    // Science State
    const [color1, setColor1] = useState(null);
    const [color2, setColor2] = useState(null);
    const [mixedColor, setMixedColor] = useState(null);

    // Safety State
    const [trafficLight, setTrafficLight] = useState('red');

    // Speech Utility
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

    // --- Color Mixing Logic ---
    useEffect(() => {
        if (color1 && color2) {
            const pairs = {
                '🔴+🔵': { c: '#8b5cf6', n: 'Purple (Baingani)' },
                '🔵+🔴': { c: '#8b5cf6', n: 'Purple (Baingani)' },
                '🔴+🟡': { c: '#f97316', n: 'Orange (Narangi)' },
                '🟡+🔴': { c: '#f97316', n: 'Orange (Narangi)' },
                '🔵+🟡': { c: '#22c55e', n: 'Green (Hara)' },
                '🟡+🔵': { c: '#22c55e', n: 'Green (Hara)' },
                '⚪+🔴': { c: '#fb7185', n: 'Pink (Gulabi)' },
                '🔴+⚪': { c: '#fb7185', n: 'Pink (Gulabi)' }
            };
            const mix = pairs[`${color1.e}+${color2.e}`];
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
        <div className="junior-activity-center" style={{ minHeight: '90vh', background: '#020617', padding: '20px' }}>
            <JuniorDashboardAnimations />
            
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', color: '#22c55e', textShadow: '0 0 20px rgba(34,197,94,0.5)' }}>Discovery Hub 🔬</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>Chalo naye ajoobe dekhte hain!</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
                    <button onClick={() => setActiveTab('science')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'science' ? '#22c55e' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🧪 Science Fun</button>
                    <button onClick={() => setActiveTab('safety')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'safety' ? '#3b82f6' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🛡️ Safety Hero</button>
                    <button onClick={() => setActiveTab('values')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'values' ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🤝 Value Tales</button>
                    <button onClick={() => setActiveTab('world')} style={{ padding: '15px 30px', borderRadius: '20px', background: activeTab === 'world' ? '#ec4899' : 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>🌍 My World</button>
                </div>
            </header>

            <main className="glass-panel" style={{ padding: '40px', borderRadius: '40px', minHeight: '60vh' }}>
                {activeTab === 'science' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '30px' }}>Magical Color Mixer 🎨</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: color1?.c || 'rgba(255,255,255,0.05)', border: '4px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{color1?.e}</div>
                            <div style={{ fontSize: '3rem', color: '#fff' }}>+</div>
                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: color2?.c || 'rgba(255,255,255,0.05)', border: '4px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{color2?.e}</div>
                            <div style={{ fontSize: '3rem', color: '#fff' }}>=</div>
                            <div className="card-vibe" style={{ width: '200px', height: '200px', borderRadius: '50%', background: mixedColor?.c || 'rgba(255,255,255,0.02)', border: '6px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', textAlign: 'center' }}>
                                {mixedColor ? mixedColor.n : '???'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            {[{e:'🔴', n:'Red', c:'#ef4444'}, {e:'🔵', n:'Blue', c:'#3b82f6'}, {e:'🟡', n:'Yellow', c:'#eab308'}, {e:'⚪', n:'White', c:'#fff'}].map(c => (
                                <button key={c.n} onClick={() => !color1 ? setColor1(c) : setColor2(c)} style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', fontSize: '3rem', cursor: 'pointer' }}>{c.e}</button>
                            ))}
                            <button onClick={() => { setColor1(null); setColor2(null); setMixedColor(null); }} style={{ padding: '10px 20px', borderRadius: '15px' }}>Reset</button>
                        </div>
                    </div>
                )}

                {activeTab === 'safety' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Be a Safety Hero! 🛡️</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                            <div className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(0,0,0,0.3)', textAlign: 'center' }}>
                                <div style={{ background: '#111', width: '80px', margin: '0 auto', padding: '15px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: trafficLight === 'red' ? '#ef4444' : '#222', boxShadow: trafficLight === 'red' ? '0 0 20px #ef4444' : 'none' }}></div>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: trafficLight === 'yellow' ? '#f59e0b' : '#222', boxShadow: trafficLight === 'yellow' ? '0 0 20px #f59e0b' : 'none' }}></div>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: trafficLight === 'green' ? '#22c55e' : '#222', boxShadow: trafficLight === 'green' ? '0 0 20px #22c55e' : 'none' }}></div>
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                    {trafficLight === 'red' && <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 'bold' }}>STOP! 👋 (Ruko)</p>}
                                    {trafficLight === 'yellow' && <p style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>WAIT! ⏳ (Intezar karo)</p>}
                                    {trafficLight === 'green' && <p style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold' }}>GO! 🏃 (Chalo)</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                                    <button onClick={() => { setTrafficLight('red'); speak('Red light says Stop!'); }} style={{ background: '#ef4444', border: 'none', borderRadius: '10px', padding: '10px' }}>Red</button>
                                    <button onClick={() => { setTrafficLight('yellow'); speak('Yellow light says Wait!'); }} style={{ background: '#f59e0b', border: 'none', borderRadius: '10px', padding: '10px' }}>Yellow</button>
                                    <button onClick={() => { setTrafficLight('green'); speak('Green light says Go!'); }} style={{ background: '#22c55e', border: 'none', borderRadius: '10px', padding: '10px' }}>Green</button>
                                </div>
                            </div>

                            <div className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
                                <div style={{ fontSize: '5rem' }}>🔌🔥✂️</div>
                                <h3 style={{ color: '#fff', marginTop: '20px' }}>Home Safety</h3>
                                <p style={{ color: 'rgba(255,255,255,0.6)' }}>Stay away from sharp objects, fire, and electric plugs!</p>
                                <button onClick={() => speak("Always stay away from sharp objects and electric wires. Be a safe child!")} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '15px', background: '#3b82f6', border: 'none', color: '#fff' }}>Listen to Tip 🎧</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'values' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Magic Words & Values 🤝</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            {[
                                { w: 'Please', e: '🙏', d: 'When asking for something.' },
                                { w: 'Thank You', e: '🎁', d: 'When someone helps you.' },
                                { w: 'Sorry', e: '😔', d: 'When you make a mistake.' },
                                { w: 'Sharing', e: '🍎', d: 'Sharing is Caring!' }
                            ].map(v => (
                                <div key={v.w} onClick={() => speak(`The magic word is ${v.w}. ${v.d}`)} className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{v.e}</div>
                                    <h3 style={{ color: '#f59e0b' }}>{v.w}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{v.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'world' && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#fff', marginBottom: '40px' }}>Explore the World 🌍</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                            {[
                                { n: 'Taj Mahal', l: 'India 🇮🇳', e: '🕌', s: 'The beautiful Taj Mahal in Agra, India!' },
                                { n: 'Eiffel Tower', l: 'France 🇫🇷', e: '🗼', s: 'The tall Eiffel Tower in Paris, France!' },
                                { n: 'Pyramids', l: 'Egypt 🇪🇬', e: '📐', s: 'The ancient Great Pyramids of Giza!' },
                                { n: 'Statue of Liberty', l: 'USA 🇺🇸', e: '🗽', s: 'The Statue of Liberty in New York!' }
                            ].map(item => (
                                <div key={item.n} onClick={() => speak(item.s)} className="card-vibe" style={{ padding: '30px', borderRadius: '30px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '6rem', marginBottom: '20px' }}>{item.e}</div>
                                    <h3 style={{ color: '#ec4899' }}>{item.n}</h3>
                                    <div style={{ color: 'rgba(255,255,255,0.6)' }}>{item.l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {confetti && (
                    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', pointerEvents: 'none', animation: 'bounce 1s infinite' }}>
                        🎉✨🧪
                    </div>
                )}
            </main>
        </div>
    );
};

export default JuniorDiscoveryHub;
