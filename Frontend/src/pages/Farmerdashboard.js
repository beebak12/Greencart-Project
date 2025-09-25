import React, { useState, useEffect } from 'react';
import GreencartLogo from '../assets/icons/greencart-logo.png';
import './Farmerdashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FarmerDashboard = () => {
  const [farmerDetails, setFarmerDetails] = useState({});
  const [products, setProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('items');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductInitialStock, setNewProductInitialStock] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('fruits');
  const [newFarmerName, setNewFarmerName] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingImage, setEditingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
 
  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editableInfo, setEditableInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Add new state for farmer profile image
  const [farmerProfileImage, setFarmerProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');
  const [editingProfileImage, setEditingProfileImage] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  // Add logout function
  const handleLogout = () => {
    console.log("Logging out...");

    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');

    window.location.href = '/signin'; 

    setShowDropdown(false);
  };

  const handlePrivacySecurity = () => {
    console.log("Privacy & Security clicked");
    alert("Privacy & Security settings would open here");
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        // Try to load current farmer from backend
        let fetchedName = '';
        let fetchedEmail = '';
        let fetchedPhone = '';
        let fetchedAddress = '';
        let fetchedProfileImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        
        try {
          const token = localStorage.getItem('token') || '';
          if (token) {
            const resMe = await fetch('http://localhost:5000/api/farmers/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (resMe.ok) {
              const meData = await resMe.json();
              const f = meData.farmer || {};
              fetchedName = f.fullName || f.name || '';
              fetchedEmail = f.email || '';
              fetchedPhone = f.phone || '';
              fetchedAddress = f.address || '';
              fetchedProfileImage = f.profileImage || fetchedProfileImage;
            }
          }
        } catch {}

        // Fallback to userData from localStorage if API not available
        if (!fetchedName) {
          try {
            const raw = localStorage.getItem('userData');
            if (raw) {
              const u = JSON.parse(raw);
              fetchedName = u?.name || u?.fullName || fetchedName;
              fetchedEmail = u?.email || fetchedEmail;
            }
          } catch {}
        }

        // Final fallback default
        const farmerData = {
          name: fetchedName || "Ram Bahadur Thapa",
          address: fetchedAddress || "",
          email: fetchedEmail || "",
          phone: fetchedPhone || "",
          memberSince: "2018",
          profileImage: fetchedProfileImage
        };
        
        setFarmerDetails(farmerData);
        setFarmerProfileImage(fetchedProfileImage);
        setNewFarmerName(farmerData.name);
        
        // Initialize editableInfo with the same data
        setEditableInfo({
          name: farmerData.name,
          address: farmerData.address,
          email: farmerData.email,
          phone: farmerData.phone
        });
            
        // Fetch products from backend for this user
        try {
          const token = localStorage.getItem('token') || '';
          const res = await fetch('http://localhost:5000/api/products/my/products', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok) {
            const mapped = (data.products || []).map(p => ({
              id: p._id,
              name: p.name,
              price: p.price,
              stock: p.stock,
              available: (p.stock ?? 0) > 0,
              hasFits: false,
              image: p.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=Image'
            }));
            setProducts(mapped);
          } else {
            // fallback to empty
            setProducts([]);
          }
        } catch {
          setProducts([]);
        }

        // Load farmer-specific orders from backend
        try {
          const token = localStorage.getItem('token') || '';
          const resOrders = await fetch('http://localhost:5000/api/orders/farmer', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const dataOrders = await resOrders.json();
          if (resOrders.ok) {
            const mappedOrders = (dataOrders.orders || []).map(o => ({
              id: o._id || o.orderNumber || 'N/A',
              customerName: o.user?.name || 'Customer',
              date: new Date(o.createdAt).toISOString().split('T')[0],
              status: o.orderStatus,
              deliveryAddress: `${o.shippingAddress?.street || ''}, ${o.shippingAddress?.city || ''}`.trim(),
              contact: o.shippingAddress?.phone || '',
              items: (o.items || []).map(it => ({ name: it.name, qty: it.quantity, price: it.price })),
              total: o.orderSummary?.totalAmount || 0
            }));
            const pend = mappedOrders.filter(x => ['pending','processing','shipped','confirmed','out_for_delivery','packed'].includes(x.status));
            const comp = mappedOrders.filter(x => x.status === 'delivered');
            setPendingOrders(pend);
            setCompletedOrders(comp);
          } else {
            setPendingOrders([]);
            setCompletedOrders([]);
          }
        } catch {
          setPendingOrders([]);
          setCompletedOrders([]);
        }

        // Default orders
        const defaultPendingOrders = [
          {
            id: 'ORD1001',
            customerName: "Ram Shrestha",
            items: [{ name: "Organic Tomatoes", qty: 2, price: 150 }],
            total: 300,
            date: '2023-10-27',
            status: 'pending',
            deliveryAddress: '123 Main St, Kathmandu',
            contact: '9841000001'
          },
          {
            id: 'ORD1002',
            customerName: "Sita Aryal",
            items: [{ name: "Free-Range Eggs (Dozen)", qty: 1, price: 300 }],
            total: 300,
            date: '2023-10-26',
            status: 'processing',
            deliveryAddress: '456 Park Rd, Lalitpur',
            contact: '9841000002'
          }
        ];

        const defaultCompletedOrders = [
          {
            id: 'ORD0998',
            customerName: "Gita Kumar",
            items: [{ name: "Organic Tomatoes", qty: 3, price: 150 }],
            total: 450,
            date: '2023-10-25',
            deliveredOn: '2023-10-25',
            status: 'delivered',
            deliveryAddress: '321 Hill St, Pokhara',
            contact: '9841000004'
          }
        ];

        setPendingOrders(defaultPendingOrders);
        setCompletedOrders(defaultCompletedOrders);

        // Sample notifications
        const sampleNotifications = [
          {
            id: 1,
            type: 'order',
            message: 'New order #ORD1003 received',
            timestamp: new Date(Date.now() - 10 * 60000),
            read: false,
            orderId: 'ORD1003'
          },
          {
            id: 2,
            type: 'stock',
            message: 'Organic Tomatoes is running low on stock',
            timestamp: new Date(Date.now() - 2 * 3600000),
            read: false,
            productId: 1
          },
          {
            id: 3,
            type: 'system',
            message: 'Your payment of Rs. 4500 has been processed',
            timestamp: new Date(Date.now() - 24 * 3600000),
            read: true
          }
        ];

        setNotifications(sampleNotifications);
        setUnreadCount(sampleNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error("Failed to fetch farmer data:", error);
      }
    };

    fetchFarmerData();
  }, []);

  // Updated function to handle farmer profile image change with backend save
  const handleProfileImageChange = async () => {
    if (!selectedProfileImage) {
      alert("Please select an image.");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profileImage', selectedProfileImage);

      const token = localStorage.getItem('token') || '';
      const res = await fetch('http://localhost:5000/api/farmers/me/profile-image', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser will set it with boundary
        },
        body: formData
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile image');
      }

      // Update state with the new image URL from backend
      if (data.profileImageUrl) {
        setFarmerProfileImage(data.profileImageUrl);
        setFarmerDetails(prev => ({
          ...prev,
          profileImage: data.profileImageUrl
        }));
      } else {
        setFarmerProfileImage(profileImagePreview);
        setFarmerDetails(prev => ({
          ...prev,
          profileImage: profileImagePreview
        }));
      }

      setEditingProfileImage(false);
      setSelectedProfileImage(null);
      setProfileImagePreview('');
      toast.success('✅ Profile image updated successfully!');
      setSuccessMessage("✅ Profile image updated successfully!");
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Error updating profile image:', error);
      toast.error('Failed to update profile image');
      
      // Fallback: update frontend only if backend fails
      setFarmerProfileImage(profileImagePreview);
      setEditingProfileImage(false);
      setSelectedProfileImage(null);
      setProfileImagePreview('');
      setSuccessMessage("✅ Profile image updated (local only)!");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Updated function to handle profile image upload with validation
  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }

      setSelectedProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = [];

    // Search in products
    products.forEach(product => {
      if (product.name.toLowerCase().includes(query)) {
        results.push({
          type: 'product',
          item: product,
          tab: 'items'
        });
      }
    });

    // Search in pending orders
    pendingOrders.forEach(order => {
      if (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'order',
          item: order,
          tab: 'orders'
        });
      }
    });

    // Search in completed orders
    completedOrders.forEach(order => {
      if (
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      ) {
        results.push({
          type: 'completed_order',
          item: order,
          tab: 'orders'
        });
      }
    });

    setSearchResults(results);
  }, [searchQuery, products, pendingOrders, completedOrders]);

  // Notification functions
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    if (!showNotifications && unreadCount > 0) {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === 'order') {
      setActiveTab('orders');
      setOrderStatusFilter('all');
    } else if (notification.type === 'stock') {
      setActiveTab('items');
    }

    if (!notification.read) {
      const updatedNotifications = notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(unreadCount - 1);
    }

    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
     setShowNotifications(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(e.target.value.trim() !== '');
  };

  const handleSearchResultClick = (result) => {
    setActiveTab(result.tab);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleDelivery = (orderId) => {
    const orderToComplete = pendingOrders.find(order => order.id === orderId);
    if (!orderToComplete) return;

    const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
    setPendingOrders(updatedPendingOrders);

    const completedOrder = {
      ...orderToComplete,
      deliveredOn: new Date().toISOString().split('T')[0],
      status: 'delivered'
    };
    setCompletedOrders(prev => [...prev, completedOrder]);

    setSuccessMessage(`✅ Order ${orderId} marked as delivered!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedPendingOrders = pendingOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setPendingOrders(updatedPendingOrders);

    setSuccessMessage(`✅ Order ${orderId} status updated to ${newStatus}!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const cancelOrder = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const updatedPendingOrders = pendingOrders.filter(order => order.id !== orderId);
      setPendingOrders(updatedPendingOrders);

      setSuccessMessage(`✅ Order ${orderId} has been cancelled!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const toggleAvailability = async (productId) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;

    const newAvailable = !target.available;
    const newStock = newAvailable ? (parseInt(target.stock) > 0 ? parseInt(target.stock) : 1) : 0;

    // Persist to backend
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update availability');
    } catch (e) {
      toast.error(e.message);
      return;
    }

    // Update UI state
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, available: newAvailable, stock: newStock }
        : product
    );
    setProducts(updatedProducts);

    toast.success('Product availability updated!');
    setSuccessMessage("Product availability updated!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProductUpdate = async (productId) => {
    const stockValue = parseInt(newStock);
    const priceValue = parseInt(newPrice);

    if (isNaN(stockValue) || stockValue < 0) {
      alert("Please enter a valid stock number.");
      return;
    }
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    // Persist update to backend
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ price: priceValue, stock: stockValue, unit: 'kg', name: products.find(p=>p.id===productId)?.name || 'Product', description: 'Updated' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product');
    } catch (e) {
      toast.error(e.message);
      return;
    }

    setProducts(products.map(product =>
      product.id === productId
        ? {
          ...product,
          stock: stockValue,
          price: priceValue,
          available: stockValue > 0
        }
        : product
    ));

    setEditingProduct(null);
    setNewStock('');
    setNewPrice('');
    toast.success('✅ Product updated successfully!');
    setSuccessMessage("✅ Product updated successfully!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddProduct = async () => {
    const priceValue = parseInt(newProductPrice);
    const stockValue = parseInt(newProductInitialStock);

    if (!newProductName.trim()) {
      alert("Please enter a product name.");
      return;
    }
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price.");
      return;
    }
    if (isNaN(stockValue) || stockValue < 0) {
      alert("Please enter a valid stock number.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify({
          name: newProductName,
          description: `${newProductName} added by farmer`,
          price: priceValue,
          category: newProductCategory,
          stock: stockValue,
          unit: 'kg',
          farmerName: newFarmerName || farmerDetails.name,
          imageBase64: imagePreview || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');
      const created = data.product;
      setProducts([...products, {
        id: created._id,
        name: created.name,
        price: created.price,
        stock: created.stock,
        available: created.stock > 0,
        hasFits: false,
        image: created.images?.[0]?.url || imagePreview
      }]);
    } catch (e) {
      alert(e.message);
      return;
    }
    setShowAddProductForm(false);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductInitialStock('');
    setNewProductCategory('fruits');
    setNewFarmerName('');
    setSelectedImage(null);
    setImagePreview('');
      toast.success('✅ Product added successfully!');
    setSuccessMessage("✅ Product added successfully!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete product');
      } catch (e) {
        toast.error(e.message);
        return;
      }
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      toast.success('✅ Product deleted successfully!');
      setSuccessMessage("✅ Product deleted successfully!");
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleImageChange = async (productId) => {
    if (!imagePreview) {
      alert("Please select an image.");
      return;
    }

    // Persist new image to backend
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageBase64: imagePreview })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update product image');
      const updatedImage = data.product?.images?.[0]?.url || imagePreview;
      setProducts(products.map(product =>
        product.id === productId
          ? { ...product, image: updatedImage }
          : product
      ));
    } catch (e) {
      toast.error(e.message);
      return;
    }

    setEditingImage(false);
    setSelectedImage(null);
    setImagePreview('');
    toast.success('✅ Product image updated successfully!');
    setSuccessMessage("✅ Product image updated successfully!");
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>;
      case 'processing':
        return <span className="status-badge status-processing">Processing</span>;
      case 'shipped':
        return <span className="status-badge status-shipped">Shipped</span>;
      case 'delivered':
        return <span className="status-badge status-delivered">Delivered</span>;
      case 'cancelled':
        return <span className="status-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  const filteredPendingOrders = pendingOrders.filter(order => {
    if (orderStatusFilter === 'all') return true;
    return order.status === orderStatusFilter;
  });

  const filteredCompletedOrders = completedOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  // Profile component to avoid code duplication
  const ProfileSection = () => (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-image-container">
          <div className="profile-image">
            <img src={farmerProfileImage || farmerDetails.profileImage} alt={farmerDetails.name} />
          </div>
          <button
            className="btn-change-image"
            onClick={() => {
              setEditingProfileImage(true);
              setSelectedProfileImage(null);
              setProfileImagePreview('');
            }}
          >
            Change Image
          </button>
        </div>
        <div className="profile-info">
          {isEditingInfo ? (
            <input
              type="text"
              value={editableInfo.name}
              onChange={(e) => setEditableInfo({...editableInfo, name: e.target.value})}
              className="edit-name-input"
            />
          ) : (
            <h3>{farmerDetails.name}</h3>
          )}
          <div className="member-since">Member since {farmerDetails.memberSince}</div>
        </div>
      </div>

      {editingProfileImage && (
        <div className="image-edit-form">
          <div className="form-group">
            <label className="file-upload-label">
              <span>Select New Profile Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="file-upload-input"
              />
              {selectedProfileImage ? selectedProfileImage.name : "Choose an image"}
            </label>
            {profileImagePreview && (
              <div className="image-preview">
                <img src={profileImagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button onClick={handleProfileImageChange} className="btn-save">Save Image</button>
            <button onClick={() => {
              setEditingProfileImage(false);
              setSelectedProfileImage(null);
              setProfileImagePreview('');
            }} className="btn-cancel">Cancel</button>
          </div>
        </div>
      )}

      <div className="profile-details">
        <div className="detail-item">
          <span className="detail-label">Address:</span>
          {isEditingInfo ? (
            <input
              type="text"
              value={editableInfo.address}
              onChange={(e) => setEditableInfo({...editableInfo, address: e.target.value})}
              className="edit-input"
            />
          ) : (
            <span className="detail-value">{farmerDetails.address}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Email:</span>
          {isEditingInfo ? (
            <input
              type="email"
              value={editableInfo.email}
              onChange={(e) => setEditableInfo({...editableInfo, email: e.target.value})}
              className="edit-input"
            />
          ) : (
            <span className="detail-value">{farmerDetails.email}</span>
          )}
        </div>
        <div className="detail-item">
          <span className="detail-label">Phone:</span>
          {isEditingInfo ? (
            <input
              type="tel"
              value={editableInfo.phone}
              onChange={(e) => setEditableInfo({...editableInfo, phone: e.target.value})}
              className="edit-input"
            />
          ) : (
            <span className="detail-value">{farmerDetails.phone}</span>
          )}
        </div>
      </div>

      {/* Edit/Save/Cancel buttons */}
      <div className="profile-actions">
        {!isEditingInfo ? (
          <button
            className="btn-edit-info"
            onClick={() => {
              setIsEditingInfo(true);
              setEditableInfo({
                name: farmerDetails.name,
                email: farmerDetails.email,
                phone: farmerDetails.phone,
                address: farmerDetails.address
              });
            }}
          >
            Edit Info
          </button>
        ) : (
          <div className="edit-actions">
            <button 
              className="btn-save"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token') || '';
                  const res = await fetch('http://localhost:5000/api/farmers/me', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                      name: editableInfo.name,
                      email: editableInfo.email,
                      phone: editableInfo.phone,
                      address: editableInfo.address
                    })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
                  const f = data.farmer || {};
                  const updated = {
                    name: f.fullName || f.name || editableInfo.name,
                    email: f.email || editableInfo.email,
                    phone: f.phone || editableInfo.phone,
                    address: f.address || editableInfo.address,
                    memberSince: farmerDetails.memberSince,
                    profileImage: farmerDetails.profileImage
                  };
                  setFarmerDetails(updated);
                  setNewFarmerName(updated.name);
                  // Update localStorage userData so headers show new name
                  try {
                    const raw = localStorage.getItem('userData');
                    if (raw) {
                      const u = JSON.parse(raw);
                      u.name = updated.name;
                      u.fullName = updated.name;
                      u.email = updated.email;
                      localStorage.setItem('userData', JSON.stringify(u));
                    }
                  } catch {}
                  setIsEditingInfo(false);
                  toast.success('✅ Profile updated successfully!');
                  setSuccessMessage("✅ Profile updated successfully!");
                  setTimeout(() => setSuccessMessage(''), 3000);
                } catch (e) {
                  toast.error(e.message);
                }
              }}
            >
              Save Changes
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setIsEditingInfo(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="profile-stats">
        <div className="stat">
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-number">{pendingOrders.length}</span>
          <span className="stat-label">Pending Orders</span>
        </div>
        <div className="stat">
          <span className="stat-number">{completedOrders.length}</span>
          <span className="stat-label">Completed Orders</span>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return (
          <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            <div className="tab-content">
            <div className="tab-header">
              <h2>Your Products</h2>
              <button
                className="btn-add-product"
                onClick={() => setShowAddProductForm(true)}
              >
                + Add New Product
              </button>
            </div>

            {successMessage && <p className="success-msg">{successMessage}</p>}

            {showAddProductForm && (
              <div className="add-product-form">
                <h3>Add New Product</h3>
                <div className="form-group">
                  <input
                    type="text"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Product Name"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="Price (Rs.)"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    value={newProductInitialStock}
                    onChange={(e) => setNewProductInitialStock(e.target.value)}
                    placeholder="Initial Stock"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    placeholder="Farmer Name"
                  />
                </div>
                <div className="form-group">
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)}>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="grains">Grains</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="file-upload-label">
                    <span>Product Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="file-upload-input"
                    />
                    {selectedImage ? selectedImage.name : "Choose an image"}
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button onClick={handleAddProduct} className="btn-save">Add Product</button>
                  <button onClick={() => setShowAddProductForm(false)} className="btn-cancel">Cancel</button>
                </div>
              </div>
            )}

            <div className="product-list-container">
              {products.length === 0 ? (
                <p className="no-products">No products added yet. Click "Add New Product" to get started.</p>
              ) : (
                <div className="product-list">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image-container">
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <button
                          className="btn-change-image"
                          onClick={() => {
                            setEditingImage(product.id);
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                        >
                          Change Image
                        </button>
                      </div>

                      {editingImage === product.id && (
                        <div className="image-edit-form">
                          <div className="form-group">
                            <label className="file-upload-label">
                              <span>Select New Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-upload-input"
                              />
                              {selectedImage ? selectedImage.name : "Choose an image"}
                            </label>
                            {imagePreview && (
                              <div className="image-preview">
                                <img src={imagePreview} alt="Preview" />
                              </div>
                            )}
                          </div>
                          <div className="form-actions">
                            <button onClick={() => handleImageChange(product.id)} className="btn-save">Save Image</button>
                            <button onClick={() => {
                              setEditingImage(null);
                              setSelectedImage(null);
                              setImagePreview('');
                            }} className="btn-cancel">Cancel</button>
                          </div>
                        </div>
                      )}

                      <h3>{product.name}</h3>
                      {product.hasFits && (
                        <div className="fits-indicator">
                          Choose Fits | {product.fitsChosen ? "Fits chosen" : "No fits chosen"}
                        </div>
                      )}
                      <div className="product-details">
                        <p><strong>Price:</strong> Rs. {product.price}</p>
                        <p><strong>Stock:</strong> {product.stock} {product.name.includes('Eggs') ? 'dozen' : 'kg'}</p>
                        <p><strong>Status:</strong> <span className={product.available ? 'status-available' : 'status-out'}>
                          {product.available ? 'In Stock' : 'Out of Stock'}
                        </span></p>
                      </div>

                      <div className="product-actions">
                        <button
                          onClick={() => toggleAvailability(product.id)}
                          className={`stock-toggle-btn ${product.available ? 'mark-out' : 'mark-in'}`}
                        >
                          Mark as {product.available ? 'Out of Stock' : 'In Stock'}
                        </button>

                        <button
                          onClick={() => {
                            setEditingProduct(product.id);
                            setNewStock(product.stock);
                            setNewPrice(product.price);
                          }}
                          className="btn-edit"
                        >
                          Edit Product
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>

                        {editingProduct === product.id && (
                          <div className="edit-form">
                            <h4>Edit Product Details</h4>
                            <div className="form-group">
                              <input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                placeholder="New Stock"
                              />
                            </div>
                            <div className="form-group">
                              <input
                                type="number"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="New Price"
                              />
                            </div>
                            <div className="form-actions">
                              <button onClick={() => handleProductUpdate(product.id)} className="btn-save">Save</button>
                              <button onClick={() => setEditingProduct(null)} className="btn-cancel">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </>
        );
      case 'orders':
        return (
          <div className="tab-content">
            <div className="orders-header">
              <h2>Order Management</h2>
              <div className="order-filters">
                <div className="filter-group">
                  <label>Pending Orders:</label>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Completed Orders:</label>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                  >
                    <option value="all">All Orders</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {successMessage && <p className="success-msg">{successMessage}</p>}

            <div className="orders-container">
              <div className="orders-section">
                <h3>Pending Orders ({filteredPendingOrders.length})</h3>
                {filteredPendingOrders.length === 0 ? (
                  <p className="no-orders">No pending orders.</p>
                ) : (
                  <div className="order-list">
                    {filteredPendingOrders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <h4>Order ID: {order.id}</h4>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="order-details">
                          <p><strong>Customer:</strong> {order.customerName}</p>
                          <p><strong>Date:</strong> {order.date}</p>
                          <p><strong>Contact:</strong> {order.contact}</p>
                          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

                          <div className="order-items">
                            <strong>Items:</strong>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} (Qty: {item.qty}) - Rs. {item.price * item.qty}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="order-total"><strong>Total Amount:</strong> Rs. {order.total}</p>
                        </div>

                        <div className="order-actions">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                className="btn-process"
                              >
                                Mark as Processing
                              </button>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="btn-cancel-order"
                              >
                                Cancel Order
                              </button>
                            </>
                          )}

                          {order.status === 'processing' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                className="btn-ship"
                              >
                                Mark as Shipped
                              </button>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                className="btn-cancel-order"
                              >
                                Cancel Order
                              </button>
                            </>
                          )}

                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleDelivery(order.id)}
                              className="btn-deliver"
                            >
                              Mark as Delivered
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="orders-section">
                <h3>Completed Orders ({filteredCompletedOrders.length})</h3>
                {filteredCompletedOrders.length === 0 ? (
                  <p className="no-orders">No completed orders yet.</p>
                ) : (
                  <div className="order-list">
                    {filteredCompletedOrders.map(order => (
                      <div key={order.id} className="order-card completed">
                        <div className="order-header">
                          <h4>Order ID: {order.id}</h4>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="order-details">
                          <p><strong>Customer:</strong> {order.customerName}</p>
                          <p><strong>Order Date:</strong> {order.date}</p>
                          {order.status === 'delivered' && (
                            <p><strong>Delivered On:</strong> {order.deliveredOn}</p>
                          )}
                          <p><strong>Contact:</strong> {order.contact}</p>
                          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>

                          <div className="order-items">
                            <strong>Items:</strong>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} (Qty: {item.qty}) - Rs. {item.price * item.qty}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <p className="order-total"><strong>Total Amount:</strong> Rs. {order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="tab-content">
            <h1>Farmer`s Profile</h1>
            <ProfileSection />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="farmer-dashboard">
      <header className="dashboard-header">
        <img   src={GreencartLogo} alt="Greencart Logo" className="greencart-logo"/>
        <p>Fresh From the Farm</p>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
            {showSearchResults && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleSearchResultClick(result)}
                  >
                    {result.type === 'product' ? (
                      <>
                        <div className="search-result-type">Product</div>
                        <div className="search-result-name">{result.item.name}</div>
                        <div className="search-result-details">Rs. {result.item.price} | Stock: {result.item.stock}</div>
                      </>
                    ) : (
                      <>
                        <div className="search-result-type">Order</div>
                        <div className="search-result-name">Order #{result.item.id}</div>
                        <div className="search-result-details">{result.item.customerName} | Rs. {result.item.total}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="notification-container">
            <button className="notification-bell" onClick={toggleNotifications}>
              🔔
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <div className="notification-actions">
                    <button
                      className="btn-mark-all-read"
                      onClick={markAllAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark all read
                    </button>
                    <button className="btn-clear-all" onClick={clearAllNotifications}>
                      Clear all
                    </button>
                  </div>
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`notification-item${notification.read ? '' : ' unread'}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {!notification.read && <div className="unread-dot"></div>}
                        <div className="notification-content">
                          <p className="notification-message">{notification.message}</p>
                          <div className="notification-time">{formatTime(notification.timestamp)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="user-info">
            <span>Welcome, {farmerDetails.name}</span>

            <div className="farmer-dropdown-container">
              <button
                className="farmer-icon-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👨‍🌾
              </button>

              {showDropdown && (
                <div className="farmer-dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowProfile(true);
                      setShowDropdown(false);
                    }}
                  >
                    Farmer's Profile
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={handlePrivacySecurity}
                  >
                    Privacy & Security
                  </button>
                  <hr className="dropdown-divider" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={activeTab === 'items' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('items')}
          >
            Manage Products
          </button>
          <button
            className={activeTab === 'orders' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('orders')}
          >
            Orders {pendingOrders.length > 0 && <span className="order-count">{pendingOrders.length}</span>}
          </button>
          <button
            className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
        </nav>
      </div>
      
      <main className="dashboard-main">
        {showProfile ? (
          <div className="tab-content">
            <div className="profile-header-with-close">
              <h2>Farm Profile</h2>
              <button 
                className="btn-close-profile"
                onClick={() => setShowProfile(false)}
              >
                ← Back to Dashboard
              </button>
            </div>
            <ProfileSection />
          </div>
        ) : (
          renderTabContent()
        )}
      </main>
    </div> 
  );
};

export default FarmerDashboard;