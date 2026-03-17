import React, { useState } from 'react';
import './IDCardGenerator.css';

const IDCardGenerator = () => {
    const [selectedStudent, setSelectedStudent] = useState({
        name: 'Aman Gupta',
        roll: 'S101',
        class: '10-A',
        dob: '12/05/2010',
        bloodGroup: 'B+',
        phone: '+91 98765 43210'
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="id-gen-container no-print">
            <header className="id-header">
                <h2>🪪 Digital ID Card Generator</h2>
                <button className="print-btn" onClick={handlePrint}>Print ID Card</button>
            </header>

            <div className="id-preview-area">
                <div className="id-card-modern print-only-card">
                    <div className="card-top-accent"></div>
                    <div className="card-header">
                        <div className="school-logo-small">NSGI</div>
                        <div className="school-name-id">
                            <h3>NSGI Group of Institutions</h3>
                            <p>Knowledge • Excellence • Innovation</p>
                        </div>
                    </div>
                    
                    <div className="card-body">
                        <div className="student-photo-frame">
                            <div className="photo-placeholder">STUDENT PHOTO</div>
                        </div>
                        
                        <div className="student-details-id">
                            <h2 className="student-name-id">{selectedStudent.name}</h2>
                            <p className="student-title-id">STUDENT</p>
                            
                            <div className="details-grid-id">
                                <div className="detail-item-id"><label>Roll No</label> <span>{selectedStudent.roll}</span></div>
                                <div className="detail-item-id"><label>Class</label> <span>{selectedStudent.class}</span></div>
                                <div className="detail-item-id"><label>DOB</label> <span>{selectedStudent.dob}</span></div>
                                <div className="detail-item-id"><label>Blood</label> <span>{selectedStudent.bloodGroup}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer-id">
                        <div className="qr-code-placeholder">QR CODE</div>
                        <div className="emergency-contact">
                            <label>Emergency Contact</label>
                            <p>{selectedStudent.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-controls-id">
                <h3>Card Controls</h3>
                <div className="input-group-id">
                    <label>Edit Student Name</label>
                    <input 
                        type="text" 
                        value={selectedStudent.name} 
                        onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                    />
                </div>
                <div className="input-group-id">
                    <label>Blood Group</label>
                    <select 
                        value={selectedStudent.bloodGroup} 
                        onChange={(e) => setSelectedStudent({...selectedStudent, bloodGroup: e.target.value})}
                    >
                        <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
                    </select>
                </div>
                <p className="note-id">💡 Select a student from records to auto-populate cards.</p>
            </div>
        </div>
    );
};

export default IDCardGenerator;
