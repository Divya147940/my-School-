import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import './AnimalSoundSafari.css';

const AnimalSoundSafari = () => {
    const [animals, setAnimals] = useState([]);
    const [activeAnimal, setActiveAnimal] = useState(null);
    const [gameMode, setGameMode] = useState('explore'); // explore, guess
    const [targetAnimal, setTargetAnimal] = useState(null);
    const [message, setMessage] = useState('Tap an animal to hear its sound! 🐾');

    useEffect(() => {
        const data = mockApi.loadData()?.toddlerActivities?.animals || [];
        setAnimals(data);
    }, []);

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('hi-IN')) || voices.find(v => v.lang.includes('en-IN'));
        if (indianVoice) utterance.voice = indianVoice;
        utterance.pitch = 1.4;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleAnimalClick = (animal) => {
        if (gameMode === 'explore') {
            setActiveAnimal(animal.id);
            setMessage(`${animal.name} says ${animal.sound}!`);
            speak(`${animal.name} says ${animal.sound}`);
            setTimeout(() => setActiveAnimal(null), 1000);
        } else if (gameMode === 'guess') {
            if (animal.id === targetAnimal.id) {
                setMessage(`Yay! That's the ${animal.name}! 🌟`);
                speak(`Yay! Correct! That is the ${animal.name}`);
                setTimeout(startNewGuess, 2000);
            } else {
                setMessage(`Oops! Try again! 🧐`);
                speak(`Oops! Try again!`);
            }
        }
    };

    const startNewGuess = () => {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        setTargetAnimal(randomAnimal);
        setGameMode('guess');
        const question = `Can you find the animal that says "${randomAnimal.sound}"?`;
        setMessage(question);
        speak(question);
    };

    return (
        <div className="animal-sound-safari">
            <div className="safari-header">
                <h2>Animal Sound Safari 🦁🐘🦒</h2>
                <div className="mode-toggle">
                    <button 
                        className={gameMode === 'explore' ? 'active' : ''} 
                        onClick={() => { setGameMode('explore'); setMessage('Explore the animals! 🐾'); }}
                    >
                        🔍 Explore
                    </button>
                    <button 
                        className={gameMode === 'guess' ? 'active' : ''} 
                        onClick={startNewGuess}
                    >
                        ❓ Guess Who?
                    </button>
                </div>
            </div>

            <div className="safari-message glass-panel">
                {message}
            </div>

            <div className="animal-grid">
                {animals.map(animal => (
                    <div 
                        key={animal.id} 
                        className={`animal-card ${activeAnimal === animal.id ? 'pulse' : ''}`}
                        style={{ backgroundColor: `${animal.color}20`, borderColor: animal.color }}
                        onClick={() => handleAnimalClick(animal)}
                    >
                        <span className="animal-emoji">{animal.emoji}</span>
                        <span className="animal-name" style={{ color: animal.color }}>{animal.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimalSoundSafari;
