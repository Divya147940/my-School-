import React, { useState } from 'react';
import './QuickInquiry.css';
import { useLanguage } from '../../context/LanguageContext';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../Common/Toaster';

const QuickInquiry = () => {
    const { language } = useLanguage();
    const { addToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            mockApi.submitInquiry(formData);
            addToast(language === 'hi' ? "आपका संदेश प्राप्त हुआ! हम जल्द ही संपर्क करेंगे।" : "Inquiry sent! We will contact you soon.", "success");
            setFormData({ name: '', phone: '', email: '', message: '' });
            setIsOpen(false);
        } catch (err) {
            addToast("Error sending inquiry.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button className="floating-inquiry-btn" onClick={() => setIsOpen(true)}>
                <span className="btn-icon">📩</span>
                <span className="btn-text">{language === 'hi' ? 'पूछताछ करें' : 'Quick Inquiry'}</span>
            </button>

            {isOpen && (
                <div className="inquiry-modal-overlay">
                    <div className="inquiry-modal-content glass-panel">
                        <button className="close-modal" onClick={() => setIsOpen(false)}>×</button>
                        <div className="inquiry-modal-header">
                            <h2>{language === 'hi' ? 'सम्पर्क करें' : 'Get in Touch'}</h2>
                            <p>{language === 'hi' ? 'अपना विवरण छोड़ें, हम आपसे संपर्क करेंगे।' : 'Leave your details, we will get back to you.'}</p>
                        </div>
                        <form onSubmit={handleSubmit} className="inquiry-form">
                            <div className="form-group">
                                <label>{language === 'hi' ? 'नाम' : 'Full Name'} *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{language === 'hi' ? 'फ़ोन नंबर' : 'Phone'} *</label>
                                    <input 
                                        type="tel" 
                                        required 
                                        pattern="[0-9]{10}"
                                        value={formData.phone} 
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="10-digit number"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email ID</label>
                                    <input 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>{language === 'hi' ? 'संदेश (वैकल्पिक)' : 'Message (Optional)'}</label>
                                <textarea 
                                    rows="3"
                                    value={formData.message} 
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder={language === 'hi' ? 'आप क्या पूछना चाहते हैं?' : 'Any specific question?'}
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-inquiry-btn" disabled={isSubmitting}>
                                {isSubmitting ? '...' : (language === 'hi' ? 'भेजें' : 'Send Message')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickInquiry;
