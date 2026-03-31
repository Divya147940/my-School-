import React, { useState } from 'react';
import './HomeInquirySection.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const HomeInquirySection = () => {
    const { language } = useLanguage();
    const { addToast } = useToast();
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            mockApi.submitInquiry(formData);
            addToast(language === 'hi' ? "आपका संदेश प्राप्त हुआ! हम जल्द ही संपर्क करेंगे।" : "Message sent! Our team will contact you soon.", "success");
            setFormData({ name: '', phone: '', email: '', message: '' });
        } catch (err) {
            addToast("Error sending message.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="home-inquiry-section">
            <div className="inquiry-container glass-panel">
                <div className="inquiry-content">
                    <div className="text-side">
                        <span className="inquiry-tag">{language === 'hi' ? 'सीधे संपर्क करें' : 'DIRECT CONNECT'}</span>
                        <h2 className="inquiry-h2">
                            {language === 'hi' ? 'कोई सवाल है? हमें लिखें' : 'Have Questions? Message Us Directly'}
                        </h2>
                        <p className="inquiry-p">
                            {language === 'hi' 
                                ? 'अपना विवरण भरें, हमारे शिक्षा विशेषज्ञ आपसे 24 घंटे के भीतर संपर्क करेंगे।' 
                                : 'Fill in your details, and our education experts will get back to you within 24 hours.'}
                        </p>
                        <div className="inquiry-features">
                            <div className="i-feat"><span>✅</span> {language === 'hi' ? 'त्वरित प्रतिक्रिया' : 'Fast Response'}</div>
                            <div className="i-feat"><span>✅</span> {language === 'hi' ? 'विशेषज्ञ सलाह' : 'Expert Counseling'}</div>
                            <div className="i-feat"><span>✅</span> {language === 'hi' ? 'कैंपस गाइड' : 'Campus Guide'}</div>
                        </div>
                    </div>

                    <div className="form-side">
                        <form onSubmit={handleSubmit} className="home-inq-form">
                            <input 
                                type="text" 
                                placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'} 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                            <div className="i-form-row">
                                <input 
                                    type="tel" 
                                    placeholder={language === 'hi' ? 'फ़ोन नंबर' : 'Phone Number'} 
                                    required
                                    pattern="[0-9]{10}"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                                <input 
                                    type="email" 
                                    placeholder={language === 'hi' ? 'ईमेल आईडी' : 'Email Address'} 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <textarea 
                                placeholder={language === 'hi' ? 'आप क्या पूछना चाहते हैं?' : 'Your Message / Question'} 
                                rows="3"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                            <button type="submit" className="i-submit-btn" disabled={isSubmitting}>
                                {isSubmitting ? '...' : (language === 'hi' ? 'अभी संदेश भेजें' : 'Send Message Now')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeInquirySection;
