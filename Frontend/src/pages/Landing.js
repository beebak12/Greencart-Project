import React from 'react';
import Header from '../components/common/Header.js';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

  // Corrected imports in Landing.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faShoppingCart, faLeaf, faTruck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const LandingPage = () => {
const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  const handleStartShopping = () => {
    navigate('/Signin');
  };

  


  return (
    <div>
      <Header/>
   
    <div className="landing-container"> 
       <h1>Welcome to GREENCART </h1>
       <h2>Online Organic Marketplace</h2>
      {/* Hero Section */}
      <section className="hero-section">
       
        <div className="hero-content">
          <h1>Fresh, Organic Produce Direct from Local Farmers</h1>
          <p>Support local agriculture while enjoying the freshest, most nutritious fruits vegetables and grains delivered to your doorstep within 24 hrs of order.</p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleShopNow}>
              <FontAwesomeIcon icon={faShoppingCart}  /> Shop Now
            </button>
            <button className="secondary-btn" onClick={handleLearnMore} >
              Learn More <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div> 
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Fresh organic vegetables"  />
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="impact-section">
        <div className="impact-content">
          <div className="impact-text">
            <h2>Your Purchase Makes a Difference</h2>
            <p>When you shop with GreenCart, you're not just getting fresh produce - you're supporting local farmers and sustainable agriculture practices in your community.</p>
            <ul>
              <li>Direct support to family farms</li>
              <li>Reduced carbon footprint from shorter transportation</li>
              <li>Preservation of local farmland</li>
              <li>Strengthened local economy</li>
            </ul>
          </div>
          <div className="impact-image">
            <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Happy local farmer" />
          </div>
        </div>
      </section>
      
      
      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to experience farm-fresh goodness?</h2>
          <p>Join thousands of satisfied customers who choose GreenCart for their daily produce needs</p>
          <button className="primary-btn"  onClick={handleStartShopping}>Start Shopping</button>
        </div>
      </section>

      
    </div>
     </div>
  );
};

export default LandingPage;