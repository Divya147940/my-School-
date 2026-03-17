import React from 'react';
import Gallery from '../components/Gallery';
import ChairmanMessage from '../components/ChairmanMessage';
import QuickLinks from '../components/QuickLinks';
import GalleryVideo from '../components/GalleryVideo';
import OurStrength from '../components/OurStrength';
import ParentReviews from '../components/ParentReviews';
import ContactInfo from '../components/ContactInfo';

function Home() {
    return (
        <>
            <Gallery />
            <ChairmanMessage />
            <div id="explore">
              <QuickLinks />
            </div>
            <GalleryVideo />
            <OurStrength />
            <ParentReviews />
            <ContactInfo />
        </>
    );
}

export default Home;
