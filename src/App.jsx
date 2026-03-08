import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import Faculty from './pages/Faculty';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import VisionMission from './pages/VisionMission';
import SocialWork from './pages/SocialWork';
import Achievements from './pages/Achievements';
import Facilities from './pages/Facilities';
import Attendance from './pages/Attendance';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <TopBar />
        <Navbar />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/vision-mission" element={<VisionMission />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/social-work" element={<SocialWork />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
