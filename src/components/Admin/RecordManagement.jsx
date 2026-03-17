import React from 'react';

const RecordManagement = () => {
  return (
    <div className="record-management">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3>Student Directory</h3>
          <p style={{ opacity: 0.7 }}>Manage 1,240 active student profiles.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>View All</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#3b82f6', color: '#fff', border: 'none' }}>+ Add New</button>
          </div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h3>Staff Directory</h3>
          <p style={{ opacity: 0.7 }}>Manage teacher and non-teaching staff.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>View All</button>
            <button style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#10b981', color: '#fff', border: 'none' }}>+ Add New Staff</button>
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', background: 'rgba(30, 41, 59, 0.3)', padding: '30px', borderRadius: '24px', border: '1px dotted rgba(255,255,255,0.2)', textAlign: 'center' }}>
        <h3>Bulk Data Import</h3>
        <p style={{ opacity: 0.6 }}>Upload Excel or CSV files to update records in bulk.</p>
        <button style={{ marginTop: '10px', padding: '10px 30px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}>Choose File</button>
      </div>
    </div>
  );
};

export default RecordManagement;
