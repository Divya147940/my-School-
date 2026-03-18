import IDCard from '../Common/IDCard';
import './IDCardGenerator.css';

const IDCardGenerator = () => {
    const [selectedStudent, setSelectedStudent] = useState({
        name: 'Aman Gupta',
        rollNo: '2026001',
        class: '10-A',
        dob: '12/05/2010',
        bloodGroup: 'B+',
        phone: '+91 98765 43210'
    });

    return (
        <div className="id-gen-container">
            <div className="id-gen-grid">
                <div className="admin-controls-id glass-panel">
                    <h3 className="section-title">Digital ID Workspace</h3>
                    <div className="input-group-id">
                        <label>Student Name</label>
                        <input 
                            type="text" 
                            value={selectedStudent.name} 
                            onChange={(e) => setSelectedStudent({...selectedStudent, name: e.target.value})}
                        />
                    </div>
                    <div className="input-group-row-id">
                        <div className="input-group-id">
                            <label>Class</label>
                            <input 
                                type="text" 
                                value={selectedStudent.class} 
                                onChange={(e) => setSelectedStudent({...selectedStudent, class: e.target.value})}
                            />
                        </div>
                        <div className="input-group-id">
                            <label>Blood Group</label>
                            <select 
                                value={selectedStudent.bloodGroup} 
                                onChange={(e) => setSelectedStudent({...selectedStudent, bloodGroup: e.target.value})}
                            >
                                <option>A+</option><option>B+</option><option>O+</option><option>AB+</option><option>B-</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group-id">
                        <label>Roll Number</label>
                        <input 
                            type="text" 
                            value={selectedStudent.rollNo} 
                            onChange={(e) => setSelectedStudent({...selectedStudent, rollNo: e.target.value})}
                        />
                    </div>
                    
                    <div className="gen-actions">
                        <button className="issue-btn">Issue to Student Portal 🚀</button>
                    </div>
                    <p className="note-id">💡 Issued ID cards appear immediately in Student & Parent dashboards.</p>
                </div>

                <div className="id-preview-area">
                    <h3 className="section-title">Live Preview</h3>
                    <IDCard studentData={selectedStudent} />
                </div>
            </div>
        </div>
    );
};

export default IDCardGenerator;
