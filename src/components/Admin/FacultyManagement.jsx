import { mockApi } from '../../utils/mockApi';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../Common/Toaster';

const FacultyManagement = () => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [recentFaculty, setRecentFaculty] = useState(null);
    const [facultyList, setFacultyList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFacultyList(mockApi.getDB().facultyRegistry || []);
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this faculty member?")) {
            mockApi.deleteFaculty(id);
            setFacultyList(prev => prev.filter(f => f.id !== id));
            addToast("Faculty record removed.", "info");
        }
    };

    const filteredFaculty = facultyList.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="faculty-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', padding: '20px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '30px' }}>{t('registerFaculty')}</h2>
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>Full Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Dr. Rajesh Kumar"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '10px' }}>{t('subject')}</label>
                        <input 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g. Physics"
                            style={{ width: '100%', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '18px', borderRadius: '16px', background: 'var(--accent-blue)', color: '#fff', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem' }}>
                        REGISTER FACULTY 👨‍🏫
                    </button>
                </form>

                {recentFaculty && (
                    <div style={{ marginTop: '30px', padding: '20px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b98150', textAlign: 'center' }}>
                        <p style={{ color: '#10b981', fontWeight: '800', marginBottom: '10px' }}>{t('onboardSuccess')}</p>
                        <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>ID: <span style={{ color: 'var(--accent-blue)' }}>{recentFaculty.id}</span></div>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '40px', borderRadius: '32px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Faculty Directory</h3>
                
                {/* Search Bar */}
                <input 
                    type="text" 
                    placeholder="Search name, subject or ID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', marginBottom: '25px' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '500px' }}>
                    {filteredFaculty.length > 0 ? filteredFaculty.slice().reverse().map(f => (
                        <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>
                                <div style={{ fontWeight: '700' }}>{f.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{f.subject}</div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{f.id}</div>
                                <button 
                                    onClick={() => handleDelete(f.id)}
                                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef444450', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>No faculty found matching your search.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FacultyManagement;
