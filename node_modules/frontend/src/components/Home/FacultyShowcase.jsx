import React, { useState, useEffect } from 'react';
import './FacultyShowcase.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';
import Skeleton from '../Common/Skeleton';
import useScrollReveal from '../../hooks/useScrollReveal';

const FacultyShowcase = () => {
    const { language } = useLanguage();
    const [faculty, setFaculty] = useState([]);
    const [loading, setLoading] = useState(true);
    const sectionRef = useScrollReveal({ threshold: 0.1 });

    useEffect(() => {
        const data = mockApi.getMentors();
        setFaculty(Array.isArray(data) ? data : []);
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <section className="faculty-showcase-section">
                <div className="section-header-centered">
                    <Skeleton width="150px" height="20px" borderRadius="10px" />
                    <Skeleton width="300px" height="40px" borderRadius="10px" style={{ marginTop: '10px' }} />
                </div>
                <div className="faculty-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} height="400px" borderRadius="20px" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="faculty-showcase-section" ref={sectionRef}>
            <div className="section-header-centered">
                <span className="premium-tag">{language === 'hi' ? 'विशेषज्ञ संकाय' : 'EXPERT FACULTY'}</span>
                <h2>{language === 'hi' ? 'हमारे मार्गदर्शक' : 'Meet Our Mentors'}</h2>
            </div>

            <div className="faculty-grid">
                {faculty.map((member, index) => (
                    <div key={member.id || member.name} className="faculty-card glass-panel reveal-on-scroll" style={{ transitionDelay: `${index * 0.15}s` }}>
                        <div className="fac-img-container">
                            {member.image ? (
                                <img src={member.image} alt={member.name} />
                            ) : (
                                <div className="fac-avatar-placeholder" style={{ background: member.avatarBg || '#1e293b' }}>
                                    {(member.name || 'F').charAt(0)}
                                </div>
                            )}
                            <div className="fac-socials">
                                <span>📧</span>
                                <span>💬</span>
                            </div>
                        </div>
                        <div className="fac-info">
                            <h3>{member.name}</h3>
                            <span className="fac-role">
                                {member.role && typeof member.role === 'object' 
                                    ? (member.role[language] || member.role['en']) 
                                    : (member.role || member.designation || (language === 'hi' ? 'शिक्षक' : 'Faculty'))}
                            </span>
                            <div className="fac-edu">{member.edu || member.qualification || ''}</div>
                            <div className="fac-exp">✨ {member.exp || member.experience || '5+'} {language === 'hi' ? 'का अनुभव' : 'Experience'}</div>
                            <button className="fac-contact-btn">
                                {language === 'hi' ? 'संपर्क करें' : 'Get in Touch'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FacultyShowcase;
