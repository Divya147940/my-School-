import React, { useRef, useState, useEffect } from 'react';
import './HandwritingCanvas.css';

const HandwritingCanvas = ({ onSave, onCancel, language = 'en' }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    const [pages, setPages] = useState(['']); // Array of data URLs
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * 2;
            canvas.height = rect.height * 2;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            const context = canvas.getContext('2d');
            context.scale(2, 2);
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            contextRef.current = context;
            
            // Save initial state for undo
            if (history.length === 0) saveState();
        };

        // Small timeout to wait for modal animation/layout
        const timer = setTimeout(resizeCanvas, 100);
        window.addEventListener('resize', resizeCanvas);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = lineWidth;
        }
    }, [color, lineWidth]);

    const saveState = () => {
        const canvas = canvasRef.current;
        setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
    };

    const startDrawing = (e) => {
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        setRedoStack([]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(e);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            contextRef.current.closePath();
            setIsDrawing(false);
            saveState();
        }
    };

    const getCoordinates = (e) => {
        if (e.touches && e.touches[0]) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    };

    const undo = () => {
        if (history.length <= 1) return;
        
        const newHistory = [...history];
        const lastAction = newHistory.pop();
        setRedoStack(prev => [lastAction, ...prev]);
        setHistory(newHistory);

        const canvas = canvasRef.current;
        const context = contextRef.current;
        const img = new Image();
        img.src = newHistory[newHistory.length - 1];
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
        };
    };

    const handleConfirm = () => {
        const finalPages = saveCurrentPage();
        onSave(finalPages); // Send array of pages
    };

    const saveCurrentPage = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL();
        const newPages = [...pages];
        newPages[currentPageIndex] = dataURL;
        setPages(newPages);
        return newPages;
    };

    const nextPage = () => {
        saveCurrentPage();
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        } else {
            setPages([...pages, '']);
            setCurrentPageIndex(currentPageIndex + 1);
        }
        setHistory([]);
        setRedoStack([]);
    };

    const prevPage = () => {
        saveCurrentPage();
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
            setHistory([]);
            setRedoStack([]);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const dataURL = pages[currentPageIndex];
        if (dataURL) {
            const img = new Image();
            img.src = dataURL;
            img.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2); // Divide by 2 because of scale(2,2)
            };
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [currentPageIndex]);


    return (
        <div className="handwriting-canvas-overlay">
            <div className="handwriting-canvas-container">
                <div className="canvas-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="page-info">
                        <span style={{ fontWeight: '800', color: '#1e293b' }}>Page {currentPageIndex + 1} of {pages.length}</span>
                    </div>
                    <div className="page-navigation" style={{ display: 'flex', gap: '10px' }}>
                        <button className="tool-btn" onClick={prevPage} disabled={currentPageIndex === 0}>
                            ← Previous Page
                        </button>
                        <button className="tool-btn active" onClick={nextPage}>
                            {currentPageIndex === pages.length - 1 ? '+ Add Page' : 'Next Page →'}
                        </button>
                    </div>
                </div>

                <div className="canvas-toolbar">
                    <div className="tool-group">
                        <button className="tool-btn undo-btn" onClick={undo} title="Undo">↩️</button>
                        <button className="tool-btn clear-btn" onClick={clearCanvas} title="Clear All">🗑️</button>
                    </div>

                    <div className="tool-group">
                        {['#000000', '#0000ff', '#ff0000'].map(c => (
                            <div 
                                key={c}
                                className={`color-dot ${color === c ? 'active' : ''}`}
                                style={{ backgroundColor: c }}
                                onClick={() => setColor(c)}
                            />
                        ))}
                        <div 
                            className={`color-dot ${color === '#ffffff' ? 'active' : ''}`}
                            style={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                            onClick={() => setColor('#ffffff')}
                            title="Eraser"
                        >🧼</div>
                    </div>

                    <div className="tool-group">
                        <select value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="tool-btn">
                            <option value="2">Thin</option>
                            <option value="4">Medium</option>
                            <option value="8">Thick</option>
                        </select>
                    </div>
                </div>

                <div 
                    className="canvas-wrapper"
                    style={{ flex: 1 }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                >
                    <canvas ref={canvasRef} className="handwriting-canvas" />
                </div>

                <div className="canvas-actions">
                    <button className="tool-btn cancel-btn" onClick={onCancel} style={{ padding: '12px 25px' }}>
                        {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button className="tool-btn active" onClick={handleConfirm} style={{ padding: '12px 25px', background: '#3b82f6' }}>
                        {language === 'hi' ? `सबमिट करें (${pages.length} पन्ने)` : `Submit Work (${pages.length} Pages)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HandwritingCanvas;
