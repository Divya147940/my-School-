import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        qualification: '',
        experience: '',
        description: '',
        image: '',
        avatarBg: 'linear-gradient(135deg, #1a1a6e, #3a3aae)'
    });

    useEffect(() => {
        setFaculty(mockApi.getFaculty());
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            mockApi.updateFaculty(editingId, formData);
        } else {
            mockApi.addFaculty(formData);
        }
        setFaculty(mockApi.getFaculty());
        resetForm();
    };

    const handleEdit = (member) => {
        setFormData({
            name: member.name,
            designation: member.designation,
            qualification: member.qualification,
            experience: member.experience,
            description: member.description,
            image: member.image || '',
            avatarBg: member.avatarBg || 'linear-gradient(135deg, #1a1a6e, #3a3aae)'
        });
        setEditingId(member.id);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            mockApi.deleteFaculty(id);
            setFaculty(mockApi.getFaculty());
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            designation: '',
            qualification: '',
            experience: '',
            description: '',
            image: '',
            avatarBg: 'linear-gradient(135deg, #1a1a6e, #3a3aae)'
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="faculty-management" style={{ color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0 }}>School Faculty Directory</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {showForm ? 'Cancel' : '+ Add New Faculty'}
                </button>
            </div>

            {showForm && (
                <div className="admin-form-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', borderRadius: '20px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <h4 style={{ marginTop: 0 }}>{editingId ? 'Edit Faculty Member' : 'Add Faculty Member'}</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Designation</label>
                            <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Qualifications</label>
                            <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Total Experience</label>
                            <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 5 Years" style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Short Description / Bio</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff', height: '80px', resize: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Image URL (Optional)</label>
                            <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Profile Theme Color</label>
                            <select name="avatarBg" value={formData.avatarBg} onChange={handleInputChange} style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', color: '#fff' }}>
                                <option value="linear-gradient(135deg, #1a1a6e, #3a3aae)">Classic Blue</option>
                                <option value="linear-gradient(135deg, #c0392b, #e74c3c)">Vibrant Red</option>
                                <option value="linear-gradient(135deg, #27ae60, #2ecc71)">Forest Green</option>
                                <option value="linear-gradient(135deg, #8e44ad, #9b59b6)">Royal Purple</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <button type="submit" style={{ width: '100%', padding: '15px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {editingId ? 'Update Faculty Details' : 'Save Faculty Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="faculty-list-admin" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {faculty.map(member => (
                    <div key={member.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: member.avatarBg || 'linear-gradient(135deg, #1a1a6e, #3a3aae)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {member.image ? <img src={member.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (member.name[0])}
                            </div>
                            <div>
                                <h4 style={{ margin: 0 }}>{member.name}</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#c0392b', fontWeight: 'bold' }}>{member.designation}</p>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '15px' }}>
                            <div>🎓 {member.qualification}</div>
                            <div>📅 {member.experience} Experience</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleEdit(member)} style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                            <button onClick={() => handleDelete(member.id)} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FacultyManagement;
