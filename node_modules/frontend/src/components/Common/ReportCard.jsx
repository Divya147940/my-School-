import React from 'react';
import './ReportCard.css';

const ReportCard = ({ data }) => {
    if (!data) return null;

    const totalMarks = data.subjects.reduce((sum, s) => sum + s.marks, 0);
    const totalPossible = data.subjects.reduce((sum, s) => sum + s.total, 0);
    const percentage = ((totalMarks / totalPossible) * 100).toFixed(2);
    
    const getGrade = (pct) => {
        if (pct >= 90) return 'A+';
        if (pct >= 80) return 'A';
        if (pct >= 70) return 'B';
        if (pct >= 60) return 'C';
        if (pct >= 50) return 'D';
        return 'E';
    };

    const grade = getGrade(percentage);

    return (
        <div className="report-card-visual">
            <div className="rc-watermark">NSGI</div>
            
            <div className="rc-header">
                <div className="rc-school-info">
                    <h2>SHRI JAGESHWAR MEMORIAL EDUCATIONAL INSTITUTE</h2>
                    <p>Affiliated to CBSE | Salon Road, Lalganj, Raebareli</p>
                    <div className="rc-badge">ACADEMIC PROGRESS REPORT</div>
                </div>
            </div>

            <div className="rc-student-details">
                <div className="rc-detail-item">
                    <span>Student Name:</span>
                    <strong>{data.studentName}</strong>
                </div>
                <div className="rc-detail-item">
                    <span>Roll No:</span>
                    <strong>{data.rollNo}</strong>
                </div>
                <div className="rc-detail-item">
                    <span>Class:</span>
                    <strong>{data.class}</strong>
                </div>
                <div className="rc-detail-item">
                    <span>Exam:</span>
                    <strong>{data.examType}</strong>
                </div>
            </div>

            <table className="rc-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Marks Obtained</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {data.subjects.map((sub, idx) => (
                        <tr key={idx}>
                            <td>{sub.name}</td>
                            <td>{sub.total}</td>
                            <td className="marks">{sub.marks}</td>
                            <td>{getGrade((sub.marks / sub.total) * 100)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="total-row">
                        <td>TOTAL</td>
                        <td>{totalPossible}</td>
                        <td className="marks">{totalMarks}</td>
                        <td>{grade}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="rc-summary">
                <div className="rc-percentage-box">
                    <span>PERCENTAGE</span>
                    <h3>{percentage}%</h3>
                </div>
                <div className="rc-grade-box">
                    <span>OVERALL GRADE</span>
                    <h3>{grade}</h3>
                </div>
                <div className="rc-status-box">
                    <span>RESULT</span>
                    <h3 style={{ color: percentage >= 50 ? '#10b981' : '#f43f5e' }}>
                        {percentage >= 50 ? 'PROMOTED' : 'DETAINED'}
                    </h3>
                </div>
            </div>

            <div className="rc-remarks">
                <strong>Teacher's Remarks:</strong>
                <p>{data.remarks}</p>
            </div>

            <div className="rc-footer">
                <div className="signature">
                    <div className="sig-line"></div>
                    <p>Class Teacher</p>
                </div>
                <div className="signature">
                    <div className="sig-line"></div>
                    <p>Principal</p>
                </div>
                <div className="rc-date">
                    Date: {data.date}
                </div>
            </div>
        </div>
    );
};

export default ReportCard;
