import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import greencartLogo from '../../assets/icons/greencart-logo.png';
import { FaShoppingCart, FaUser, FaTimes, FaBars } from "react-icons/fa";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    // Mobile menu scroll lock
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.classList.remove('no-scroll');
    };
  }, [mobileMenuOpen]);

  // Navigation handlers
  const navigateToHome = () => {
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navigateToProducts = () => {
    navigate('/products');
    setMobileMenuOpen(false);
  };

  const navigateToContact = () => {
    navigate('/contact');
    setMobileMenuOpen(false);
  };

  const navigateToAbout = () => {
    navigate('/about');
    setMobileMenuOpen(false);
  };

  const navigateToLogin = () => {
    navigate('/signin');
    setMobileMenuOpen(false);
  };

  // Check active link
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`landing-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src={greencartLogo} 
              alt="GreenCart Logo" 
              className="logo-image" 
              onClick={navigateToHome}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}>
          <a 
            className={isActiveLink('/') ? 'active' : ''}
            onClick={navigateToHome}
          >
            Home
          </a>
          <a 
            className={isActiveLink('/products') ? 'active' : ''}
            onClick={navigateToProducts}
          >
            Products
          </a>
          <a 
            className={isActiveLink('/contact') ? 'active' : ''}
            onClick={navigateToContact}
          >
            Contact Us
          </a>
          <a 
            className={isActiveLink('/about') ? 'active' : ''}
            onClick={navigateToAbout}
          >
            About Us
          </a>
          <a 
            className={isActiveLink('/signin') ? 'active' : ''}
            onClick={navigateToLogin}
          >
            <FaUser style={{ marginRight: '8px' }} />
            Login
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}