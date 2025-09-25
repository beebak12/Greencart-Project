import React, { useState } from 'react';
import './Feedback.css';
import Navbarr from '../components/common/Navbarr';
import { API_ENDPOINTS } from '../api/config';

const Feedback = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNo: '',
    email: '',
    address: '',
    feedback: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email)) {
    alert('Please enter a valid email address');
    setIsSubmitting(false);
    return;
  }
  
  try {
    // Send to backend server
    const response = await fetch(API_ENDPOINTS.FEEDBACK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      alert(data.message);
      
      // Reset form
      setFormData({
        fullName: '',
        phoneNo: '',
        email: '',
        address: '',
        feedback: ''
      });
    } else {
      throw new Error(data.message || 'Failed to send feedback');
    }
  } catch (error) {
    console.error('Error sending feedback:', error);
    alert(error.message || 'There was an error sending your feedback. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="feedback-page">
      <Navbarr />
      
      <div className="feedback-container">
        <div className="feedback-header">
          <h1 className="feedback-title">We Value Your Feedback</h1>
          <p className="feedback-subtitle">Your opinion helps us improve our services</p>
        </div>
        
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number *</label>
            <input
              type="tel"
              id="phoneNo"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter your address"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="feedback">Your Feedback *</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Please share your thoughts, suggestions, or concerns..."
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;