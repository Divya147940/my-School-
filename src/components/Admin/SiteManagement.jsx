import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const SiteManagement = () => {
    const [view, setView] = useState('gallery'); // 'gallery', 'jobs', 'news'
    const [gallery, setGallery] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [news, setNews] = useState([]);

    const [newItem, setNewItem] = useState({ type: 'image', url: '', title: '' });
    const [newJob, setNewJob] = useState({ position: '', department: '' });
    const [newNews, setNewNews] = useState({ title: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });

    useEffect(() => {
        setGallery(mockApi.getGallery());
        setJobs(mockApi.getJobs());
        setNews(mockApi.getNews());
    }, []);

    const handleAddGallery = () => {
        if (!newItem.url || !newItem.title) return;
        mockApi.addGallery(newItem);
        setGallery(mockApi.getGallery());
        setNewItem({ type: 'image', url: '', title: '' });
    };

    const handleRemoveGallery = (id) => {
        mockApi.removeGallery(id);
        setGallery(mockApi.getGallery());
    };

    const handleAddJob = () => {
        if (!newJob.position) return;
        mockApi.addJob(newJob);
        setJobs(mockApi.getJobs());
        setNewJob({ position: '', department: '' });
    };

    const handleUpdateJob = (id, status) => {
        mockApi.updateJobStatus(id, status);
        setJobs(mockApi.getJobs());
    };

    const handleAddNews = () => {
        if (!newNews.title) return;
        mockApi.addNews(newNews);
        setNews(mockApi.getNews());
        setNewNews({ ...newNews, title: '' });
    };

    return (
        <div className="site-management">
            <div className="management-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                <button 
                    onClick={() => setView('gallery')}
                    style={{ background: view === 'gallery' ? '#3b82f6' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🖼️ Gallery
                </button>
                <button 
                    onClick={() => setView('jobs')}
                    style={{ background: view === 'jobs' ? '#10b981' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    👔 Hiring
                </button>
                <button 
                    onClick={() => setView('news')}
                    style={{ background: view === 'news' ? '#f59e0b' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    📰 News Updates
                </button>
            </div>

            {view === 'gallery' && (
                <div className="gallery-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                        <h4>Add Media (Photo/Video)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', marginTop: '10px' }}>
                            <select value={newItem.type} onChange={e => setNewItem({...newItem, type: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>
                                <option value="image">Photo</option>
                                <option value="video">Video URL</option>
                            </select>
                            <input type="text" placeholder="URL (HTTPS)" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }} />
                            <input type="text" placeholder="Title/Caption" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }} />
                            <button onClick={handleAddGallery} style={{ background: '#3b82f6', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '5px' }}>Upload</button>
                        </div>
                    </div>
                    <div className="media-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                        {gallery.map(item => (
                            <div key={item.id} style={{ background: '#1e293b', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                {item.type === 'image' ? (
                                    <img src={item.url} alt={item.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>📹 Video</div>
                                )}
                                <div style={{ padding: '10px', fontSize: '0.8rem' }}>
                                    <p style={{ margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                    <button onClick={() => handleRemoveGallery(item.id)} style={{ width: '100%', background: '#f43f5e', border: 'none', color: '#fff', padding: '5px', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'jobs' && (
                <div className="jobs-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                        <h4>Post Teacher Hiring</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', marginTop: '10px' }}>
                            <input type="text" placeholder="Position (e.g. Physics Teacher)" value={newJob.position} onChange={e => setNewJob({...newJob, position: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }} />
                            <input type="text" placeholder="Department" value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }} />
                            <button onClick={handleAddJob} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '5px' }}>Post Job</button>
                        </div>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Position</th>
                                <th>Department</th>
                                <th>Date Posted</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.position}</td>
                                    <td>{job.department}</td>
                                    <td>{job.date}</td>
                                    <td><span className={`badge ${job.status === 'Active' ? 'badge-paid' : 'badge-pending'}`}>{job.status}</span></td>
                                    <td>
                                        <button 
                                            onClick={() => handleUpdateJob(job.id, job.status === 'Active' ? 'Filled' : 'Active')}
                                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
                                        >
                                            {job.status === 'Active' ? 'Mark Filled' : 'Reopen'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {view === 'news' && (
                <div className="news-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '20px' }}>
                        <h4>Post News/Event Update</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginTop: '10px' }}>
                            <input type="text" placeholder="News Headline" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} style={{ padding: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }} />
                            <button onClick={handleAddNews} style={{ background: '#f59e0b', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '5px' }}>Post News</button>
                        </div>
                    </div>
                    <div className="news-list-admin">
                        {news.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '10px' }}>
                                <div>
                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{item.date}</span>
                                    <h5 style={{ margin: '5px 0 0 0' }}>{item.title}</h5>
                                </div>
                                <span className="badge badge-paid">Live</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteManagement;
