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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import UserDataDeletion from './pages/UserDataDeletion';
import Login from './pages/Login';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Careers from './pages/Careers';
import AIChatbot from './components/Common/AIChatbot';
import AnnouncementTicker from './components/Common/AnnouncementTicker';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <AnnouncementTicker />
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
            <Route path="/login" element={<Login />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/user-data-deletion" element={<UserDataDeletion />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;
