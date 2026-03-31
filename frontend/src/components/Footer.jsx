import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../assets/school-logo.png';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-container">
                    {/* School Branding */}
                    <div className="footer-col branding-col">
                        <Link to="/" className="footer-logo-box" onClick={scrollToTop}>
                            <img src={logo} alt="School Logo" className="footer-logo" />
                            <div className="footer-school-name">
                                <h3>SHRI JAGESHWAR MEMORIAL</h3>
                                <p>EDUCATIONAL INSTITUTE</p>
                            </div>
                        </Link>
                        <p className="footer-mission">
                            Our mission is to provide a quality education with global opportunities
                            for academic growth and development... <Link to="/about" className="read-more-link">Read More</Link>
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-icon fb"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="social-icon tw"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="social-icon ig"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="social-icon yt"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* Important Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Important Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/contact">Job Seeker</Link></li>
                            <li><Link to="/">Web Email</Link></li>
                            <li><Link to="/contact">Help?</Link></li>
                            <li><Link to="/">FAQs?</Link></li>
                        </ul>
                    </div>

                    {/* Our Links */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Our Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/vision-mission">Vision & Mission</Link></li>
                            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link to="/user-data-deletion">User Data Deletion</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Location Map */}
                    <div className="footer-col map-col">
                        <h4 className="footer-heading">Location Map</h4>
                        <div className="footer-map-box">
                            {/* Placeholder for Map - In a real app we'd use a Google Maps Embed */}
                            <div className="map-placeholder">
                                <div className="map-info">
                                    <strong>SHRI JAGESHWAR MEMORIAL...</strong>
                                    <p>Laxman Ganj, Tiloi, Amethi</p>
                                    <button className="open-maps-btn">Open in Maps <i className="fas fa-external-link-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="footer-bottom">
                <div className="footer-container bottom-container">
                    <p>&copy; {new Date().getFullYear()} Shri Jageshwar Memorial Educational Institute. All Rights Reserved.</p>
                    <button className="back-to-top" onClick={scrollToTop}>
                        <i className="fas fa-arrow-up"></i>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
