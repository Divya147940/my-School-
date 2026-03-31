import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const SiteManagement = () => {
    const { addToast } = useToast();
    const [view, setView] = useState('spotlight'); 
    const [isLoaded, setIsLoaded] = useState(false);
    const [gallery, setGallery] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [news, setNews] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [achievers, setAchievers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newItem, setNewItem] = useState({ type: 'image', url: '', title: '' });
    const [newJob, setNewJob] = useState({ position: '', department: '' });
    const [newNews, setNewNews] = useState({ title: '', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) });
    const [newAlumni, setNewAlumni] = useState({ name: '', batch: '', position: '', achievement: '', image: '' });
    const [newAchiever, setNewAchiever] = useState({ name: '', class: '', achievement: '', type: 'Academic', image: '', date: '' });
    const [newFaculty, setNewFaculty] = useState({ name: '', designation: '', qualification: '', description: '', image: '' });
    const [newMentor, setNewMentor] = useState({ name: '', roleEn: '', roleHi: '', edu: '', exp: '', image: '' });
    const [spotlight, setSpotlight] = useState({ name: '', title: '', description: '', photo: '', achievements: '' });

    useEffect(() => {
        try {
            setGallery(mockApi.getGallery() || []);
            setJobs(mockApi.getJobs() || []);
            setNews(mockApi.getNews() || []);
            setAlumni(Array.isArray(mockApi.getAlumni()) ? mockApi.getAlumni() : []);
            setFaculty(Array.isArray(mockApi.getFaculty()) ? mockApi.getFaculty() : []);
            setMentors(Array.isArray(mockApi.getMentors()) ? mockApi.getMentors() : []);
            setAchievers(mockApi.getAchievers() || []);
            setLoading(false);
            const curSpotlight = mockApi.getSpotlight();
            if (curSpotlight) {
                setSpotlight({
                    ...curSpotlight,
                    achievements: Array.isArray(curSpotlight.achievements) 
                        ? curSpotlight.achievements.join(', ') 
                        : (curSpotlight.achievements || '')
                });
            }
            setIsLoaded(true);
        } catch (err) {
            console.error("Error loading site management data:", err);
            setIsLoaded(true); // Still load to show UI
        }
    }, []);

    if (!isLoaded) return <div style={{ padding: '20px', color: '#fff' }}>🔄 Initializing Site Management...</div>;

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
    const handleAddAlumni = () => {
        if (!newAlumni.name || !newAlumni.batch) {
            addToast("Please fill Name and Category", "error");
            return;
        }
        mockApi.addAlumni(newAlumni);
        setAlumni(mockApi.getAlumni());
        setNewAlumni({ name: '', batch: '', position: '', achievement: '', image: '' });
        addToast("OUR SHINING STAR added successfully!", "success");
    };

    const handleAddAchiever = () => {
        if (!newAchiever.name || !newAchiever.achievement) {
            addToast("Please fill Name and Achievement", "error");
            return;
        }
        mockApi.addAchiever(newAchiever);
        setAchievers(mockApi.getAchievers());
        setNewAchiever({ name: '', class: '', achievement: '', type: 'Academic', image: '', date: '' });
        addToast("Achiever added to Hall of Fame!", "success");
    };

    const handleDeleteAlumni = (id) => {
        mockApi.deleteAlumni(id);
        setAlumni(mockApi.getAlumni());
        addToast("Shining Star removed.", "success");
    };

    const handleDeleteAchiever = (id) => {
        mockApi.deleteAchiever(id);
        setAchievers(mockApi.getAchievers());
        addToast("Achiever removed from Hall of Fame.", "success");
    };

    const handleAddFaculty = () => {
        if (!newFaculty.name || !newFaculty.designation) {
            addToast("Name and Designation are required!", "error");
            return;
        }
        mockApi.addFaculty(newFaculty);
        setFaculty(mockApi.getFaculty());
        setNewFaculty({ name: '', designation: '', qualification: '', description: '', image: '' });
        addToast("Faculty member added to full list!", "success");
    };

    const handleDeleteFaculty = (id) => {
        mockApi.deleteFaculty(id);
        setFaculty(mockApi.getFaculty());
        addToast("Faculty member removed.", "success");
    };

    const handleAddMentor = () => {
        if (!newMentor.name || (!newMentor.roleEn && !newMentor.roleHi)) {
            addToast("Name and Role are required for Mentor!", "error");
            return;
        }
        const mentorData = {
            ...newMentor,
            role: { 
                en: newMentor.roleEn || newMentor.roleHi, 
                hi: newMentor.roleHi || newMentor.roleEn 
            }
        };
        mockApi.addMentor(mentorData);
        setMentors(mockApi.getMentors());
        setNewMentor({ name: '', roleEn: '', roleHi: '', edu: '', exp: '', image: '' });
        addToast("Mentor added to Home Page showcase!", "success");
    };

    const handleDeleteMentor = (id) => {
        mockApi.deleteMentor(id);
        setMentors(mockApi.getMentors());
        addToast("Mentor removed from Home Page.", "success");
    };


    return (
        <div className="site-management">
            <div style={{ marginBottom: '10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
                System: Site Management Module Active | Mode: {view}
            </div>
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
                <button 
                    onClick={() => setView('spotlight')}
                    style={{ background: view === 'spotlight' ? '#8b5cf6' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🌟 Student Spotlight
                </button>
                <button 
                    onClick={() => setView('alumni')}
                    style={{ background: view === 'alumni' ? '#ec4899' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🌟 OUR SHINING STARS
                </button>
                <button 
                    onClick={() => setView('achievers')}
                    style={{ background: view === 'achievers' ? '#f59e0b' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🏆 Achievers Hall
                </button>
                <button 
                    onClick={() => setView('mentors')}
                    style={{ background: view === 'mentors' ? '#3b82f6' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🏠 Home Mentors
                </button>
                <button 
                    onClick={() => setView('faculty')}
                    style={{ background: view === 'faculty' ? '#10b981' : 'transparent', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    👨‍🏫 School Faculty
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

            {view === 'spotlight' && (
                <div className="spotlight-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px' }}>
                        <h4 style={{ marginBottom: '20px' }}>🌟 Manage Student Achievement (Front Page Spotlight)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Student Name</label>
                                <input 
                                    type="text" 
                                    value={spotlight.name} 
                                    onChange={e => setSpotlight({...spotlight, name: e.target.value})} 
                                    style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} 
                                />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Spotlight Title (e.g. Star of the Month)</label>
                                <input 
                                    type="text" 
                                    value={spotlight.title} 
                                    onChange={e => setSpotlight({...spotlight, title: e.target.value})} 
                                    style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} 
                                />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Student Photo (Upload or URL)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        value={spotlight.photo} 
                                        onChange={e => setSpotlight({...spotlight, photo: e.target.value})} 
                                        style={{ flexGrow: 1, padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} 
                                        placeholder="Paste image URL here..."
                                    />
                                    <div style={{ position: 'relative' }}>
                                        <button 
                                            style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                                        >
                                            📁 Upload File
                                        </button>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setSpotlight({...spotlight, photo: reader.result});
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    </div>
                                </div>
                                {spotlight.photo && spotlight.photo.startsWith('data:') && (
                                    <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '5px' }}>✓ Image uploaded directly (Local storage)</p>
                                )}
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Achievements (Separated by comma)</label>
                                <input 
                                    type="text" 
                                    value={spotlight.achievements} 
                                    onChange={e => setSpotlight({...spotlight, achievements: e.target.value})} 
                                    style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} 
                                    placeholder="Gold Medalist, 100% Attendance, Class Topper"
                                />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Student Story/Description (Write about the child)</label>
                                <textarea 
                                    rows="5" 
                                    value={spotlight.description} 
                                    onChange={e => setSpotlight({...spotlight, description: e.target.value})} 
                                    style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} 
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => {
                                mockApi.updateSpotlight({
                                    ...spotlight,
                                    achievements: spotlight.achievements.split(',').map(s => s.trim())
                                });
                                alert('Student Spotlight updated successfully! Refresh home page to see changes.');
                            }} 
                            style={{ marginTop: '25px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', border: 'none', color: '#fff', padding: '15px 40px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px rgba(139, 92, 246, 0.3)' }}
                        >
                            🚀 Update Spotlight & Go Live
                        </button>
                    </div>
                </div>
            )}

            {view === 'alumni' && (
                <div className="alumni-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                        <h4 style={{ marginBottom: '20px' }}>🌟 Add New "OUR SHINING STAR" (Home Page Card)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Name</label>
                                <input type="text" value={newAlumni.name} onChange={e => setNewAlumni({...newAlumni, name: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Student Name" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Category (e.g. Class 12 / 10)</label>
                                <input type="text" value={newAlumni.batch} onChange={e => setNewAlumni({...newAlumni, batch: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Class 10 / 2024" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Tag/Rank (e.g. 1st Rank / Sports Star)</label>
                                <input type="text" value={newAlumni.position} onChange={e => setNewAlumni({...newAlumni, position: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="1st Rank (Boards)" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>SMS / Message (Achievement)</label>
                                <input type="text" value={newAlumni.achievement} onChange={e => setNewAlumni({...newAlumni, achievement: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Brief achievement or quote" />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Alumni Photo (Direct Upload)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <button style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📁 Choose Image</button>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setNewAlumni({...newAlumni, image: reader.result});
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    </div>
                                    {newAlumni.image && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={newAlumni.image.startsWith('data:') ? newAlumni.image : `https://ui-avatars.com/api/?name=${newAlumni.name}`} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓ Image ready</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleAddAlumni} style={{ marginTop: '20px', background: '#ec4899', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Add to Wall of Pride</button>
                    </div>

                    <div className="alumni-list-admin">
                        <h4 style={{ marginBottom: '15px' }}>Current "OUR SHINING STARS"</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {alumni.map(person => (
                                <div key={person.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                                    <div style={{ width: '120px', height: '80px', borderRadius: '10px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', overflow: 'hidden', flexShrink: 0 }}>
                                        {person.image && (person.image.startsWith('http') || person.image.startsWith('data:')) ? 
                                            <img src={person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                            <span>{person.image || '🎓'}</span>
                                        }
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <h5 style={{ margin: '0 0 5px 0' }}>{person.name} <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'normal' }}>({person.batch})</span></h5>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{person.position}</p>
                                    </div>
                                    <button onClick={() => handleDeleteAlumni(person.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'achievers' && (
                <div className="alumni-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                        <h4 style={{ marginBottom: '20px' }}>🏆 Add New "NSGI ACHIEVER" (Hall of Fame)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Name</label>
                                <input type="text" value={newAchiever.name} onChange={e => setNewAchiever({...newAchiever, name: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Student Name" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Class (e.g. 10A)</label>
                                <input type="text" value={newAchiever.class} onChange={e => setNewAchiever({...newAchiever, class: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="10A / 12B" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Category</label>
                                <select value={newAchiever.type} onChange={e => setNewAchiever({...newAchiever, type: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }}>
                                    <option value="Academic">Academic</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Science">Science</option>
                                    <option value="Arts">Arts</option>
                                    <option value="Innovation">Innovation</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>SMS / Achievement Date</label>
                                <input type="text" value={newAchiever.date} onChange={e => setNewAchiever({...newAchiever, date: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="March 2026" />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>SMS / Achievement Detail</label>
                                <input type="text" value={newAchiever.achievement} onChange={e => setNewAchiever({...newAchiever, achievement: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="1st Prize in Inter-School Science Fair" />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Student Photo (Direct Upload)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <button style={{ padding: '10px 20px', background: '#f59e0b', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📁 Choose Image</button>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setNewAchiever({...newAchiever, image: reader.result});
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    </div>
                                    {newAchiever.image && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={newAchiever.image} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓ Image ready</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleAddAchiever} style={{ marginTop: '20px', background: '#f59e0b', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Add to Hall of Fame</button>
                    </div>

                    <div className="alumni-list-admin">
                        <h4 style={{ marginBottom: '15px' }}>Current Hall of Fame Achievers</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {achievers.map(person => (
                                <div key={person.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(245, 158, 11, 0.3)' }}>
                                        {person.image && (person.image.startsWith('http') || person.image.startsWith('data:')) ? 
                                            <img src={person.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                            <span>{person.image || '🏆'}</span>
                                        }
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <h5 style={{ margin: '0 0 5px 0' }}>{person.name}</h5>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}>{person.type} - Class {person.class}</p>
                                    </div>
                                    <button onClick={() => handleDeleteAchiever(person.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'mentors' && (
                <div className="faculty-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                        <h4 style={{ marginBottom: '20px' }}>🏠 Add New Home Page Mentor (Card)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Name</label>
                                <input type="text" value={newMentor.name} onChange={e => setNewMentor({...newMentor, name: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Dr. XYZ" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Education (e.g. M.Sc, B.Ed)</label>
                                <input type="text" value={newMentor.edu} onChange={e => setNewMentor({...newMentor, edu: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Qualifications" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Experience (e.g. 10 Years)</label>
                                <input type="text" value={newMentor.exp} onChange={e => setNewMentor({...newMentor, exp: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Years of Teaching" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Role (English)</label>
                                <input type="text" value={newMentor.roleEn} onChange={e => setNewMentor({...newMentor, roleEn: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Principal / HOD" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Role (Hindi)</label>
                                <input type="text" value={newMentor.roleHi} onChange={e => setNewMentor({...newMentor, roleHi: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="प्रधानाचार्य / विभागाध्यक्ष" />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Mentor Photo (Direct Upload)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <button style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📁 Choose Image</button>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setNewMentor({...newMentor, image: reader.result});
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    </div>
                                    {newMentor.image && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={newMentor.image} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓ Image ready</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleAddMentor} style={{ marginTop: '20px', background: '#3b82f6', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Add to Home Page Cards</button>
                    </div>

                    <div className="faculty-list-admin">
                        <h4 style={{ marginBottom: '15px' }}>Current Home Page Mentors</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {mentors.map(member => (
                                <div key={member.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(59, 130, 246, 0.3)' }}>
                                        {member.image ? 
                                            <img src={member.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                            <span>👨‍🏫</span>
                                        }
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <h5 style={{ margin: '0 0 5px 0' }}>{member.name}</h5>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#3b82f6', fontWeight: 'bold' }}>{member.role?.en || 'Mentor'}</p>
                                    </div>
                                    <button onClick={() => handleDeleteMentor(member.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {view === 'faculty' && (
                <div className="faculty-admin">
                    <div className="admin-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                        <h4 style={{ marginBottom: '20px' }}>👨‍🏫 Add New Faculty Member (Full List Page)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Name</label>
                                <input type="text" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Dr. XYZ" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Designation (e.g. Principal)</label>
                                <input type="text" value={newFaculty.designation} onChange={e => setNewFaculty({...newFaculty, designation: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Designation" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Qualification (e.g. Ph.D, M.Sc)</label>
                                <input type="text" value={newFaculty.qualification} onChange={e => setNewFaculty({...newFaculty, qualification: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Qualifications" />
                            </div>
                            <div className="input-group">
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Description</label>
                                <input type="text" value={newFaculty.description} onChange={e => setNewFaculty({...newFaculty, description: e.target.value})} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px' }} placeholder="Short bio..." />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Faculty Photo (Direct Upload)</label>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <button style={{ padding: '10px 20px', background: '#10b981', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>📁 Choose Image</button>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => setNewFaculty({...newFaculty, image: reader.result});
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                        />
                                    </div>
                                    {newFaculty.image && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={newFaculty.image} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✓ Image ready</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleAddFaculty} style={{ marginTop: '20px', background: '#10b981', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Add to Faculty Page</button>
                    </div>

                    <div className="faculty-list-admin">
                        <h4 style={{ marginBottom: '15px' }}>Current School Faculty</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                            {faculty.map(member => (
                                <div key={member.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', position: 'relative', alignItems: 'center' }}>
                                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(16, 185, 129, 0.3)' }}>
                                        {member.image ? 
                                            <img src={member.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                            <span>👨‍🏫</span>
                                        }
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <h5 style={{ margin: '0 0 5px 0' }}>{member.name}</h5>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold' }}>{member.designation}</p>
                                    </div>
                                    <button onClick={() => handleDeleteFaculty(member.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(244,63,94,0.1)', border: 'none', color: '#f43f5e', width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.8rem' }}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteManagement;
