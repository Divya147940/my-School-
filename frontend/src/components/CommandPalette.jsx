import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const CommandPalette = ({ isOpen, onClose, navItems, portalName }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      }
      if (e.key === 'Escape') onClose(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = navItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="palette-overlay" onClick={() => onClose(false)}>
      <div className="palette-box" onClick={e => e.stopPropagation()}>
        <div className="palette-header">
          <span className="palette-search-icon">🔍</span>
          <input 
            autoFocus 
            placeholder={`Search ${portalName} sections...`} 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <kbd>ESC</kbd>
        </div>
        <div className="palette-results">
          {filtered.map(item => (
            <div 
              key={item.name} 
              className="palette-item"
              onClick={() => {
                item.action();
                onClose(false);
                setQuery('');
              }}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-name">{item.name}</span>
            </div>
          ))}
          {filtered.length === 0 && <div className="palette-no-results">No sections found for "{query}"</div>}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
