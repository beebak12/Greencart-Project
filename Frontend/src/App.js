import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';

import Landing from './pages/Landing.js';
import Footer from './components/common/Footer';
import Navbarr from './components/common/Navbarr.js';
import Home from './pages/Home';
import Goods from './pages/Goods';
import Grains from './pages/Grains';
import Fruits from './pages/Fruits';
import Vegetables from './pages/Vegetables';
import Aboutus from './pages/Aboutus';

import Farmers from './pages/Farmers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Signin from './pages/Signin';

import Products from './pages/Products';
import About from './pages/About';
import Feedback from './pages/Feedback.js';
import Contact from './pages/Contact';
import Contactus from './pages/Contactus';
import Farmersignin from './pages/Farmersignin.js';
import Costumersignup from './pages/Costumersignup.js';
import Farmersignup from './pages/Farmersignup.js'
import Header from './components/common/Header.js';
import Farmerdashboard from './pages/Farmerdashboard.js';

import OrderHistory from './pages/Orderhistory.js';
import './App.css';



function App() {
  return (
    <CartProvider>
     <SearchProvider> 
    <Router> 
    <div className="main-content">
    
      <main>
      <Routes>
         
    <Route path="/" element={<Landing />} />
  <Route path="/home" element={<Home />} />
  <Route path="/goods" element={<Goods />} />
  <Route path="/grains" element={<Grains />} />
  <Route path="/fruits" element={<Fruits />} />
  <Route path="/vegetables" element={<Vegetables />} /> 
  <Route path="/aboutus" element={<Aboutus />} />
  
  <Route path="/farmers" element={<Farmers />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout  />} />
  <Route path="/signin" element={<Signin />} />
   <Route path="/header" element={<Header />} />
     <Route path="/navbarr" element={<Navbarr />} />

  <Route path="/products" element={<Products />} /> 
   <Route path="/about" element={<About />} />    
     <Route path="/feedback" element={<Feedback />} />  
  <Route path="/contact" element={<Contact />}/>
  <Route path="/contactus" element={<Contactus />}/>
  <Route path="/farmersignin" element={<Farmersignin />} />
   <Route path="/costumersignup" element={<Costumersignup />} />
   <Route path="/farmersignup" element={<Farmersignup />} />
   <Route path="/farmerdashboard" element={<Farmerdashboard />} />

   <Route path="/OrderHistory" element={<OrderHistory />} />
  {/* Other routes */}
</Routes>
    </main>
    <Footer />
    </div>
    </Router>
    </SearchProvider>
    </CartProvider>
  );
}

export default App;
