import React, { useState } from 'react';
import './TeacherResourceCenter.css';

const TeacherResourceCenter = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    { id: 1, title: 'Mathematics Lesson Plan - Algebra', desc: 'Detailed plan for Grade 10 Algebra chapters.', category: 'Lesson Plans', type: 'PDF', icon: '📐' },
    { id: 2, title: 'Science Lab Safety Video', desc: 'Safety protocols for Chemistry and Biology labs.', category: 'Videos', type: 'MP4', icon: '🧪' },
    { id: 3, title: 'English Literature Reference', desc: 'Critical analysis of Shakespearean plays.', category: 'Reference Guides', type: 'DOCX', icon: '📖' },
    { id: 4, title: 'Geography Map Skills', desc: 'Interactive map reading exercise for Middle School.', category: 'Lesson Plans', type: 'PDF', icon: '🌍' },
    { id: 5, title: 'Primary School Phonics Guide', desc: 'Teaching resources for early literacy.', category: 'Reference Guides', type: 'PDF', icon: '🔤' },
    { id: 6, title: 'History of Modern India', desc: 'Video documentary snippet for Class 12 History.', category: 'Videos', type: 'MP4', icon: '🏺' },
  ];

  const categories = ['All', 'Lesson Plans', 'Videos', 'Reference Guides', 'Assignments'];

  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="resource-center-container">
      <div className="resource-header">
        <h2>Teacher Resource Center</h2>
        <input 
          type="text" 
          placeholder="Search resources..." 
          className="resource-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="resource-categories">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="resource-grid">
        {filteredResources.length > 0 ? (
          filteredResources.map(res => (
            <div key={res.id} className="resource-card">
              <div className="resource-icon">{res.icon}</div>
              <div className="resource-info">
                <h3>{res.title}</h3>
                <p>{res.desc}</p>
              </div>
              <div className="resource-meta">
                <span className="resource-type">{res.category} • {res.type}</span>
                <a href="#" className="download-btn" onClick={(e) => e.preventDefault()}>
                  <span>⬇️</span> Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No resources found matching your search.</div>
        )}
      </div>
    </div>
  );
};

export default TeacherResourceCenter;
