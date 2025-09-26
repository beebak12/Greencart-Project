import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/common/Header';
import "./Signin.css";

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log("🔍 Sending login request to:", `${API_URL}/api/auth/login`);
      
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        })
      });

      console.log("✅ Response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Server error response:", errorText);
        
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          errorMessage = errorText || `Server error: ${res.status}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      console.log("📨 Response data:", data);

      if (data.success) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          if (data.user) {
            localStorage.setItem('userData', JSON.stringify(data.user));
          }
          
          toast.success('🎉 Login successful! Redirecting...', {
            position: "top-right",
            autoClose: 3000,
          });
          
          setTimeout(() => {
            navigate('/home');
          }, 2000);
        } else {
          toast.warn('⚠️ Login successful but no token received', {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } else {
        toast.error(data.message || '❌ Login failed. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error('❌ Login error details:', err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        toast.error('🔌 Cannot connect to server. Please check if the backend is running on http://localhost:5000', {
          position: "top-right",
          autoClose: 6000,
        });
      } else {
        toast.error(`❌ ${err.message || 'Login failed. Please try again.'}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFarmerButtonClick = () => {
    toast.info('👨‍🌾 Redirecting to farmer login...', {
      position: "top-right",
      autoClose: 2000,
    });
    
    setTimeout(() => {
      navigate('/farmersignin');
    }, 1000);
  };

  return (
    <div>
      <Header />
      
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
          <h2 className="welcome-text">Welcome to Greencart</h2>
          <h3 className="customer-text">Customer login</h3>
          <p className="subtitle">
            Support your local farmers by purchasing the products
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="paudelbeebak11@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                className={errors.password ? 'error' : ''}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span> 
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <p className="signup-text">
            New to GreenCart? <Link to="/costumersignup" className="signup-link">Sign up</Link>
          </p>    
        </div>

        <div className="loginfarmer-box">
          <h2>Continue as Farmer</h2>
          <p className="farmer-subtitle">Are you a farmer? Login to your account</p>
          <button onClick={handleFarmerButtonClick} className="farmer-btn">
            Farmer Login/Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;