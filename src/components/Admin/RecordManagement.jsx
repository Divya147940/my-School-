import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';
import { useTheme } from '../../context/ThemeContext';
import SecurityPinModal from '../Common/SecurityPinModal';

const RecordManagement = () => {
    const { addToast } = useToast();
    const { theme } = useTheme();
    const [counts, setCounts] = useState({ students: 0, faculty: 0 });
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        class: '',
        rollNo: '',
        parentName: '',
        contact: ''
    });
    const [pinModal, setPinModal] = useState({ isOpen: false, onVerified: null, actionName: '' });

    const loadData = () => {
        const db = mockApi.getDB();
        setCounts({
            students: (db.studentRegistry || []).length,
            faculty: (db.facultyRegistry || []).length
        });
        setStudents(db.studentRegistry || []);
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.class) {
            addToast("Name and Class are required!", "error");
            return;
        }
        
        try {
            mockApi.addStudent(newStudent);
            addToast("Student added successfully!", "success");
            setShowAddForm(false);
            setNewStudent({ name: '', class: '', rollNo: '', parentName: '', contact: '' });
            loadData();
        } catch (err) {
            addToast("Failed to add student", "error");
        }
    };

    const handleDeleteClick = (studentId, studentName) => {
        setPinModal({
            isOpen: true,
            actionName: `Delete Student: ${studentName}`,
            onVerified: () => {
                try {
                    mockApi.deleteStudent(studentId);
                    addToast(`Student ${studentName} deleted successfully.`, "success");
                    loadData();
                } catch (err) {
                    addToast("Failed to delete student", "error");
                }
            }
        });
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="record-management" style={{ color: 'var(--text-primary)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '25px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ margin: 0 }}>Student Directory</h3>
                            <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Manage {counts.students} active student profiles.</p>
                        </div>
                        <button 
                            onClick={() => setShowAddForm(true)}
                            style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            + Add Student
                        </button>
                    </div>
                </div>

                <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '25px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ margin: 0 }}>Staff Directory</h3>
                    <p style={{ opacity: 0.7, margin: '5px 0 0 0' }}>Manage {counts.faculty} active faculty profiles.</p>
                </div>
            </div>

            {showAddForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(10px)' }}>
                    <div className="glass-panel" style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '32px', border: '1px solid var(--glass-border)', width: '500px', maxWidth: '90%' }}>
                        <h2 style={{ marginBottom: '20px' }}>Register New Student 🎓</h2>
                        <form onSubmit={handleAddStudent}>
                           <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={newStudent.name}
                                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'inherit' }}
                                        placeholder="e.g. Aryan Singh"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Class</label>
                                        <input 
                                            type="text" 
                                            value={newStudent.class}
                                            onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'inherit' }}
                                            placeholder="e.g. 10A"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Roll No</label>
                                        <input 
                                            type="number" 
                                            value={newStudent.rollNo}
                                            onChange={(e) => setNewStudent({...newStudent, rollNo: e.target.value})}
                                            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'inherit' }}
                                            placeholder="e.g. 25"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Parent/Guardian Name</label>
                                    <input 
                                        type="text" 
                                        value={newStudent.parentName}
                                        onChange={(e) => setNewStudent({...newStudent, parentName: e.target.value})}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'inherit' }}
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Contact Number</label>
                                    <input 
                                        type="text" 
                                        value={newStudent.contact}
                                        onChange={(e) => setNewStudent({...newStudent, contact: e.target.value})}
                                        style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'inherit' }}
                                        placeholder="Mobile Number"
                                    />
                                </div>
                           </div>
                           <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'inherit', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '15px', borderRadius: '12px', background: 'var(--accent-blue)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Complete Registration</button>
                           </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ background: 'var(--glass-bg)', padding: '30px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Registered Students List</h3>
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px 20px', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'inherit', width: '300px' }}
                    />
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '15px' }}>Student ID</th>
                                <th style={{ padding: '15px' }}>Name</th>
                                <th style={{ padding: '15px' }}>Class</th>
                                <th style={{ padding: '15px' }}>Parent</th>
                                <th style={{ padding: '15px' }}>Contact</th>
                                <th style={{ padding: '15px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((s) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td style={{ padding: '15px', fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>{s.id}</td>
                                    <td style={{ padding: '15px' }}>{s.name}</td>
                                    <td style={{ padding: '15px' }}>{s.class}</td>
                                    <td style={{ padding: '15px', opacity: 0.8 }}>{s.parentName}</td>
                                    <td style={{ padding: '15px', opacity: 0.8 }}>{s.contact}</td>
                                    <td style={{ padding: '15px' }}>
                                        <button 
                                            onClick={() => handleDeleteClick(s.id, s.name)}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>No students found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <SecurityPinModal 
                isOpen={pinModal.isOpen}
                onClose={() => setPinModal({ ...pinModal, isOpen: false })}
                onVerified={pinModal.onVerified}
                actionName={pinModal.actionName}
            />
        </div>
    );
};

export default RecordManagement;
