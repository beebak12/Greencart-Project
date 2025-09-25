import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbarr from '../components/common/Navbarr';
import './Cart.css';
 
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal, clearCart } = useCart();
 
  const calculateSubtotal = () => {
    return getCartSubtotal();
  };
  
  const calculateShipping = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 800 ? 0 : 80; // Free shipping over Rs. 500
  };
  
  const calculateTax = () => {
    const subtotal = getCartSubtotal();
    return subtotal * 0.13; // 13% VAT
  };
  
  const calculateTotal = () => {
    const subtotal = getCartSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    return subtotal + shipping + tax;
  };
  
  const handlePlaceOrder = () => {
    console.log('Place order button clicked');
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Navigate to checkout page instead of placing order directly
    
    
    navigate('/checkout');
  };
 
  return (
    <div>
      <Navbarr />
    
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review and manage your items</p>
      </div>
 
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Start adding items from our farm fresh selection!</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/goods')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-table-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span>Action</span>
            </div>
           
            {cartItems.map(item => (
              <div key={item.cartId} className="cart-item">
                <div className="item-info">
                  <img src={item.images?.[0]?.url || item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p>By: {item.farmerName || item.farmer?.name || item.farmer?.username || 'Farm Fresh'}</p>
                  </div>
                </div>
               
                <div className="item-price">Rs.{item.price}</div>
               
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-number">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
               
                <div className="item-total">
                  Rs.{(item.price * item.quantity)}
                </div>
               
                <div className="item-action">
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
         
          <div className="cart-summary">
            <h2>Order Summary</h2>
           
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs.{calculateSubtotal().toFixed(2)}</span>
            </div>
           
            <div className="summary-row">
              <span>Shipping {getCartSubtotal() > 800 ? '(Free over Rs.800)' : ''}</span>
              <span>{getCartSubtotal() > 800 ? 'FREE' : `Rs.${calculateShipping().toFixed(2)}`}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (13%)</span>
              <span>Rs.{calculateTax().toFixed(2)}</span>
            </div>
           
            <div className="summary-divider"></div>
           
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs.{calculateTotal().toFixed(2)}</span>
            </div>
           
            <button 
              className="checkout-btn"
              onClick={handlePlaceOrder}
            >
              Proceed to Checkout
            </button>
           
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/goods')}
            >
              Continue Shopping
            </button>
            
            <button 
              className="clear-cart-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              style={{ 
                marginTop: '10px', 
                backgroundColor: '#dc3545', 
                border: 'none', 
                color: 'white', 
                padding: '10px 15px', 
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};
 
export default Cart;