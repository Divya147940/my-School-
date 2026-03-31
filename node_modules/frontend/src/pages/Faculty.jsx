import React, { useState, useEffect } from 'react';
import './Faculty.css';
import { mockApi } from '../utils/mockApi';
import useScrollReveal from '../hooks/useScrollReveal';

function Faculty() {
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useScrollReveal({ threshold: 0.1 });

    useEffect(() => {
        const data = mockApi.getFaculty() || [];
        const mappedData = data.map(item => ({
            ...item,
            initials: (item.name || 'Staff Member').split(' ').map(n => n[0]).join(''),
            desc: item.description || ''
        }));
        setFacultyList(mappedData);
        setLoading(false);
    }, []);

    return (
        <div className="faculty-page" ref={sectionRef}>
            <div className="faculty-header reveal-on-scroll">
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
                        <div className="faculty-card reveal-on-scroll" key={index} style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
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
