import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/common/Header';
import './Farmersignup.css';

const FarmerSignup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
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
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/farmer/signup`, {
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
      } catch (err) {
        toast.error(err.message || 'Signup failed');
        setIsSubmitting(false);
        return;
      }

      // Show success toast
      toast.success('🎉 Registration successful! Welcome to GreenCart.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      console.log('Form submitted:', formData);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
      });
      
      setIsSubmitting(false);
      
      // Navigate to farmer signin after 2 seconds
      setTimeout(() => {
        navigate('/farmersignin');
      }, 2000);
      
    } else {
      setErrors(newErrors);
      // Show error toast for validation errors
      toast.error('Please fix the errors in the form.', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate('/farmersignin');
  };

  return (
    <div>
      <Header/>
      <ToastContainer />
      
      <div className="greencart-signup-container">
        {/* Animated Background */}
        <div className="background-animation">
          <div className="floating-vegetable tomato">🍅</div>
          <div className="floating-vegetable carrot">🥕</div>
          <div className="floating-vegetable leaf">🥬</div>
          <div className="floating-vegetable corn">🌽</div>
          <div className="floating-vegetable avocado">🥑</div>
          <div className="floating-vegetable eggplant">🍆</div>
          <div className="floating-vegetable strawberry">🍓</div>
          <div className="floating-vegetable broccoli">🥦</div>
        </div>

        <div className="signup-wrapper">
          {/* Left Side - Branding */}
          <div className="brand-section">
            <div className="brand-content">
              <div className="logo">
                <span className="logo-icon">🌱</span>
                <h1>GreenCart</h1>
              </div>
              <h2>Fresh Products From Real Farmers</h2>
              <p>Join our community of farmers and connect directly with customers who value fresh, locally grown produce.</p>
              <div className="features">
                <div className="feature">
                  <span className="feature-icon">🚜</span>
                  <span>Direct Farmer Connections</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌿</span>
                  <span>100% Organic Products</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h3>Create Your Farmer Account</h3>
                <p>Start selling your fresh products today</p>
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

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="phone">
                      <span className="label-icon">📱</span>
                      Phone No. *
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
                    <span className="label-icon">📍</span>
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    placeholder="Enter your full address"
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

                {/* Terms and Conditions */}
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                      <span className="checkmark"></span>
                    </div>
                    <span className="checkbox-text">
                      I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a> *
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <span className="error-message">
                      <span className="error-icon">⚠</span>
                      {errors.agreeToTerms}
                    </span>
                  )}
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
                      <span className="btn-icon">🚜</span>
                      Sign up as Farmer
                    </>
                  )}
                </button>

                <div className="login-link">
                  <p>Already have an account? <Link to="/farmersignin" onClick={handleLoginClick}>Login here</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignup;