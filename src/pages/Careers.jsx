import React, { useState, useEffect } from 'react';
import { mockApi } from '../utils/mockApi';
import './Careers.css';

const Careers = () => {
    const [jobs, setJobs] = useState(mockApi.getJobs());

    useEffect(() => {
        // In a real app, we'd fetch from an API
        setJobs(mockApi.getJobs());
    }, []);

    const activeJobs = jobs.filter(job => job.status === 'Active');

    return (
        <div className="careers-page">
            <div className="careers-hero">
                <h1>Join Our Team</h1>
                <p>Build your career with NSGI Group of Institutions. We are looking for passionate educators.</p>
            </div>

            <div className="careers-container">
                <div className="hiring-section">
                    <h2>Current Openings</h2>
                    {activeJobs.length > 0 ? (
                        <div className="jobs-grid">
                            {activeJobs.map(job => (
                                <div key={job.id} className="job-card">
                                    <div className="job-badge">Hiring</div>
                                    <h3>{job.position}</h3>
                                    <p className="job-dept">Department: {job.department}</p>
                                    <p className="job-date">Posted on: {job.date}</p>
                                    <div className="job-footer">
                                        <button className="apply-btn" onClick={() => window.location.href = 'mailto:hr@nsgi.edu.in'}>Apply Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-jobs">
                            <p>No active openings at the moment. Please check back later or send your resume to hr@nsgi.edu.in</p>
                        </div>
                    )}
                </div>

                <div className="why-join-us">
                    <h2>Why Join NSGI?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <span className="benefit-icon">🎓</span>
                            <h4>Professional Growth</h4>
                            <p>Regular workshops and training sessions to enhance your teaching skills.</p>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🏢</span>
                            <h4>Modern Infrastructure</h4>
                            <p>Work in a tech-enabled environment with the latest teaching aids.</p>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">🤝</span>
                            <h4>Culture of Excellence</h4>
                            <p>Be part of a supportive community dedicated to student success.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;
