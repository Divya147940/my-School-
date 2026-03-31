import React, { useState } from 'react';
import { mockApi } from '../utils/mockApi';
import './ELearningHub.css';

const ELearningHub = ({ userType = 'student' }) => {
    const [resources, setResources] = useState(mockApi.getInitialData().elearning);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [showUpload, setShowUpload] = useState(false);
    const [newResource, setNewResource] = useState({ title: '', subject: 'Mathematics', type: 'video', url: '' });

    const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Biology', 'Chemistry'];

    const handleUpload = (e) => {
        e.preventDefault();
        const added = mockApi.addELearning(newResource);
        setResources([added, ...resources]);
        setShowUpload(false);
        setNewResource({ title: '', subject: 'Mathematics', type: 'video', url: '' });
    };

    const filteredResources = resources.filter(res => 
        (filter === 'All' || res.subject === filter) &&
        (res.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="elearning-container">
            <header className="elearning-header">
                <h2>📚 E-Learning Hub</h2>
                <div className="header-actions">
                    <input 
                        type="text" 
                        placeholder="Search resources..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {userType === 'faculty' && (
                        <button className="upload-btn" onClick={() => setShowUpload(true)}>+ Upload Resource</button>
                    )}
                </div>
            </header>

            <div className="subject-tabs">
                {subjects.map(sub => (
                    <button 
                        key={sub} 
                        className={filter === sub ? 'active' : ''} 
                        onClick={() => setFilter(sub)}
                    >
                        {sub}
                    </button>
                ))}
            </div>

            {showUpload && (
                <div className="upload-modal">
                    <form className="upload-form" onSubmit={handleUpload}>
                        <h3>Upload New Resource</h3>
                        <input 
                            type="text" 
                            placeholder="Resource Title" 
                            required 
                            value={newResource.title}
                            onChange={e => setNewResource({...newResource, title: e.target.value})}
                        />
                        <select 
                            value={newResource.subject}
                            onChange={e => setNewResource({...newResource, subject: e.target.value})}
                        >
                            {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select 
                            value={newResource.type}
                            onChange={e => setNewResource({...newResource, type: e.target.value})}
                        >
                            <option value="video">Video Lecture</option>
                            <option value="pdf">PDF Notes</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="URL (Link)" 
                            required 
                            value={newResource.url}
                            onChange={e => setNewResource({...newResource, url: e.target.value})}
                        />
                        <div className="modal-btns">
                            <button type="submit">Upload</button>
                            <button type="button" onClick={() => setShowUpload(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="resources-grid">
                {filteredResources.map(res => (
                    <div className="resource-card" key={res.id}>
                        <div className="resource-thumb">
                            {res.type === 'video' ? '🎬' : '📄'}
                        </div>
                        <div className="resource-info">
                            <span className="res-subject">{res.subject}</span>
                            <h3>{res.title}</h3>
                            <p>By {res.author || 'Faculty'}</p>
                            <div className="res-footer">
                                <span>{res.date}</span>
                                <a href={res.url} target="_blank" rel="noreferrer">Open</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ELearningHub;
