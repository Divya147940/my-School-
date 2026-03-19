import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';

const RecordManagement = () => {
    const [counts, setCounts] = useState({ students: 0, faculty: 0 });

    useEffect(() => {
        const db = mockApi.getDB();
        setCounts({
            students: (db.studentRegistry || []).length,
            faculty: (db.facultyRegistry || []).length
        });
    }, []);

    return (
        <div className="record-management">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h3>Student Directory</h3>
                    <p style={{ opacity: 0.7 }}>Manage {counts.students} active student profiles.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>Manage List</button>
                    </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <h3>Staff Directory</h3>
                    <p style={{ opacity: 0.7 }}>Manage {counts.faculty} active faculty profiles.</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                        <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>Manage Staff</button>
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '30px', background: 'rgba(30, 41, 59, 0.3)', padding: '30px', borderRadius: '24px', border: '1px dotted rgba(255,255,255,0.2)', textAlign: 'center' }}>
                <h3>Database Health</h3>
                <p style={{ opacity: 0.6 }}>Total system records are synced with local storage.</p>
                <div style={{ marginTop: '10px', color: '#10b981', fontWeight: '800' }}>✓ ALL SYSTEMS OPERATIONAL</div>
            </div>
        </div>
    );
};

export default RecordManagement;
