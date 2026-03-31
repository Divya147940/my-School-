import React, { useState } from 'react';
import './Campus3D.css';

const Campus3D = ({ isOpen, onClose }) => {
    const [view, setView] = useState('main'); // 'main', 'library', 'lab'

    if (!isOpen) return null;

    return (
        <div className="campus-3d-overlay">
            <div className="campus-3d-container">
                <div className="campus-3d-header">
                    <h2>Virtual 3D Campus Tour</h2>
                    <button className="close-btn" onClick={onClose}>Exit Tour</button>
                </div>
                
                <div className={`scene scene-${view}`}>
                    <div className="cube">
                        <div className="cube-face cube-face-front">
                            {view === 'main' ? (
                                <div className="hotspot" onClick={() => setView('library')}>Go to Library 📚</div>
                            ) : (
                                <div className="hotspot" onClick={() => setView('main')}>Back to Main Hall 🏠</div>
                            )}
                        </div>
                        <div className="cube-face cube-face-back"></div>
                        <div className="cube-face cube-face-right">
                            {view === 'main' ? (
                                <div className="hotspot" onClick={() => setView('lab')}>Go to Science Lab 🧪</div>
                            ) : (
                                <div className="hotspot" onClick={() => setView('main')}>Back to Main Hall 🏠</div>
                            )}
                        </div>
                        <div className="cube-face cube-face-left"></div>
                        <div className="cube-face cube-face-top"></div>
                        <div className="cube-face cube-face-bottom"></div>
                    </div>
                </div>

                <div className="campus-3d-controls">
                    <button onClick={() => setView('main')} className={view === 'main' ? 'active' : ''}>Main Hall</button>
                    <button onClick={() => setView('library')} className={view === 'library' ? 'active' : ''}>Library</button>
                    <button onClick={() => setView('lab')} className={view === 'lab' ? 'active' : ''}>Science Lab</button>
                </div>
                
                <div className="tour-hint">Use mouse to rotate view (Coming Soon) | Click hotspots to move</div>
            </div>
        </div>
    );
};

export default Campus3D;
