import React from 'react';
import './Academics.css';

function Academics() {
    const programs = [
        {
            level: 'Pre-Primary',
            classes: 'Nursery, LKG, UKG',
            icon: '🧒',
            color: '#e74c3c',
            subjects: ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes & Stories', 'General Awareness'],
            desc: 'खेल-खेल में शिक्षा के माध्यम से बच्चों की नींव मजबूत करना। Activity-based learning for foundational development.'
        },
        {
            level: 'Primary',
            classes: 'Class 1 - 5',
            icon: '📚',
            color: '#e67e22',
            subjects: ['English', 'Hindi', 'Mathematics', 'EVS / Science', 'Social Studies', 'Computer', 'Drawing', 'GK'],
            desc: 'बुनियादी शिक्षा को मजबूत बनाना और विज्ञान, गणित और भाषा में रुचि विकसित करना।'
        },
        {
            level: 'Middle School',
            classes: 'Class 6 - 8',
            icon: '🔬',
            color: '#27ae60',
            subjects: ['English', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Drawing'],
            desc: 'विषयों की गहरी समझ, प्रयोगशाला कार्य, और प्रतिस्पर्धी परीक्षाओं की तैयारी शुरू करना।'
        },
        {
            level: 'Secondary',
            classes: 'Class 9 - 10 (U.P. Board)',
            icon: '🎓',
            color: '#1a1a6e',
            subjects: ['English', 'Hindi', 'Mathematics', 'Science (Physics, Chemistry, Bio)', 'Social Science', 'Home Science (Girls)', 'Computer'],
            desc: 'U.P. बोर्ड परीक्षा की तैयारी, विज्ञान प्रयोगशाला, और करियर मार्गदर्शन के साथ गहन शिक्षा।'
        }
    ];

    const features = [
        { icon: '📺', title: 'Smart Classes', desc: 'Audio-visual aids और interactive digital boards से पढ़ाई' },
        { icon: '🧠', title: 'Reasoning Classes', desc: 'Competitive exam preparation और logical thinking' },
        { icon: '🔬', title: 'Science Labs', desc: 'Physics, Chemistry, Biology की practical शिक्षा' },
        { icon: '💻', title: 'Computer Education', desc: 'Nursery से ही Computer education की शुरुआत' },
        { icon: '📝', title: 'Regular Tests', desc: 'Weekly tests, monthly exams और quarterly assessments' },
        { icon: '📖', title: 'Library Access', desc: 'Books, magazines और competitive exam material' },
    ];

    return (
        <div className="acad-page">
            {/* Hero */}
            <div className="acad-hero">
                <h1>Academics</h1>
                <p>Comprehensive Education from Nursery to Class 10</p>
            </div>

            {/* Intro */}
            <div className="acad-intro">
                <h2>शैक्षणिक कार्यक्रम</h2>
                <p>
                    श्री जागेश्वर मेमोरियल एजुकेशनल इंस्टीट्यूट U.P. बोर्ड से मान्यता प्राप्त
                    संस्थान है। हम Nursery से Class 10 तक गुणवत्तापूर्ण शिक्षा प्रदान करते हैं।
                    हमारा पाठ्यक्रम शैक्षणिक उत्कृष्टता, व्यावहारिक ज्ञान और नैतिक मूल्यों
                    का संतुलित मिश्रण है।
                </p>
            </div>

            {/* Programs */}
            <div className="acad-programs-section">
                <h2 className="acad-section-title">कक्षा-वार पाठ्यक्रम</h2>
                <span className="acad-section-sub">Class-wise Curriculum Overview</span>

                <div className="acad-programs-grid">
                    {programs.map((prog, i) => (
                        <div className="acad-program-card" key={i}>
                            <div className="acad-prog-header" style={{ background: prog.color }}>
                                <span className="acad-prog-icon">{prog.icon}</span>
                                <h3>{prog.level}</h3>
                                <span className="acad-prog-classes">{prog.classes}</span>
                            </div>
                            <div className="acad-prog-body">
                                <p className="acad-prog-desc">{prog.desc}</p>
                                <h4>Subjects / विषय:</h4>
                                <div className="acad-subject-tags">
                                    {prog.subjects.map((sub, j) => (
                                        <span className="acad-tag" key={j}>{sub}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Teaching Features */}
            <div className="acad-features-section">
                <h2 className="acad-features-title">शिक्षण पद्धति</h2>
                <span className="acad-features-sub">Our Teaching Methodology</span>

                <div className="acad-features-grid">
                    {features.map((feat, i) => (
                        <div className="acad-feature-card" key={i}>
                            <div className="acad-feat-icon">{feat.icon}</div>
                            <h3>{feat.title}</h3>
                            <p>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exam Pattern */}
            <div className="acad-exam-section">
                <h2>परीक्षा पद्धति (Examination Pattern)</h2>
                <div className="acad-exam-grid">
                    <div className="acad-exam-card">
                        <div className="acad-exam-num">01</div>
                        <h3>Weekly Test</h3>
                        <p>हर सप्ताह छोटी परीक्षाएं, जो बच्चों की समझ का आकलन करती हैं</p>
                    </div>
                    <div className="acad-exam-card">
                        <div className="acad-exam-num">02</div>
                        <h3>Monthly Exam</h3>
                        <p>मासिक परीक्षा से विद्यार्थियों की प्रगति की निगरानी</p>
                    </div>
                    <div className="acad-exam-card">
                        <div className="acad-exam-num">03</div>
                        <h3>Quarterly Exam</h3>
                        <p>त्रैमासिक परीक्षा — पूरे पाठ्यक्रम का comprehensive assessment</p>
                    </div>
                    <div className="acad-exam-card">
                        <div className="acad-exam-num">04</div>
                        <h3>Annual Exam</h3>
                        <p>वार्षिक परीक्षा — अगली कक्षा में प्रमोशन हेतु final evaluation</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Academics;
