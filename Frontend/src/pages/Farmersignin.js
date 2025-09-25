import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Google from '../assets/icons/google.png';

import Header from '../components/common/Header';
import "./Farmersignin.css";
 
 
const Farmersignin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'email and password doesnot match please try again');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      navigate('/farmerdashboard');
    } catch (err) {
      alert('Login failed');
    }
  };
 
  const handleCostumerButtonClick = () => {
    navigate('/signin');
  };
  
  return (
    <div>
      <Header />
    
    <div className="login-container">
      <div className="login-box">
        <h2 className="welcome-text">Welcome to Greencart👋</h2>
        <p className="subtitle">
          Enter Farmers email and password
        </p>
 
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
 
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
 
          <div className="forgot">
            <button type="button" className="forgot-password-btn" onClick={() => alert('Password reset functionality will be implemented soon!')}>Forgot password?</button>
          </div>
 
          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>
 
        <div className="divider">
          <span>OR</span>
        </div>
 
        <div className="social-login">
          <button className="google-btn">
            <img src={Google} alt="Google" className="Google" width="30" height="30"/>
            Continue with Google
          </button>
          
        </div>
 
        <p className="signup-text">
          New to GreenCart? <button type="button" className="signup-link-btn" onClick={() => navigate('/farmersignup')}>Sign up</button>
        </p>
      </div>
      
  {/* Right side - farmer login */}
  <div className="loginfarmer-box">
    <h2>Continue as Costumer</h2>
    <button onClick={handleCostumerButtonClick} className="farmer-btn">
      Login
    </button>
  </div>
    </div>
    </div>
  );
};
 
export default Farmersignin;