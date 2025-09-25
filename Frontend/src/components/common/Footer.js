// src/components/common/Footer.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
// Import your icons - adjust paths as needed
import emailIcon from '../../assets/icons/email.png';
import phoneIcon from '../../assets/icons/call-logo.png';
import locationIcon from '../../assets/icons/map-logo.png';


import facebookIcon from '../../assets/icons/fb-icon.jpg';
import instagramIcon from '../../assets/icons/insta.webp';
import twitterIcon from '../../assets/icons/twitter.jpg';

const Footer = () => {
  const navigate = useNavigate();

    const handleHomeClick = () => {
    navigate('/home');
  };
  const handleAboutusClick = () => {
    navigate('/aboutus');
  };

  const handleContactusClick = () => {
    navigate('/contact');
  };

    const handleFeedbackClick = () => {
    navigate('/feedback');
  };





  return (
    <footer className="footer">
      <div className="footer-content">
        <table className="footer-table">
          <tr>
            <td> 
              <div className="footer-section">
                <h4>Contact Info</h4>
                <div className="contact-item">
                  <img src={emailIcon} alt="Email" className="footer-icon" />
                  <a href="mailto:paudelbeebak11@gmail.com">paudelbeebak11@gmail.com</a>
                </div>
                <div className="contact-item">
                  <img src={phoneIcon} alt="Phone" className="footer-icon" />
                  <a href="tel:+9779816114601">+977 9816114601</a>
                </div>
                <div className="contact-item">
                  <img src={locationIcon} alt="Location" className="footer-icon" />
                       <a 
                         href="https://www.google.com/maps/place/Oxford+College+of+Engineering+and+Management/@27.7022127,84.4177436,17.71z/data=!4m6!3m5!1s0x3994fb423960c6a7:0xdb08a9095e14a464!8m2!3d27.7023597!4d84.4189374!16s%2Fm%2F011spy7j?entry=ttu" 
                              target="_blank"  rel="noopener noreferrer">
                           Oxford College of Engineering and Management, Bharatpur, Nepal
                         </a>
                </div>
              </div>
            </td>

            <td> 
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li className="link-item"> <a href="/home" onClick={handleHomeClick}>Home</a> </li>
                  <li className="link-item"><a href="/products" >Products</a> </li>
                  <li className="link-item"><a href="/about" onClick={handleAboutusClick}>About Us</a> </li>
                  <li className="link-item"><a href="/contact" onClick={handleContactusClick}>Contact</a> </li>
                  <li className="link-item"><a href="/feedback" onClick={handleFeedbackClick}> Feedback</a> </li>
                </ul>
              </div>
            </td>
            
            <td> 
              <div className="footer-section">
                <h4>Follow Us</h4>
                <ul>
                  <li className="link-item">
                    <img src={facebookIcon} alt="Facebook" className="footer-icon" />
                    <a href="https://www.facebook.com/bibek.poudel.897433">Facebook</a>
                  </li>
                  <li className="link-item">
                    <img src={instagramIcon} alt="Instagram" className="footer-icon" />
                    <a href="https://www.instagram.com/bibekpoudel6142/">Instagram</a>
                  </li>
                  <li className="link-item">
                    <img src={twitterIcon} alt="Twitter" className="footer-icon" />
                    <a href="https://twitter.com/greencart" target="_blank" rel="noopener noreferrer">Twitter</a>
                  </li>
                </ul>
              </div> 
            </td>
          </tr>

          <tr>
            <td colSpan={3}>
              <div className="footer-section">
                <h3>GreenCart</h3>
                <p>Your trusted online organic marketplace</p>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 GreenCart. All rights reserved. BCA 6th Sem Project</p>
      </div>
    </footer>
  );
};

export default Footer;