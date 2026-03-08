import React, { useState } from 'react';
import './Admissions.css';

function Admissions() {
    const [formData, setFormData] = useState({
        studentName: '',
        fatherName: '',
        motherName: '',
        dob: '',
        gender: '',
        aadhar: '',
        classApplied: '',
        previousSchool: '',
        address: '',
        phone: '',
        email: '',
        category: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};

        // Aadhaar Validation (12 digits)
        if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar.replace(/-/g, ''))) {
            newErrors.aadhar = 'Invalid Aadhaar: Please enter a 12-digit number.';
        }

        // Phone Validation (exactly 10 digits)
        if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Invalid Phone: Please enter exactly 10 digits.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/admissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
                setShowPayment(true);

                // Format message for WhatsApp
                const message = `*New Admission Inquiry*\n\n` +
                    `*Student:* ${formData.studentName}\n` +
                    `*Father:* ${formData.fatherName}\n` +
                    `*Mother:* ${formData.motherName}\n` +
                    `*DOB:* ${formData.dob}\n` +
                    `*Gender:* ${formData.gender}\n` +
                    `*Aadhar:* ${formData.aadhar || 'N/A'}\n` +
                    `*Class:* ${formData.classApplied}\n` +
                    `*Phone:* ${formData.phone}\n` +
                    `*Address:* ${formData.address}`;

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/918009799550?text=${encodedMessage}`;

                // Redirect to WhatsApp after a brief delay
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 1500);

                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
                alert("Failed to submit admission form to server.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("An error occurred. Please try again later.");
        }
    };

    const feeStructure = [
        { class: 'Nursery - UKG', fee: '₹12,000' },
        { class: 'Class 1 - 5', fee: '₹15,000' },
        { class: 'Class 6 - 8', fee: '₹18,000' },
        { class: 'Class 9 - 10', fee: '₹22,000' },
    ];

    return (
        <div className="adm-page">
            {/* Hero */}
            <div className="adm-hero">
                <h1>Admissions Open 2025-26</h1>
                <p>प्रवेश प्रारंभ — Secure Your Child's Future Today</p>
            </div>

            <div className="adm-main">
                {/* Info Section */}
                <div className="adm-info-section">
                    <div className="adm-info-card">
                        <h3>📋 प्रवेश प्रक्रिया</h3>
                        <ul>
                            <li>नीचे दिया गया फॉर्म भरें</li>
                            <li>आवश्यक दस्तावेज़ जमा करें</li>
                            <li>फीस का भुगतान करें</li>
                            <li>प्रवेश की पुष्टि प्राप्त करें</li>
                        </ul>
                    </div>
                    <div className="adm-info-card">
                        <h3>📄 आवश्यक दस्तावेज़</h3>
                        <ul>
                            <li>आधार कार्ड (छात्र व अभिभावक)</li>
                            <li>जन्म प्रमाण पत्र</li>
                            <li>पिछली कक्षा की मार्कशीट</li>
                            <li>Transfer Certificate (TC)</li>
                            <li>2 पासपोर्ट साइज़ फोटो</li>
                        </ul>
                    </div>
                    <div className="adm-info-card">
                        <h3>💰 शुल्क संरचना</h3>
                        <table className="adm-fee-table">
                            <thead>
                                <tr><th>Class</th><th>Annual Fee</th></tr>
                            </thead>
                            <tbody>
                                {feeStructure.map((item, i) => (
                                    <tr key={i}><td>{item.class}</td><td>{item.fee}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Admission Form */}
                <div className="adm-form-section">
                    <h2>📝 Admission Form / प्रवेश फॉर्म</h2>
                    <span className="adm-form-subtitle">Fill all details carefully / सभी जानकारी सही-सही भरें</span>

                    <form className="adm-form" onSubmit={handleSubmit}>
                        <div className="adm-form-grid">
                            <div className="adm-field">
                                <label>Student Name / विद्यार्थी का नाम *</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student's full name" required />
                            </div>
                            <div className="adm-field">
                                <label>Father's Name / पिता का नाम *</label>
                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father's name" required />
                            </div>
                            <div className="adm-field">
                                <label>Mother's Name / माता का नाम *</label>
                                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother's name" required />
                            </div>
                            <div className="adm-field">
                                <label>Date of Birth / जन्म तिथि *</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                            </div>
                            <div className="adm-field">
                                <label>Gender / लिंग *</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">-- Select --</option>
                                    <option value="male">Male / पुरुष</option>
                                    <option value="female">Female / महिला</option>
                                    <option value="other">Other / अन्य</option>
                                </select>
                            </div>
                            <div className="adm-field">
                                <label>Aadhar Number / आधार नंबर</label>
                                <input type="text" name="aadhar" value={formData.aadhar} onChange={handleChange} placeholder="XXXX-XXXX-XXXX" maxLength="12" />
                                {errors.aadhar && <span className="error-text">{errors.aadhar}</span>}
                            </div>
                            <div className="adm-field">
                                <label>Class Applied For / कक्षा *</label>
                                <select name="classApplied" value={formData.classApplied} onChange={handleChange} required>
                                    <option value="">-- Select Class --</option>
                                    <option value="nursery">Nursery</option>
                                    <option value="lkg">LKG</option>
                                    <option value="ukg">UKG</option>
                                    <option value="1">Class 1</option>
                                    <option value="2">Class 2</option>
                                    <option value="3">Class 3</option>
                                    <option value="4">Class 4</option>
                                    <option value="5">Class 5</option>
                                    <option value="6">Class 6</option>
                                    <option value="7">Class 7</option>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                </select>
                            </div>
                            <div className="adm-field">
                                <label>Category / वर्ग</label>
                                <select name="category" value={formData.category} onChange={handleChange}>
                                    <option value="">-- Select --</option>
                                    <option value="general">General / सामान्य</option>
                                    <option value="obc">OBC / अन्य पिछड़ा वर्ग</option>
                                    <option value="sc">SC / अनुसूचित जाति</option>
                                    <option value="st">ST / अनुसूचित जनजाति</option>
                                </select>
                            </div>
                            <div className="adm-field">
                                <label>Previous School / पिछला विद्यालय</label>
                                <input type="text" name="previousSchool" value={formData.previousSchool} onChange={handleChange} placeholder="Previous school name (if any)" />
                            </div>
                            <div className="adm-field">
                                <label>Phone Number / फ़ोन नंबर *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength="10" required />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>
                            <div className="adm-field">
                                <label>Email / ईमेल</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" />
                            </div>
                        </div>
                        <div className="adm-field adm-field-full">
                            <label>Full Address / पूरा पता *</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete address with pincode" rows="3" required></textarea>
                        </div>

                        <button type="submit" className="adm-submit-btn">
                            {submitted ? '✅ Form Submitted Successfully!' : '📤 Submit Admission Form'}
                        </button>
                    </form>
                </div>

                {/* Payment Section */}
                {showPayment && (
                    <div className="adm-payment-section">
                        <h2>💳 Payment / शुल्क भुगतान</h2>
                        <span className="adm-payment-subtitle">Choose your preferred payment method</span>

                        <div className="adm-payment-summary">
                            <div className="adm-payment-detail">
                                <span>Student Name:</span>
                                <strong>{formData.studentName}</strong>
                            </div>
                            <div className="adm-payment-detail">
                                <span>Class Applied:</span>
                                <strong>{formData.classApplied?.toUpperCase() || 'N/A'}</strong>
                            </div>
                            <div className="adm-payment-detail">
                                <span>Phone:</span>
                                <strong>{formData.phone}</strong>
                            </div>
                        </div>

                        <div className="adm-payment-methods">
                            <div className="adm-pay-card">
                                <div className="adm-pay-icon">🏦</div>
                                <h3>Bank Transfer</h3>
                                <div className="adm-bank-details">
                                    <p><strong>Bank:</strong> State Bank of India</p>
                                    <p><strong>A/C Name:</strong> Shri Jageshwar Memorial Educational Institute</p>
                                    <p><strong>A/C No:</strong> XXXXXXXXXXXX</p>
                                    <p><strong>IFSC:</strong> SBIN0XXXXXX</p>
                                </div>
                            </div>

                            <div className="adm-pay-card">
                                <div className="adm-pay-icon">📱</div>
                                <h3>UPI Payment</h3>
                                <div className="adm-upi-box">
                                    <div className="adm-upi-id">
                                        <span>UPI ID:</span>
                                        <strong>sjmei@sbi</strong>
                                    </div>
                                    <p className="adm-upi-note">Google Pay, PhonePe, Paytm या किसी भी UPI app से भुगतान करें</p>
                                </div>
                            </div>

                            <div className="adm-pay-card">
                                <div className="adm-pay-icon">💵</div>
                                <h3>Cash Payment</h3>
                                <div className="adm-cash-info">
                                    <p>विद्यालय कार्यालय में सीधे नकद भुगतान करें</p>
                                    <p><strong>समय:</strong> सोमवार - शनिवार, 9:00 AM - 3:00 PM</p>
                                    <p><strong>कार्यालय:</strong> Main Office, Ground Floor</p>
                                </div>
                            </div>
                        </div>

                        <div className="adm-payment-note">
                            <p>⚠️ <strong>नोट:</strong> भुगतान करने के बाद रसीद अवश्य प्राप्त करें। ऑनलाइन भुगतान का स्क्रीनशॉट कार्यालय में दिखाएं।</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admissions;
