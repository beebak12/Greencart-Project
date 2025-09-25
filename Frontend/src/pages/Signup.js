// Signup.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
      // Here you would typically send data to your backend
      alert('Signup successful!');
    } else {
      setErrors(formErrors);
    }
  };

  const handleFarmerSignin = () => {
    navigate('/farmersignin');
  };
// Function to handle the "Sign in" link click
  const handleSigninClick = () => {
    navigate('/signin');
  };
   // Function to handle direct navigation to signin
  const handleSignupButtonClick = () => {
    navigate('/signin');
  };

  return (
    <div>
      <Navbar />
    
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="logo">GreenCart</h1>
          <p className="tagline">Fresh Products From Real Farmers</p>
        </div>

        <div className="signup-content"> {/* Fixed: className instead of classname */}
          <div className="signup-form-container">
            <h2 className="form-title">Create Customer Account</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Phone no."
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Removed the role validation since you don't have role inputs */}

              <button type="submit" 
              className="signup-button"
              onClick={handleSignupButtonClick}
              >Sign up</button>
            </form>

             <div className="signin-link">
                    Already have an account? 
                     <span className="signin-link-text" onClick={handleSigninClick}>
                     Sign in
                     </span>
                </div>
               </div>

          {/* Farmer Login Button */}
          <div className="farmer-login-section">
            <div className="divider">
              <span>OR</span>
            </div>
            <button className="farmer-login-btn" onClick={handleFarmerSignin}>
              Login/Signup as a Farmer
            </button>
            <p className="farmer-description">
              Are you a farmer looking to sell your products? Join our platform to reach more customers and grow your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;