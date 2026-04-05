import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config';
import { useToast } from '../Common/Toaster';
import './InquiryTracker.css';

const InquiryTracker = () => {
    const { secureApi } = useAuth();
    const [inquiries, setInquiries] = useState([]);
    const { addToast } = useToast();

    const fetchLeads = async () => {
        try {
            const res = await secureApi(`${API_URL}/api/admissions`);
            if (res.ok) {
                const data = await res.json();
                setInquiries(data);
            }
        } catch (e) {
            console.error("Fetch failed", e);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [secureApi]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                const res = await secureApi(`${API_URL}/api/admissions/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    addToast("Lead removed successfully.", "success");
                    fetchLeads();
                }
            } catch (e) {
                addToast("Failed to delete lead.", "error");
            }
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
                                <td>{new Date(inq.created_at || inq.submittedAt).toLocaleDateString()}</td>
                                <td className="font-bold">{inq.student_name || inq.name}</td>
                                <td>
                                    <div className="contact-cell">
                                        <span>📞 {inq.phone}</span>
                                        <span className="text-muted">✉️ {inq.email}</span>
                                    </div>
                                </td>
                                <td className="message-cell">{inq.class_applied ? `Applied for Class ${inq.class_applied}` : (inq.message || "Generic Inquiry")}</td>
                                <td>
                                    <span className={`status-pill status-${inq.status || 'new'}`}>{inq.status || 'New Lead'}</span>
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
