import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Aboutusvideo from '../assets/images/aboutusvideo.mp4';
import Header from '../components/common/Header.js';
import './About.css'; // Fixed CSS import

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false); // Added missing state

  const handleStartShopping = () => {
    navigate('/signin');
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div>
      <Header/>
      <div className={`about-us-container ${isVisible ? 'fade-in' : ''}`}>
        {/* Hero Section */}
        <div className="about-hero">
          <div className="hero-content">
            <h1>About GreenCart</h1>
            <p className="hero-subtitle">Nepal's Premier Organic Marketplace</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Local Farmers</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Organic Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-element element-1">🥬</div>
              <div className="floating-element element-2">🍎</div>
              <div className="floating-element element-3">🌾</div>
              <div className="floating-element element-4">🥕</div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                Welcome to <span className="highlight">GreenCart</span>, Nepal's pioneering online organic marketplace—built
                for the farmers, by the tech-savvy minds who believe in sustainable living.
              </p>
              <p>
                GreenCart is more than just a website; it's a digital bridge connecting
                eco-conscious consumers with dedicated organic farmers across the country. 
                Our mission is to empower local farmers, simplify access to fresh,
                chemical-free produce, and promote a healthier lifestyle through transparency
                and trust.
              </p>
              <p>
                Born out of a vision to revolutionize how organic products are bought and
                sold in Nepal, GreenCart offers a multi-vendor platform where verified
                farmers can list their fresh vegetables, fruits, grains, and more—while
                customers enjoy real-time inventory, product traceability, and meaningful
                reviews.
              </p>
            </div>
            <div className="mission-video">
              <div className="video-container">
                <video src={Aboutusvideo} autoPlay loop muted playsInline />
                <div className="video-overlay"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="why-choose-us">
          <div className="section-header">
            <h2>Why Choose GreenCart?</h2>
            <p>We're committed to making organic living accessible to everyone</p>
          </div>
          
          <div className="feature-cards">
            <div className="feature-card" style={{animationDelay: '0.1s'}}>
              <div className="feature-icon">🌱</div>
              <h3>Direct Farmer Connection</h3>
              <p>We connect you directly with trusted local farmers, eliminating middlemen</p>
            </div>
            <div className="feature-card" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">🥬</div>
              <h3>Farm-Fresh Produce</h3>
              <p>Enjoy the freshest organic vegetables and fruits delivered to your doorstep</p>
            </div>
            <div className="feature-card" style={{animationDelay: '0.3s'}}>
              <div className="feature-icon">🔍</div>
              <h3>Transparent Sourcing</h3>
              <p>Know exactly where your food comes from with our farm-to-table tracking</p>
            </div>
            <div className="feature-card" style={{animationDelay: '0.4s'}}>
              <div className="feature-icon">🌍</div>
              <h3>Eco-Friendly Packaging</h3>
              <p>Environmentally conscious packaging solutions that reduce waste</p>
            </div>
            <div className="feature-card" style={{animationDelay: '0.5s'}}>
              <div className="feature-icon">💚</div>
              <h3>Health Guarantee</h3>
              <p>100% certified organic products for your family's health and wellness</p>
            </div>
            <div className="feature-card" style={{animationDelay: '0.6s'}}>
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery service across major cities in Nepal</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>How GreenCart Works</h2>
            <p>Simple steps to get fresh organic products</p>
          </div>
          
          <div className="process-steps">
            <div className="process-step">
              <div className="step-visual">
                <div className="step-number">1</div>
                <div className="step-icon">🛒</div>
              </div>
              <h3>Browse & Select</h3>
              <p>Explore our wide selection of certified organic products</p>
            </div>
            
            <div className="process-connector"></div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-number">2</div>
                <div className="step-icon">📦</div>
              </div>
              <h3>Add to Cart</h3>
              <p>Select your items and add them to your shopping cart</p>
            </div>
            
            <div className="process-connector"></div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-number">3</div>
                <div className="step-icon">💳</div>
              </div>
              <h3>Secure Checkout</h3>
              <p>Complete your purchase with our secure payment options</p>
            </div>
            
            <div className="process-connector"></div>
            
            <div className="process-step">
              <div className="step-visual">
                <div className="step-number">4</div>
                <div className="step-icon">🚚</div>
              </div>
              <h3>Fast Delivery</h3>
              <p>Receive your fresh organic products at your doorstep</p>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="payment-section">
          <div className="section-header">
            <h2>Secure Payment Options</h2>
            <p>We accept all popular payment methods in Nepal</p>
          </div>
          
          <div className="payment-methods">
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
            <div className="payment-method">
              <div className="payment-icon">💵</div>
              <span>Cash on Delivery</span>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="support-section">
          <div className="support-content">
            <div className="support-text">
              <h2>24/7 Customer Support</h2>
              <p>Our dedicated support team is always here to help you with any questions or concerns.</p>
              
              <div className="support-channels">
                <div className="support-channel">
                  <div className="channel-icon">💬</div>
                  <div>
                    <h4>Messenger & Instagram</h4>
                    <p>24/7 instant messaging support</p>
                  </div>
                </div>
                
                <div className="support-channel">
                  <div className="channel-icon">📧</div>
                  <div>
                    <h4>Email Support</h4>
                    <p><a href="mailto:greencart@email.com">greencart@email.com</a></p>
                  </div>
                </div>
                
                <div className="support-channel">
                  <div className="channel-icon">📞</div>
                  <div>
                    <h4>Phone Support</h4>
                    <p>+977-1-XXXXXXX (9AM-6PM)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="support-visual">
              <div className="support-graphic">
                <div className="graphic-element">💚</div>
                <div className="graphic-element">🌱</div>
                <div className="graphic-element">🥬</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Go Organic?</h2>
            <p>Join thousands of satisfied customers who trust GreenCart for their daily organic needs</p>
            <button className="cta-button" onClick={handleStartShopping}>Start Shopping Now</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;