import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbarr from '../components/common/Navbarr';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    city: '',
    wardNo: '',
    toll: '',
    phone: '',
    email: '',
    paymentMethod: 'cash_on_delivery' // Added payment method state
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.city.trim()) newErrors.city = 'City/Town is required';
    if (!formData.wardNo.trim()) newErrors.wardNo = 'Ward number is required';
    if (!formData.toll.trim()) newErrors.toll = 'Toll is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const phoneRegex = /^[9][6-8]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Nepali phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSubtotal = () => getCartSubtotal();
  const calculateShipping = () => (getCartSubtotal() > 800 ? 0 : 80);
  const calculateTax = () => getCartSubtotal() * 0.13;
  const calculateTotal = () => calculateSubtotal() + calculateShipping() + calculateTax();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    if (!token) {
      alert("You must be logged in to place an order");
      setIsSubmitting(false);
      return;
    }

    try {

      
      const subtotal = calculateSubtotal();
      const deliveryFee = calculateShipping();
      const taxAmount = calculateTax();
      const totalAmount = calculateTotal();

      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');

        console.log("User data from localStorage:", userData);
    console.log("Cart items:", cartItems);

    // Ensure we have valid product and farmer IDs
    const itemsWithValidIds = cartItems.map((item) => {
      // Check if we have valid IDs, if not use fallbacks
      const productId = item._id || item.id || `temp-${Date.now()}-${Math.random()}`;
      const farmerId = item.farmer || item.farmerId || item.farmer?._id || "66f7f2c3a2b4c5d678901234";
      
      console.log(`Processing item: ${item.name}`, { productId, farmerId });
      
      return {
        product: productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit || "kg",
        farmer: farmerId
      };
    });

      const payload = {
        items: cartItems.map((item) => ({
          product: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || "kg",
          farmer: item.farmer || item.farmerId || "66f7f2c3a2b4c5d678901234"
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          email: formData.email,
          street: formData.toll,
          city: formData.city,
          ward: formData.wardNo,
          country: "Nepal"
        },
        orderSummary: {
          subtotal,
          deliveryFee,
          tax: taxAmount,
          totalAmount
        },
        paymentInfo: {
          method: formData.paymentMethod,
          status: formData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed'
        },
        customer: userData._id || userData.id,
        status: 'pending'
      };

      console.log("Order payload:", payload);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success
      alert("Order placed successfully!");
       console.log("Order created successfully:", data);
      
      // Clear cart
      clearCart();
      
      // Navigate to order history
      navigate("/orderhistory");
      
    } catch (error) {
      console.error("Order placement error:", error);

        // More specific error messages
    if (error.message.includes('Failed to fetch')) {
      alert("Network error: Cannot connect to server. Please check your internet connection and make sure the backend server is running.");
    } else if (error.message.includes('401')) {
      alert("Authentication error: Please log in again.");
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/signin');
    } else if (error.message.includes('500')) {
      alert("Server error: Please try again later or contact support.");
    } else {
      alert(`Error: ${error.message}`);
    }
    
    
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbarr />
        <div className="empty-cart-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checkout</p>
          <button onClick={() => navigate('/goods')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbarr />
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          {/* Billing Details Form */}
          <div className="billing-details">
            <h2>Billing Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="city">Town / City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="wardNo">Ward Number *</label>
                  <input
                    type="text"
                    id="wardNo"
                    name="wardNo"
                    value={formData.wardNo}
                    onChange={handleInputChange}
                    className={errors.wardNo ? 'error' : ''}
                  />
                  {errors.wardNo && <span className="error-message">{errors.wardNo}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="toll">Toll *</label>
                  <input
                    type="text"
                    id="toll"
                    name="toll"
                    value={formData.toll}
                    onChange={handleInputChange}
                    className={errors.toll ? 'error' : ''}
                  />
                  {errors.toll && <span className="error-message">{errors.toll}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="98XXXXXXXX"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Your Order</h2>
            
            <div className="order-items">
              <div className="order-header">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              
              {cartItems.map(item => (
                <div key={item.cartId} className="order-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div className="order-divider"></div>
              
              <div className="order-total-line">
                <span>Subtotal</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              
              <div className="order-total-line">
                <span>Shipping</span>
                <span>{calculateShipping() === 0 ? 'FREE' : `Rs. ${calculateShipping().toFixed(2)}`}</span>
              </div>
              
              <div className="order-total-line">
                <span>Tax (13%)</span>
                <span>Rs. {calculateTax().toFixed(2)}</span>
              </div>
              
              <div className="order-divider"></div>
              
              <div className="order-total-line total">
                <span>Total</span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-methods">
              <h3>Payment Methods</h3>
              
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="cash-on-delivery" 
                  name="payment" 
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={() => handlePaymentMethodChange('cash_on_delivery')}
                />
                <label htmlFor="cash-on-delivery">Cash on Delivery</label>
                <p>Pay with cash when your order is delivered.</p>
              </div>

              <div className="payment-option">
                <input 
                  type="radio" 
                  id="bank-transfer" 
                  name="payment" 
                  checked={formData.paymentMethod === 'bank_transfer'}
                  onChange={() => handlePaymentMethodChange('bank_transfer')}
                />
                <label htmlFor="bank-transfer">Direct Bank Transfer</label>
                <p>Make your payment directly into our bank account. Please use your Order ID as the payment reference.</p>
              </div>
            </div>

            <button 
              type="button" 
              className={`place-order-btn ${isSubmitting ? 'loading' : ''}`}
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;