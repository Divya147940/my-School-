import React from 'react';
import './Faculty.css';
import divyanshiImg from '../assets/faculty/divyanshi.png';

const facultyData = [
    {
        name: "Husbun Jahan",
        designation: "MBA | HR & IT Head",
        image: null,
        initials: "HJ",
        avatarBg: "linear-gradient(135deg, #1a1a6e, #3a3aae)",
        desc: "Expert in Human Resource Management and Information Technology. Manages institutional operations, staff coordination, and IT infrastructure."
    },
    {
        name: "Divyanshi Verma",
        designation: "AI Engineer",
        image: divyanshiImg,
        initials: "DV",
        avatarBg: "linear-gradient(135deg, #c0392b, #e74c3c)",
        desc: "Specializing in Advanced Agentic Coding and AI integration for educational growth."
    },
    {
        name: "Rahul",
        designation: "MCA | Computer Science & IT Faculty",
        image: null,
        initials: "R",
        avatarBg: "linear-gradient(135deg, #27ae60, #2ecc71)",
        desc: "Master of Computer Applications with strong expertise in programming, database management, and networking. Guides students in computer education and smart class technologies."
    },
    {
        name: "Gayatri",
        designation: "MBA | HR & IT Faculty",
        image: null,
        initials: "G",
        avatarBg: "linear-gradient(135deg, #8e44ad, #9b59b6)",
        desc: "MBA in Human Resource & Information Technology. Skilled in organizational management, HR practices, and IT systems to support institutional excellence."
    }
];

function Faculty() {
    return (
        <div className="faculty-page">
            <div className="faculty-header">
                <h1>Our Expert Faculty</h1>
                <div className="faculty-divider" style={{ width: '80px', height: '4px', marginBottom: '20px' }}></div>
                <p>
                    We take pride in our highly qualified and experienced team of educators who are
                    dedicated to nurturing the future leaders of tomorrow.
                </p>
            </div>

            <div className="faculty-grid">
                {facultyData.map((member, index) => (
                    <div className="faculty-card" key={index}>
                        <div className="faculty-img-container">
                            {member.image ? (
                                <img src={member.image} alt={member.name} className="faculty-img" />
                            ) : (
                                <div className="faculty-avatar" style={{ background: member.avatarBg }}>
                                    <span>{member.initials}</span>
                                </div>
                            )}
                        </div>
                        <div className="faculty-info">
                            <h2 className="faculty-name">{member.name}</h2>
                            <p className="faculty-designation">{member.designation}</p>
                            <div className="faculty-divider"></div>
                            <p className="faculty-desc">{member.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Faculty;
