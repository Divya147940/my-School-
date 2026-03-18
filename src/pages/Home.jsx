import useScrollReveal from '../hooks/useScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import Gallery from '../components/Gallery';
import AchievementGallery from '../components/Common/AchievementGallery';
import ChairmanMessage from '../components/ChairmanMessage';
import QuickLinks from '../components/QuickLinks';
import GalleryVideo from '../components/GalleryVideo';
import OurStrength from '../components/OurStrength';
import ParentReviews from '../components/ParentReviews';
import ContactInfo from '../components/ContactInfo';

function Home() {
    const { t } = useLanguage();
    const sectionRef = useScrollReveal({ threshold: 0.1 });

    return (
        <div ref={sectionRef} className="home-page-wrapper">
            <div className="reveal-on-scroll">
                <Gallery />
            </div>
            
            <div className="reveal-on-scroll delay-1">
                <ChairmanMessage />
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
                <ContactInfo />
            </div>
        </div>
    );
}

export default Home;
