import React, { useState, useEffect } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';
import './InquiryTracker.css';

const InquiryTracker = () => {
    const [inquiries, setInquiries] = useState([]);
    const { addToast } = useToast();

    useEffect(() => {
        const data = mockApi.getInitialData();
        setInquiries(data.inquiries || []);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            const db = mockApi.getInitialData();
            db.inquiries = db.inquiries.filter(i => i.id !== id);
            mockApi.saveData(db);
            setInquiries(db.inquiries);
            addToast("Lead removed successfully.", "success");
        }
    };

    return (
        <div className="inquiry-tracker">
            <div className="tracker-header">
                <h2>📥 Lead & Inquiry Management</h2>
                <span className="lead-count">{inquiries.length} New Leads</span>
            </div>

            <div className="tracker-table-container">
                <table className="tracker-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.length > 0 ? inquiries.map(inq => (
                            <tr key={inq.id}>
                                <td>{new Date(inq.submittedAt).toLocaleDateString()}</td>
                                <td className="font-bold">{inq.name}</td>
                                <td>
                                    <div className="contact-cell">
                                        <span>📞 {inq.phone}</span>
                                        <span className="text-muted">✉️ {inq.email}</span>
                                    </div>
                                </td>
                                <td className="message-cell">{inq.message || "Generic Inquiry"}</td>
                                <td>
                                    <span className="status-pill status-new">New Lead</span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="btn-call" onClick={() => window.open(`tel:${inq.phone}`)}>📞 Call</button>
                                        <button className="btn-delete" onClick={() => handleDelete(inq.id)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="empty-state">No inquiries yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InquiryTracker;
