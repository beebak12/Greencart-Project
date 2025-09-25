import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Google from '../assets/icons/google.png';
import Header from '../components/common/Header';
import "./Farmersignin.css";

const Farmersignin = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/farmer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || '❌ Email and password do not match. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      toast.success('🎉 Login successful! Redirecting to dashboard...', {
        position: "top-right",
        autoClose: 3000,
      });
      
      setTimeout(() => {
        navigate('/farmerdashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Login error:', err);
      toast.error('🌐 Network error. Please check your connection and try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCostumerButtonClick = () => {
    toast.info('🛒 Redirecting to customer login...', {
      position: "top-right",
      autoClose: 2000,
    });
    
    setTimeout(() => {
      navigate('/signin');
    }, 1000);
  };

  const handleForgotPassword = () => {
    toast.info('🔒 Password reset functionality will be implemented soon!', {
      position: "top-right",
      autoClose: 4000,
    });
  };

  return (
    <div>
      <Header />
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    
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
                disabled={loading}
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <div className="forgot">
              <button 
                type="button" 
                className="forgot-password-btn" 
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          

          <p className="signup-text">
            New to GreenCart?{' '}
            <button 
              type="button" 
              className="signup-link-btn" 
              onClick={() => navigate('/farmersignup')}
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </div>
        
        {/* Right side - customer login */}
        <div className="loginfarmer-box">
          <h2>Continue as Customer</h2>
          <button 
            onClick={handleCostumerButtonClick} 
            className="farmer-btn"
            disabled={loading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Farmersignin;