import React from 'react';
import Navbarr from '../components/common/Navbarr';
import './Aboutus.css';

const Aboutus = () => {
  return (
    <div>
    <Navbarr /> 
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About Us</h1>
      </div>
      
      <div className="about-us-content">
        <section className="intro-section">
          <p>
            Welcome to GreenCart, Nepal’s pioneering online organic marketplace—built for the farmers, 
            by the tech-savvy minds who believe in sustainable living.
          </p>
          
          <p>
            GreenCart is more than just a website; it’s a digital bridge connecting eco-conscious consumers 
            with dedicated organic farmers across the country. Our mission is to empower local farmers, 
            simplify access to fresh, chemical-free produce, and promote a healthier lifestyle through 
            transparency and trust.
          </p>
          
          <p>
            Born out of a vision to revolutionize how organic products are bought and sold in Nepal, 
            GreenCart offers a multi-vendor platform where verified farmers can list their fresh vegetables, 
            fruits, grains, and more—while customers enjoy real-time inventory, product traceability, 
            and meaningful reviews.
          </p>
        </section>
        
        <section className="why-choose-us">
          <h2>Why choose us?</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Direct Farmer Connection</h3>
              <p>We connect you directly with trusted local farmers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🥬</div>
              <h3>Fresh Produce</h3>
              <p>Enjoy the freshest organic vegetables and fruits</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Transparent Sourcing</h3>
              <p>Know exactly where your food comes from</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Eco-Friendly Packaging</h3>
              <p>Environmentally conscious packaging solutions</p>
            </div>
          </div>
          <p className="why-choose-summary">
            We connect you directly with trusted local farmers, offering fresh produce, 
            transparent sourcing, and eco-friendly packaging—making every purchase better 
            for you and the planet.
          </p>
        </section>
        
        <section className="how-to-order">
          <h2>How to order & payment</h2>
          <div className="order-steps">
            <div className="order-step">
              <div className="step-number">1</div>
              <p>Browse our wide selection of organic products</p>
            </div>
            <div className="order-step">
              <div className="step-number">2</div>
              <p>Add items to your cart</p>
            </div>
            <div className="order-step">
              <div className="step-number">3</div>
              <p>Proceed to checkout</p>
            </div>
          </div>
          <div className="payment-methods">
            <h3>We accept:</h3>
            <div className="payment-icons">
              <div className="payment-method">
                <div className="payment-icon">💳</div>
                <span>eSewa</span>
              </div>
              <div className="payment-method">
                <div className="payment-icon">📱</div>
                <span>Khalti</span>
              </div>
              <div className="payment-method">
                <div className="payment-icon">📲</div>
                <span>FonePay</span>
              </div>
              <div className="payment-method">
                <div className="payment-icon">🏦</div>
                <span>Mobile Banking</span>
              </div>
            </div>
          </div>
          <p className="messenger-note">
            Need help? You can also order via Messenger for a quick start.
          </p>
        </section>
        
        <section className="customer-support">
          <h2>Customer Support & assistance</h2>
          <div className="support-options">
            <div className="support-option">
              <h3>24/7 Support</h3>
              <p>Our support team is available 24/7 via Messenger and Instagram</p>
            </div>
            <div className="support-option">
              <h3>Email Support</h3>
              <p>For non-urgent queries or partnerships, reach us at <a href="mailto:greencart@email.com">greencart@email.com</a></p>
            </div>
            <div className="support-option">
              <h3>Fast & Friendly</h3>
              <p>We're here to help—fast, friendly, and always responsive</p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default Aboutus;