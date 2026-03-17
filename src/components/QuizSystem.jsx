import React, { useState } from 'react';
import { mockApi } from '../utils/mockApi';
import './QuizSystem.css';

const QuizSystem = ({ userType = 'student' }) => {
    const [quizzes, setQuizzes] = useState(mockApi.getInitialData().quizzes);
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showCreator, setShowCreator] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Quiz Creator State (Faculty)
    const [newQuiz, setNewQuiz] = useState({ title: '', subject: 'Mathematics', questions: [], timeLimit: 10 });
    const [currentQuestion, setCurrentQuestion] = useState({ q: '', options: ['', '', '', ''], correct: 0 });

    const handleCreateQuiz = () => {
        if (!newQuiz.title || newQuiz.questions.length === 0) {
            alert("Please add a title and at least one question.");
            return;
        }
        const added = mockApi.addQuiz(newQuiz);
        setQuizzes([...quizzes, added]);
        setShowCreator(false);
        setNewQuiz({ title: '', subject: 'Mathematics', questions: [], timeLimit: 10 });
    };

    const addQuestionToNewQuiz = () => {
        setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, currentQuestion] });
        setCurrentQuestion({ q: '', options: ['', '', '', ''], correct: 0 });
    };

    const startQuiz = (quiz) => {
        setActiveQuiz(quiz);
        setCurrentStep(0);
        setScore(0);
        setIsFinished(false);
        setTimeLeft((quiz.timeLimit || 10) * 60);
    };

    React.useEffect(() => {
        let timer;
        if (activeQuiz && !isFinished && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && activeQuiz && !isFinished) {
            setIsFinished(true);
        }
        return () => clearInterval(timer);
    }, [activeQuiz, isFinished, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswer = (index) => {
        if (index === activeQuiz.questions[currentStep].correct) {
            setScore(score + 1);
        }

        if (currentStep + 1 < activeQuiz.questions.length) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (showCreator && userType === 'faculty') {
        return (
            <div className="quiz-creator">
                <header className="quiz-header">
                    <h2>📝 Create New Quiz</h2>
                    <button onClick={() => setShowCreator(false)}>Cancel</button>
                </header>
                <div className="creator-card">
                    <input 
                        type="text" 
                        placeholder="Quiz Title (e.g., Geometry Test)" 
                        value={newQuiz.title}
                        onChange={e => setNewQuiz({...newQuiz, title: e.target.value})}
                    />
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.8rem' }}>Time Limit (Minutes)</label>
                        <input 
                            type="number" 
                            value={newQuiz.timeLimit}
                            onChange={e => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value) || 0})}
                            style={{ width: '100px' }}
                        />
                    </div>
                    <div className="question-builder">
                        <h4>Add Question #{newQuiz.questions.length + 1}</h4>
                        <textarea 
                            placeholder="Enter question here..." 
                            value={currentQuestion.q}
                            onChange={e => setCurrentQuestion({...currentQuestion, q: e.target.value})}
                        />
                        <div className="options-grid">
                            {currentQuestion.options.map((opt, idx) => (
                                <div key={idx} className="option-input">
                                    <input 
                                        type="text" 
                                        placeholder={`Option ${idx + 1}`} 
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...currentQuestion.options];
                                            newOpts[idx] = e.target.value;
                                            setCurrentQuestion({...currentQuestion, options: newOpts});
                                        }}
                                    />
                                    <input 
                                        type="radio" 
                                        name="correct" 
                                        checked={currentQuestion.correct === idx}
                                        onChange={() => setCurrentQuestion({...currentQuestion, correct: idx})}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="add-q-btn" onClick={addQuestionToNewQuiz}>Add to Quiz</button>
                    </div>
                    <div className="quiz-preview-list">
                        <p>{newQuiz.questions.length} Questions Added</p>
                        <button className="save-quiz-btn" onClick={handleCreateQuiz}>Finalize & Post Quiz</button>
                    </div>
                </div>
            </div>
        );
    }

    if (activeQuiz) {
        return (
            <div className="quiz-player">
                {!isFinished ? (
                    <div className="player-card">
                        <div className="player-header">
                            <h3>{activeQuiz.title}</h3>
                            <div className="quiz-timer" style={{ background: timeLeft < 60 ? '#f43f5e' : '#3b82f6', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' }}>
                                ⏱️ {formatTime(timeLeft)}
                            </div>
                            <span>Question {currentStep + 1} of {activeQuiz.questions.length}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${((currentStep + 1) / activeQuiz.questions.length) * 100}%` }}></div>
                        </div>
                        <h2 className="quiz-question">{activeQuiz.questions[currentStep].q}</h2>
                        <div className="quiz-options">
                            {activeQuiz.questions[currentStep].options.map((opt, idx) => (
                                <button key={idx} onClick={() => handleAnswer(idx)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="result-card">
                        <div className="result-icon">{score >= activeQuiz.questions.length / 2 ? '🎉' : '❌'}</div>
                        <h2 style={{ color: score >= activeQuiz.questions.length / 2 ? '#10b981' : '#f43f5e' }}>
                            {score >= activeQuiz.questions.length / 2 ? 'PASSED' : 'FAILED'}
                        </h2>
                        <p>{score === activeQuiz.questions.length ? 'Perfect Score!' : 'Quiz Completed!'}</p>
                        <div className="score-display">
                            <span>Your Score</span>
                            <p>{score} / {activeQuiz.questions.length}</p>
                        </div>
                        <button onClick={() => setActiveQuiz(null)}>Back to Quizzes</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="quiz-list-container">
            <header className="quiz-header">
                <h2>🏆 Online Quiz Center</h2>
                {userType === 'faculty' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="view-results-btn" onClick={() => setShowResults(!showResults)} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {showResults ? 'View Quizzes' : '📊 Student Results'}
                        </button>
                        <button className="create-btn" onClick={() => setShowCreator(true)}>+ New Quiz</button>
                    </div>
                )}
            </header>

            {showResults ? (
                <div className="faculty-results-view">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Quiz Title</th>
                                <th>Physics/Sub</th>
                                <th>Score</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Aman Gupta</td><td>Weekly Math Test</td><td>Mathematics</td><td>8/10</td><td><span className="badge badge-paid">PASS</span></td></tr>
                            <tr><td>Priya Verma</td><td>Geometry Basics</td><td>Mathematics</td><td>4/10</td><td><span className="badge badge-pending">FAIL</span></td></tr>
                            <tr><td>Rahul Singh</td><td>Weekly Math Test</td><td>Mathematics</td><td>9/10</td><td><span className="badge badge-paid">PASS</span></td></tr>
                            <tr><td>Sneha Das</td><td>Weekly Math Test</td><td>Mathematics</td><td>3/10</td><td><span className="badge badge-pending">FAIL</span></td></tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="quiz-grid">
                {quizzes.map(q => (
                    <div className="quiz-card" key={q.id}>
                        <div className="quiz-tag">{q.subject}</div>
                        <h3>{q.title}</h3>
                        <p>{q.questions.length} Multiple Choice Questions</p>
                        <div className="quiz-footer">
                            <span>By {q.creator || 'Faculty'}</span>
                            <button onClick={() => startQuiz(q)}>Start Quiz</button>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

export default QuizSystem;
