import { useAuth } from '../../context/AuthContext';

const LiveClasses = () => {
  const { secureApi } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // Using 'Class 10' for demo
      const response = await secureApi('http://localhost:5001/api/live-classes/Class%2010');
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading live classes...</div>;

  return (
    <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Upcoming Live Classes</h3>
        <button onClick={fetchClasses} style={{ padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer' }}>Refresh</button>
      </div>
      
      {classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📅</div>
          <p>No live classes scheduled for today.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {classes.map((cls) => (
            <div key={cls.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '6px', background: '#3b82f620', color: '#3b82f6' }}>{cls.subject}</span>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{cls.topic || 'General Discussion'}</p>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                   Teacher: {cls.teacher_name} | Clock: {new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <a 
                href={cls.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ padding: '10px 20px', borderRadius: '10px', background: '#10b981', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
              >
                Join Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveClasses;
