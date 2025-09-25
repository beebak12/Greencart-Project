import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarr from '../components/common/Navbarr';
import './Orderhistory.css';

const Orderhistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders/my-orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#2e7d32';
      case 'pending': return '#ff9800';
      case 'cancelled': return '#f44336';
      case 'shipped': return '#2196f3';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Navbarr />
        <div className="loading-container">
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbarr />
        <div className="error-container">
          <p>Error: {error}</p>
          <button onClick={fetchOrders}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbarr />
      <div className="order-history-container">
        <h1 className="order-history-title">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/goods')} className="shop-now-btn">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="item-preview">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="more-items">+{order.items.length - 3} more</span>
                    )}
                  </div>

                  <div className="order-summary">
                    <div className="order-totals">
                      <span>Total: Rs. {order.orderSummary?.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="shipping-address">
                    <strong>Shipping to:</strong> {order.shippingAddress?.fullName} - {order.shippingAddress?.city}
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orderhistory;