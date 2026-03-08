import React, { useState } from 'react';
import './ContactPage.css';

function ContactPage() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);

        // Format message for WhatsApp
        const message = `*New Contact Inquiry*\n\n` +
            `*Name:* ${form.name}\n` +
            `*Phone:* ${form.phone}\n` +
            `*Email:* ${form.email || 'N/A'}\n` +
            `*Subject:* ${form.subject}\n` +
            `*Message:* ${form.message}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/919792799550?text=${encodedMessage}`;

        // Redirect to WhatsApp after a brief delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500);
    };

    const handleCall = () => {
        window.location.href = "tel:+919792799550";
    };

    return (
        <div className="cp-page">
            <div className="cp-hero">
                <h1>Contact Us</h1>
                <p>हमसे संपर्क करें — We'd Love to Hear From You</p>
            </div>

            <div className="cp-main">
                {/* Contact Info Cards */}
                <div className="cp-info-row">
                    <div className="cp-info-card">
                        <div className="cp-info-icon">📍</div>
                        <h3>पता / Address</h3>
                        <p>Laxman Ganj, Tiloi,</p>
                        <p>Amethi, Uttar Pradesh</p>
                    </div>
                    <div className="cp-info-card">
                        <div className="cp-info-icon">📞</div>
                        <h3>फ़ोन / Phone</h3>
                        <p><a href="tel:+919792799550">+91 9792799550</a></p>
                        <p>Mon - Sat: 8 AM - 2 PM</p>
                    </div>
                    <div className="cp-info-card">
                        <div className="cp-info-icon">✉️</div>
                        <h3>ईमेल / Email</h3>
                        <p><a href="mailto:divyanshiverma@gmail.com">divyanshiverma@gmail.com</a></p>
                        <p>24/7 Support</p>
                    </div>
                    <div className="cp-info-card">
                        <div className="cp-info-icon">🕐</div>
                        <h3>समय / Office Hours</h3>
                        <p>Monday - Saturday</p>
                        <p>8:00 AM - 2:00 PM</p>
                    </div>
                </div>

                {/* Form + Map Row */}
                <div className="cp-content-row">
                    {/* Contact Form */}
                    <div className="cp-form-section">
                        <h2>📩 Send us a Message</h2>
                        <span className="cp-form-sub">हमें संदेश भेजें</span>

                        {sent ? (
                            <div className="cp-success-msg">
                                <div className="cp-success-icon">✅</div>
                                <h3>Message Sent Successfully!</h3>
                                <p>आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।</p>
                                <button className="cp-send-another" onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }}>
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="cp-form" onSubmit={handleSubmit}>
                                <div className="cp-form-grid">
                                    <div className="cp-field">
                                        <label>Your Name / आपका नाम *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
                                    </div>
                                    <div className="cp-field">
                                        <label>Phone / फ़ोन *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone number" maxLength="10" required />
                                    </div>
                                    <div className="cp-field">
                                        <label>Email / ईमेल</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                                    </div>
                                    <div className="cp-field">
                                        <label>Subject / विषय *</label>
                                        <select name="subject" value={form.subject} onChange={handleChange} required>
                                            <option value="">-- Select --</option>
                                            <option value="admission">Admission Inquiry</option>
                                            <option value="fee">Fee Related</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="complaint">Complaint</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="cp-field cp-field-full">
                                    <label>Message / संदेश *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." rows="5" required></textarea>
                                </div>
                                <button type="submit" className="cp-submit-btn">📤 Send Message</button>
                            </form>
                        )}
                    </div>

                    {/* Map */}
                    <div className="cp-map-section">
                        <h2>📍 Our Location</h2>
                        <span className="cp-map-sub">हमारा स्थान</span>
                        <div className="cp-map-wrapper">
                            <iframe
                                title="School Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.5!2d81.58!3d26.25!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTiloi%2C%20Amethi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1"
                                width="100%"
                                height="400"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                        <div className="cp-directions">
                            <a href="https://maps.google.com/?q=Tiloi,Amethi,Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="cp-direction-btn">
                                🗺️ Get Directions
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Connect */}
                <div className="cp-quick-connect">
                    <h2>Quick Connect</h2>
                    <div className="cp-quick-buttons">
                        <button onClick={handleCall} className="cp-quick-btn cp-call">📞 Call Now</button>
                        <a href="https://wa.me/919792799550" target="_blank" rel="noopener noreferrer" className="cp-quick-btn cp-whatsapp">💬 WhatsApp</a>
                        <a href="mailto:divyanshiverma@gmail.com" className="cp-quick-btn cp-email">✉️ Email Us</a>
                        <a href="https://maps.google.com/?q=Tiloi,Amethi,Uttar+Pradesh" target="_blank" rel="noopener noreferrer" className="cp-quick-btn cp-map">📍 Directions</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
