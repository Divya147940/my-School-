import React from 'react';
import './FacultyShowcase.css';
import { useLanguage } from '../../context/LanguageContext';

const facultyMembers = [
    {
        name: 'Dr. Aruna Singh',
        role: { en: 'Principal', hi: 'प्रधानाचार्य' },
        edu: 'Ph.D in Education, M.Sc',
        exp: '20+ Years',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Mr. Vivek Mishra',
        role: { en: 'Vice Principal', hi: 'उप-प्रधानाचार्य' },
        edu: 'M.A (English), B.Ed',
        exp: '15 Years',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Ms. Shalini Gupta',
        role: { en: 'HOD Science', hi: 'विभागाध्यक्ष (विज्ञान)' },
        edu: 'M.Sc Physics, B.Ed',
        exp: '12 Years',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Mr. Rahul Verma',
        role: { en: 'Maths Specialist', hi: 'गणित विशेषज्ञ' },
        edu: 'M.Sc Maths, NET Qualified',
        exp: '10 Years',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
];

const FacultyShowcase = () => {
    const { language } = useLanguage();

    return (
        <section className="faculty-showcase-section">
            <div className="section-header-centered">
                <span className="premium-tag">{language === 'hi' ? 'विशेषज्ञ संकाय' : 'EXPERT FACULTY'}</span>
                <h2>{language === 'hi' ? 'हमारे मार्गदर्शक' : 'Meet Our Mentors'}</h2>
            </div>

            <div className="faculty-grid">
                {facultyMembers.map((member) => (
                    <div key={member.name} className="faculty-card glass-panel reveal-on-scroll">
                        <div className="fac-img-container">
                            <img src={member.image} alt={member.name} />
                            <div className="fac-socials">
                                <span>📧</span>
                                <span>💬</span>
                            </div>
                        </div>
                        <div className="fac-info">
                            <h3>{member.name}</h3>
                            <span className="fac-role">{member.role[language]}</span>
                            <div className="fac-edu">{member.edu}</div>
                            <div className="fac-exp">✨ {member.exp} {language === 'hi' ? 'का अनुभव' : 'Experience'}</div>
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
