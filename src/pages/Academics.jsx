import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Academics.css';

function Academics() {
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    const programs = [
        {
            level: 'Pre-Primary',
            classes: 'Nursery, LKG, UKG',
            icon: '🧒',
            color: 'linear-gradient(135deg, #ef4444, #991b1b)',
            subjects: ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes & Stories', 'General Awareness'],
            desc: 'खेल-खेल में शिक्षा के माध्यम से बच्चों की नींव मजबूत करना। Activity-based learning for foundational development.'
        },
        {
            level: 'Primary',
            classes: 'Class 1 - 5',
            icon: '📚',
            color: 'linear-gradient(135deg, #f59e0b, #92400e)',
            subjects: ['English', 'Hindi', 'Mathematics', 'EVS / Science', 'Social Studies', 'Computer', 'Drawing', 'GK'],
            desc: 'बुनियादी शिक्षा को मजबूत बनाना और विज्ञान, गणित और भाषा में रुचि विकसित करना।'
        },
        {
            level: 'Middle School',
            classes: 'Class 6 - 8',
            icon: '🔬',
            color: 'linear-gradient(135deg, #10b981, #065f46)',
            subjects: ['English', 'Hindi', 'Sanskrit', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Drawing'],
            desc: 'विषयों की गहरी समझ, प्रयोगशाला कार्य, और प्रतिस्पर्धी परीक्षाओं की तैयारी शुरू करना।'
        },
        {
            level: 'Secondary',
            classes: 'Class 9 - 10 (U.P. Board)',
            icon: '🎓',
            color: 'linear-gradient(135deg, #3b82f6, #1e3a8a)',
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
        <div className="acad-page" ref={sectionRef}>
            {/* Hero */}
            <div className="acad-hero reveal-on-scroll">
                <h1>Academics</h1>
                <p>Comprehensive Education from Nursery to Class 10</p>
            </div>

            {/* Intro */}
            <div className="acad-intro reveal-on-scroll">
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
                <div className="reveal-on-scroll">
                    <h2 className="acad-section-title">कक्षा-वार पाठ्यक्रम</h2>
                    <span className="acad-section-sub">Class-wise Curriculum Overview</span>
                </div>

                <div className="acad-programs-grid">
                    {programs.map((prog, i) => (
                        <div className="acad-program-card reveal-on-scroll" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
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
                <div className="reveal-on-scroll">
                    <h2 className="acad-features-title">शिक्षण पद्धति</h2>
                    <span className="acad-features-sub">Our Teaching Methodology</span>
                </div>

                <div className="acad-features-grid">
                    {features.map((feat, i) => (
                        <div className="acad-feature-card reveal-on-scroll" key={i} style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
                            <div className="acad-feat-icon">{feat.icon}</div>
                            <h3>{feat.title}</h3>
                            <p>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exam Pattern */}
            <div className="acad-exam-section">
                <div className="reveal-on-scroll">
                    <h2>परीक्षा पद्धति (Examination Pattern)</h2>
                </div>
                <div className="acad-exam-grid">
                    {[
                        { num: '01', title: 'Weekly Test', desc: 'हर सप्ताह छोटी परीक्षाएं, जो बच्चों की समझ का आकलन करती हैं' },
                        { num: '02', title: 'Monthly Exam', desc: 'मासिक परीक्षा से विद्यार्थियों की प्रगति की निगरानी' },
                        { num: '03', title: 'Quarterly Exam', desc: 'त्रैमासिक परीक्षा — पूरे पाठ्यक्रम का comprehensive assessment' },
                        { num: '04', title: 'Annual Exam', desc: 'वार्षिक परीक्षा — अगली कक्षा में प्रमोशन हेतु final evaluation' }
                    ].map((exam, i) => (
                        <div className="acad-exam-card reveal-on-scroll" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                            <div className="acad-exam-num">{exam.num}</div>
                            <h3>{exam.title}</h3>
                            <p>{exam.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Academics;
