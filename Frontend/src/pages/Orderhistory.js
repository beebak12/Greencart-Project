import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbarr from '../components/common/Navbarr';
import './Orderhistory.css';

const Orderhistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }

    fetchOrders();
    fetchNotifications();
    
    // Set up real-time updates (poll every 30 seconds)
    const interval = setInterval(() => {
      fetchOrders();
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders/history/${currentUser._id}`,
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

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders/notifications/${currentUser._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#2e7d32';
      case 'processing': return '#2196f3';
      case 'pending': return '#ff9800';
      case 'cancelled': return '#f44336';
      case 'shipped': return '#4caf50';
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

  const getFarmerStatus = (order, farmerId) => {
    const notification = order.farmerNotifications?.find(
      notif => notif.farmerId === farmerId
    );
    return notification?.status || 'pending';
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/orders/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      // Refresh notifications
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
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
        <div className="order-history-header">
          <h1 className="order-history-title">Order History</h1>
          
          {/* Notifications Bell */}
          <div className="notifications-container">
            <button className="notifications-btn">
              <i className="fas fa-bell"></i>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="notification-badge">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="notifications-dropdown">
              <h4>Notifications</h4>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                notifications.slice(0, 5).map(notification => (
                  <div 
                    key={notification._id} 
                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                    onClick={() => markNotificationAsRead(notification._id)}
                  >
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
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
                    <h3>Order #{order.orderId}</h3>
                    <span className="order-date">{formatDate(order.orderDate)}</span>
                    <div className="customer-info">
                      <small>
                        <strong>Placed by:</strong> {order.customer?.name} ({order.customer?.email})
                      </small>
                    </div>
                  </div>
                  <div className="order-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-items-section">
                    <h4>Order Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-detailed">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                          <span className="item-price">₹{item.price} each</span>
                          <span className="item-total">Total: ₹{item.price * item.quantity}</span>
                        </div>
                        <div className="farmer-info">
                          <strong>Farmer:</strong> {item.farmerName}
                          <span 
                            className="farmer-status-badge"
                            style={{ backgroundColor: getStatusColor(getFarmerStatus(order, item.farmerId)) }}
                          >
                            {getFarmerStatus(order, item.farmerId).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="order-totals">
                      <h4>Order Summary</h4>
                      <p><strong>Total Amount:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
                      <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                      <p><strong>Items Count:</strong> {order.items.length}</p>
                    </div>
                  </div>
                </div>

                <div className="shipping-section">
                  <h4>Shipping Address</h4>
                  <div className="shipping-address">
                    <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
                    <p><strong>City:</strong> {order.shippingAddress?.city}</p>
                    <p><strong>Postal Code:</strong> {order.shippingAddress?.postalCode}</p>
                  </div>
                </div>

                <div className="farmer-notifications-section">
                  <h4>Farmer Updates</h4>
                  {order.farmerNotifications?.map((notification, index) => (
                    <div key={index} className="farmer-update">
                      <span className="farmer-name">{notification.farmerName}:</span>
                      <span className="update-status">{notification.status}</span>
                      <span className="update-time">
                        {notification.notificationDate ? formatDate(notification.notificationDate) : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      View Full Details
                    </button>
                    <button 
                      className="refresh-status-btn"
                      onClick={fetchOrders}
                    >
                      Refresh Status
                    </button>
                  </div>
                  <div className="last-updated">
                    Last updated: {formatDate(order.lastUpdated || order.orderDate)}
                  </div>
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