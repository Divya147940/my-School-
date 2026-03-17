import { mockApi } from '../utils/mockApi';
import './GalleryPage.css';

function GalleryPage() {
    const [galleryItems, setGalleryItems] = useState(mockApi.getGallery());
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { key: 'all', label: 'All / सभी' },
        { key: 'campus', label: 'Campus / परिसर' },
        { key: 'events', label: 'Events / कार्यक्रम' },
        { key: 'classroom', label: 'Classroom / कक्षा' },
    ];

    const filtered = activeFilter === 'all'
        ? galleryItems
        : galleryItems.filter(item => item.category === activeFilter);

    return (
        <div className="gal-page">
            <div className="gal-hero">
                <h1>Photo Gallery</h1>
                <p>हमारे विद्यालय की झलकियाँ — Campus, Events & More</p>
            </div>

            {/* Filters */}
            <div className="gal-filters">
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`gal-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                        onClick={() => setActiveFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="gal-grid">
                {filtered.map((item, i) => (
                    <div className="gal-card" key={i} onClick={() => setLightbox(item)}>
                        {item.type === 'video' ? (
                            <div className="gal-video-placeholder" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff' }}>
                                📹 Video: {item.title}
                            </div>
                        ) : (
                            <img src={item.url || item.src} alt={item.title} className="gal-img" />
                        )}
                        <div className="gal-overlay">
                            <h3>{item.title}</h3>
                            <p>{item.desc || (item.type === 'video' ? 'Video Highlights' : 'Campus Life')}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {lightbox && (
                <div className="gal-lightbox" onClick={() => setLightbox(null)}>
                    <div className="gal-lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="gal-lightbox-close" onClick={() => setLightbox(null)}>✕</button>
                        {lightbox.type === 'video' ? (
                            <video src={lightbox.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '70vh' }} />
                        ) : (
                            <img src={lightbox.url || lightbox.src} alt={lightbox.title} />
                        )}
                        <div className="gal-lightbox-info">
                            <h3>{lightbox.title}</h3>
                            <p>{lightbox.desc || 'School Activity'}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GalleryPage;
