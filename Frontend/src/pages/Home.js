import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import Homeimage from '../assets/images/homepage.png';
import Whatimg from '../assets/images/whatimg.png';
import Whyimg from '../assets/images/whygreencart.png';
import MulberryImg from '../assets/images/mulberry.png';
import OnionImg from '../assets/images/onion.jpeg';
import CabbageImg from '../assets/images/cabage.jpg';
import TomatoImg from '../assets/images/tomato.jpg';
import How1Img from '../assets/images/how1.png';
import How2Img from '../assets/images/how2.png';
import How3Img from '../assets/images/how3.png';
import KripaImg from '../assets/images/kripa.jpg';
import VishalImg from '../assets/images/vishal.png';
import AjayImg from '../assets/images/dipendrasir.jpg';
import Navbar from '../components/common/Navbarr';
 
 
const Home = () => {
  
  
   const navigate = useNavigate(); // Hook for navigation
  return (
    
    <div  className="main-page">
      <Navbar /> 
    
    <div className="green-cart">
      <section className="hero">
        <div className="hero-content">
            <img src={Homeimage} alt="home" className="homeimage" height="700" width="1440"/>
        </div>
      </section>            
 
 
 
 
      <section className="what">
        <div className="what-section">
         <div className="what-text">
          <h1>What is GreenCart?</h1>
          <p>GreenCart connects consumers directly with local farmers, proceeding access to fresh, sustainable products. Support your communitsy and enjoy the best nature has to offer.</p>  
         </div>
         <div className="what-img">
          <img src={Whatimg} alt="home" className="whatimg" height="400"/></div>
        </div>
      </section>
 
 
      <section className="why">
        <div className="why-section">
           <div className="why-img">
             <img src={Whyimg} alt="home" className="whyimg" height="400"/>
           </div>
            <div className="why-text">
              <h1>Why GreenCart?</h1>
              <p>Because fresh, local food shouldn't come with a large chain. GreenCart connects you directly with farmers for products that's honest, fats and full of lite.</p>
               </div>
            </div>
      </section>
     
    <section className="how-it-works">
      <div className="container">
        <h2>How GreenCart Works?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <div className="icon-circle">
            <img src={How1Img} alt="home" height="70"/>
              </div>
             
            </div>
            <h3>Discover local farmers</h3>
            <p>Find farmers in your area offering fresh, sustainable products</p>
          </div>
         
          <div className="step">
            <div className="step-icon">
              <div className="icon-circle">
                <img src={How2Img} alt="home" height="90"/>
              </div>
             
            </div>
            <h3>Browse fresh produce</h3>
            <p>Explore seasonal fruits, vegetables, and other farm products</p>
          </div>
         
          <div className="step">
            <div className="step-icon">
              <div className="icon-circle">
                <img src={How3Img} alt="home" height="90"/>
              </div>
           
            </div>
            <h3>Order & support a community farm</h3>
            <p>Place your order and directly support local agriculture</p>
          </div>
        </div>
       
        <div className="cta-container">
          <button className="cta-button">Get Started Today</button>
        </div>
      </div>
    </section>
 
 
 
 
 
 
 
     
<section className="featured-products">
  <div className="container">
    <h2>Featured Products</h2>
    <div className="products-grid">
      <div className="product-card">
        <div className="product-image">
          <img src={MulberryImg} alt="Mulberry" />
          <div className="product-overlay">
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
        <h3>Mulberry</h3>
        <p className="product-price">300 / kg</p>
      </div>
     
      <div className="product-card">
        <div className="product-image">
          <img src={OnionImg} alt="Red Onion" />
          <div className="product-overlay">
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
        <h3>Red Onion</h3>
        <p className="product-price">70/ kg</p>
      </div>
     
      <div className="product-card">
        <div className="product-image">
          <img src={CabbageImg} alt="Cabbage" />
          <div className="product-overlay">
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
        <h3>Cabbage</h3>
        <p className="product-price">80/ piece</p>
      </div>
     
      <div className="product-card">
        <div className="product-image">
          <img src={TomatoImg } alt="Tomato" />
          <div className="product-overlay">
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
        <h3>Tomato</h3>
        <p className="product-price">100/ kg</p>
      </div>
    </div>
    <div className="view-more-container">
     <button 
  className="view-more-btn"
  onClick={() => navigate('/goods')}
>
  View more
</button>
    </div>
  </div>
</section>
 
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">What Others Say?</h2>
       
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="icon-circle">
                <img src={AjayImg} alt="home" height="90"/>
              </div>
             
            <div className="testimonial-content">
              <p className="testimonial-text">
                I ordered some vegetables yesterday, they were totally fresh, and the delivery
                was also on time. I highly recommend them for all.
              </p>
            </div>
            <div className="testimonial-author">
              <h3 className="author-name">Dipendra Silwal</h3>
              <p className="author-title">Customer</p>
            </div>
          </div>
         
          <div className="testimonial-card">
            <div className="icon-circle">
                <img src={VishalImg} alt="home" height="90"/>
              </div>
             
            <div className="testimonial-content">
              <p className="testimonial-text">
                Was looking for a Tarkari/Vegetable Delivery service during this lockdown,
                Really professional, fast, affordable, and reliable Greencart delivery service.
                Definitely buying from them in the future as well.
              </p>
            </div>
            <div className="testimonial-author">
              <h3 className="author-name">Vishal Maske</h3>
              <p className="author-title">Customer</p>
            </div>
          </div>
         
          <div className="testimonial-card">
            <div className="icon-circle">
                <img src={KripaImg } alt="home" height="90"/>
              </div>
             
            <div className="testimonial-content">
              <p className="testimonial-text">
                Best place to buy fresh vegetables. I am much satisfied with their product delivery
                in terms of quality and time. Thanks, Greencart, for your service.
              </p>
            </div>
            <div className="testimonial-author">
              <h3 className="author-name">kripa Giri</h3>
              <p className="author-title">Customer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
 
 
      <section className="cta-section">
        <div className="container">
          <h3>Ready to support local farmers?</h3>
          <button className="cta-button">Create an account</button>
        </div>
      </section>
 
      <footer className="footer">
        <p>&copy; 2023 GreenCart. All rights reserved.</p>
      </footer>
    </div>
    </div>
  )
};
 
export default Home;