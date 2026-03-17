import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import ReportCard from '../Common/ReportCard';

const ReportCardGenerator = () => {
    const [step, setStep] = useState(1); // 1: Select Student, 2: Enter Marks, 3: Preview
    const [selectedStudent, setSelectedStudent] = useState('');
    const [examType, setExamType] = useState('Final Term');
    const [marks, setMarks] = useState([
        { name: 'Mathematics', marks: '', total: 100 },
        { name: 'Science', marks: '', total: 100 },
        { name: 'English', marks: '', total: 100 },
        { name: 'Social Science', marks: '', total: 100 },
        { name: 'Hindi', marks: '', total: 100 }
    ]);
    const [remarks, setRemarks] = useState('');
    const [generatedCard, setGeneratedCard] = useState(null);

    const students = ['Aman Gupta', 'Priya Verma', 'Rahul Singh', 'Sneha Das', 'Vikram Rathore'];

    const handleMarkChange = (index, value) => {
        const newMarks = [...marks];
        newMarks[index].marks = parseInt(value) || 0;
        setMarks(newMarks);
    };

    const handleGenerate = () => {
        const reportData = {
            studentName: selectedStudent,
            rollNo: `2026${Math.floor(100 + Math.random() * 900)}`,
            class: '10A',
            examType,
            subjects: marks,
            remarks,
            date: new Date().toLocaleDateString('en-GB')
        };
        setGeneratedCard(reportData);
        setStep(3);
    };

    const handleSave = () => {
        mockApi.addReportCard(generatedCard);
        alert('Report Card Saved Successfully!');
        setStep(1);
        setGeneratedCard(null);
        setSelectedStudent('');
        setMarks(marks.map(m => ({ ...m, marks: '' })));
        setRemarks('');
    };

    return (
        <div className="report-generator-container" style={{ color: '#fff' }}>
            <div className="generator-steps" style={{ display: 'flex', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
                <div style={{ opacity: step === 1 ? 1 : 0.5, borderBottom: step === 1 ? '2px solid #3b82f6' : 'none', paddingBottom: '5px' }}>1. Select Student</div>
                <div style={{ opacity: step === 2 ? 1 : 0.5, borderBottom: step === 2 ? '2px solid #3b82f6' : 'none', paddingBottom: '5px' }}>2. Enter Marks</div>
                <div style={{ opacity: step === 3 ? 1 : 0.5, borderBottom: step === 3 ? '2px solid #3b82f6' : 'none', paddingBottom: '5px' }}>3. Preview & Save</div>
            </div>

            {step === 1 && (
                <div className="step-content card-bg" style={{ maxWidth: '500px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Select Student & Exam</h3>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Student Name</label>
                        <select 
                            value={selectedStudent} 
                            onChange={e => setSelectedStudent(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '10px' }}
                        >
                            <option value="">Choose a student...</option>
                            {students.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Examination Type</label>
                        <select 
                            value={examType} 
                            onChange={e => setExamType(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '10px' }}
                        >
                            <option value="Unit Test I">Unit Test I</option>
                            <option value="Half Yearly">Half Yearly</option>
                            <option value="Unit Test II">Unit Test II</option>
                            <option value="Final Term">Final Term</option>
                        </select>
                    </div>
                    <button 
                        disabled={!selectedStudent}
                        onClick={() => setStep(2)}
                        style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: selectedStudent ? 'pointer' : 'not-allowed', opacity: selectedStudent ? 1 : 0.5 }}
                    >
                        Next Step →
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="step-content card-bg" style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', padding: '30px', borderRadius: '20px' }}>
                    <h3 style={{ marginBottom: '20px' }}>Enter Marks for {selectedStudent}</h3>
                    <div className="marks-grid" style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
                        {marks.map((sub, idx) => (
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px', gap: '15px', alignItems: 'center' }}>
                                <span>{sub.name}</span>
                                <input 
                                    type="number" 
                                    placeholder="Marks" 
                                    value={sub.marks}
                                    onChange={e => handleMarkChange(idx, e.target.value)}
                                    style={{ padding: '8px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '5px' }}
                                />
                                <span style={{ color: '#94a3b8' }}>/ {sub.total}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Teacher's Remarks</label>
                        <textarea 
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            placeholder="e.g. Excellent performance..."
                            style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', color: '#fff', borderRadius: '10px', minHeight: '80px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Back</button>
                        <button onClick={handleGenerate} style={{ flex: 2, padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Generate Preview</button>
                    </div>
                </div>
            )}

            {step === 3 && generatedCard && (
                <div className="step-content">
                    <div className="preview-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 20px auto' }}>
                        <h3>Previewing Report Card</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setStep(2)} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Edit Marks</button>
                            <button onClick={handleSave} style={{ padding: '8px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Confirm & Publish Result</button>
                        </div>
                    </div>
                    <ReportCard data={generatedCard} />
                </div>
            )}
        </div>
    );
};

export default ReportCardGenerator;
