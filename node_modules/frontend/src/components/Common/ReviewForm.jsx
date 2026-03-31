import React, { useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import { useToast } from './Toaster';
import './ReviewForm.css';

const ReviewForm = ({ onClose, onSuccess }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    rating: 5,
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      mockApi.addReview(formData);
      showToast('Review submitted successfully! Thank you.', 'success');
      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="review-form-overlay" onClick={onClose}>
      <div className="review-form-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="form-header">
          <h2>Submit Your Review</h2>
          <p>We value your feedback and experience at NSGI.</p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Name (आपका नाम) *</label>
            <input
              type="text"
              placeholder="e.g. Rajesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Relation / Location (संबंध / क्षेत्र)</label>
            <input
              type="text"
              placeholder="e.g. Father of Aryan (Class 8) or Civil Lines"
              value={formData.relation}
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Rating (रेटिंग)</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${formData.rating >= star ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Your Feedback (आपकी राय) *</label>
            <textarea
              placeholder="Tell us about your experience..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows="4"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
