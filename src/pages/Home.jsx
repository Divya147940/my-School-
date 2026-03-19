import useScrollReveal from '../hooks/useScrollReveal';
import useSEO from '../hooks/useSEO';
import { useLanguage } from '../context/LanguageContext';
import Gallery from '../components/Gallery';
import AchievementGallery from '../components/Common/AchievementGallery';
import ChairmanMessage from '../components/ChairmanMessage';
import QuickLinks from '../components/QuickLinks';
import GalleryVideo from '../components/GalleryVideo';
import OurStrength from '../components/OurStrength';
import ParentReviews from '../components/ParentReviews';
import ContactInfo from '../components/ContactInfo';
import StudentSpotlight from '../components/Home/StudentSpotlight';
import AlumniHallOfFame from '../components/Home/AlumniHallOfFame';
import QuickInquiry from '../components/Home/QuickInquiry';
import HomeInquirySection from '../components/Home/HomeInquirySection';
import LegacyTimeline from '../components/Home/LegacyTimeline';
import FacultyShowcase from '../components/Home/FacultyShowcase';

function Home() {
    const { t } = useLanguage();
    const sectionRef = useScrollReveal({ threshold: 0.1 });
    
    useSEO(
        t('home'),
        "Welcome to Shri Jageshwar Memorial Educational Institute. Providing excellence in education for over 13 years."
    );

    return (
        <div ref={sectionRef} className="home-page-wrapper">
            <div className="reveal-on-scroll glass-panel" style={{ margin: '20px', overflow: 'hidden' }}>
                <Gallery />
            </div>

            <div className="reveal-on-scroll">
                <StudentSpotlight />
            </div>
            
            <div className="reveal-on-scroll delay-1 glass-panel" style={{ margin: '20px', padding: '20px' }}>
                <ChairmanMessage />
            </div>

            <AlumniHallOfFame />

            <div className="reveal-on-scroll">
                <LegacyTimeline />
            </div>

            <div className="reveal-on-scroll">
                <FacultyShowcase />
            </div>


            <div className="reveal-on-scroll">
                <AchievementGallery />
            </div>

            <div id="explore" className="reveal-on-scroll">
                <QuickLinks />
            </div>

            <div className="reveal-on-scroll">
                <GalleryVideo />
            </div>

            <div className="reveal-on-scroll">
                <OurStrength />
            </div>

            <div className="reveal-on-scroll">
                <ParentReviews />
            </div>

            <div className="reveal-on-scroll">
                <HomeInquirySection />
            </div>

            <div className="reveal-on-scroll">
                <ContactInfo />
            </div>

            <QuickInquiry />
        </div>
    );
}

export default Home;
