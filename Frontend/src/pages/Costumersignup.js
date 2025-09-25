import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/common/Header';
import './Costumersignup.css';

const Costumersignup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    preferences: [],
    newsletter: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const preferencesList = [
    'Vegetables',
    'Fruits',
    'Dairy Products',
    'Organic Items',
    'Bakery',
    'Meat & Poultry',
    'Seafood',
    'Beverages'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePreferenceChange = (preference) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/customer/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            password: formData.password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Signup failed');
        }
        alert('Welcome to GreenCart! Your account has been created successfully.');
      } catch (err) {
        alert(err.message);
        setIsSubmitting(false);
        return;
      }
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        preferences: [],
        newsletter: false
      });
      setIsSubmitting(false);
      navigate('/signin'); // Redirect to login page after successful signup
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <Header/>
    
    <div className="consumer-signup-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="floating-item grocery-bag">🛍</div>
        <div className="floating-item apple">🍎</div>
        <div className="floating-item milk">🥛</div>
        <div className="floating-item bread">🍞</div>
        <div className="floating-item leaf">🌿</div>
        <div className="floating-item avocado">🥑</div>
        <div className="floating-item berry">🍓</div>
        <div className="floating-item citrus">🍊</div>
      </div>

      <div className="signup-wrapper">
        {/* Left Side - Branding */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="logo">
              <span className="logo-icon">🛒</span>
              <h1>GreenCart</h1>
            </div>
            <h2>Fresh Products Delivered to Your Doorstep</h2>
            <p>Join thousands of happy customers enjoying fresh, locally sourced products from trusted farmers.</p>
            
            <div className="benefits">
              <div className="benefit">
                <span className="benefit-icon">🚚</span>
                <div>
                  <h4>Free Delivery</h4>
                  <p>On orders over Rs 800</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🌱</span>
                <div>
                  <h4>100% Fresh</h4>
                  <p>Direct from farms</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">⭐</span>
                <div>
                  <h4>Quality Guarantee</h4>
                  <p>Money-back promise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          <div className="form-container">
            <div className="form-header">
              <h3>Join GreenCart Today</h3>
              <p>Create your account and start shopping fresh</p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="fullName">
                  <span className="label-icon">👤</span>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="email">
                    <span className="label-icon">📧</span>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="phone">
                    <span className="label-icon">📱</span>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="+977 98XXXXXXX"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="address">
                  <span className="label-icon">🏠</span>
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter your complete delivery address"
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="password">
                    <span className="label-icon">🔒</span>
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Minimum 6 characters"
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    <span className="label-icon">✅</span>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Preferences Section (Optional) */}
              <div className="preferences-section">
                <label className="preferences-label">
                  <span className="label-icon">❤️</span>
                  Shopping Preferences (Optional)
                </label>
                <div className="preferences-grid">
                  {preferencesList.map((preference, index) => (
                    <label key={index} className="preference-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.preferences.includes(preference)}
                        onChange={() => handlePreferenceChange(preference)}
                      />
                      <span className="checkmark"></span>
                      {preference}
                    </label>
                  ))}
                </div>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <div className="custom-checkbox">
                    <input
                      type="checkbox"
                      name="newsletter"
                      checked={formData.newsletter}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span className="checkbox-text">
                    Send me updates about new products and special offers
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className={`signup-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🛒</span>
                    Create Consumer Account
                  </>
                )}
              </button>

              <div className="login-link">
                <p>Already have an account? <Link to="/Signin">Login here</Link></p>
              </div>

              <div className="terms">
                <p>By creating an account, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Costumersignup;