import React, { useState, useEffect } from 'react';
import './Faculty.css';
import divyanshiImg from '../assets/faculty/divyanshi.png';

function Faculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5001/api/faculty')
            .then(res => res.json())
            .then(data => {
                // Map DB fields to component fields if necessary
                const mappedData = data.map(item => ({
                    ...item,
                    image: item.name === "Divyanshi Verma" ? divyanshiImg : (item.image_url || null),
                    initials: item.name.split(' ').map(n => n[0]).join(''),
                    avatarBg: "linear-gradient(135deg, #1a1a6e, #3a3aae)", // Default bg
                    desc: item.description
                }));
                setFacultyList(mappedData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching faculty:", err);
                setLoading(false);
            });
    }, []);

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

            {loading ? (
                <div className="loading">Loading Faculty...</div>
            ) : (
                <div className="faculty-grid">
                    {facultyList.map((member, index) => (
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
            )}
        </div>
    );
}

export default Faculty;
