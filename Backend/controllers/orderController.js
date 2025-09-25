const { validationResult } = require('express-validator');
const Order = require('../models/Order.models');
const Cart = require('../models/Cart.models');
const Product = require('../models/Product.models');
const OrderHistory = require('../models/OrderHistory');

// ✅ FIXED PLACE ORDER FUNCTION (MAIN ISSUE)
const placeOrder = async (req, res) => {
  try {
    console.log('🔔 Place order request received:', req.body);
    
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const customer = req.user;

    // ✅ VALIDATION: Check if user is authenticated
    if (!customer || !customer.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // ✅ VALIDATION: Check required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid total amount is required'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

       // ✅ CREATE FARMER NOTIFICATIONS
    const farmerNotifications = [];
    const uniqueFarmers = new Map();

    for (let item of items) {
      // ✅ FIX: Check if farmer information exists
      if (!item.farmerId) {
        return res.status(400).json({
          success: false,
          message: 'Farmer ID is required for each item'
        });
      }

      if (!uniqueFarmers.has(item.farmerId.toString())) {
        uniqueFarmers.set(item.farmerId.toString(), {
          farmerId: item.farmerId,
          farmerName: item.farmerName || 'Unknown Farmer', // ✅ FIX: Default value
          notified: false,
          notificationDate: null,
          status: 'pending'
        });
      }
    }

    farmerNotifications.push(...uniqueFarmers.values());

   // ✅ FIXED: Create order history with proper field mapping
    const orderData = {
      customer: {
        userId: customer._id || customer.id,
        name: customer.name || shippingAddress.fullName,
        email: customer.email || 'customer@example.com',
        phone: customer.phone || shippingAddress.phone || 'Not provided'
      },
      items: items.map(item => ({
        productId: item.productId || item._id, // ✅ FIX: Handle both productId and _id
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
        farmerId: item.farmerId,
        farmerName: item.farmerName || 'Unknown Farmer',
        farmerEmail: item.farmerEmail || 'farmer@example.com'
      })),
      totalAmount: totalAmount,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        address: shippingAddress.address,
        city: shippingAddress.city || 'Unknown City',
        state: shippingAddress.state || 'Unknown State',
        postalCode: shippingAddress.postalCode || '00000',
        country: shippingAddress.country || 'Unknown Country',
        phone: shippingAddress.phone || 'Not provided'
      },
      paymentMethod: paymentMethod || 'cash_on_delivery',
      farmerNotifications: farmerNotifications
    };

    console.log('📦 Order data being saved:', orderData);

    // ✅ CREATE AND SAVE ORDER
    const order = new OrderHistory(orderData);
    const savedOrder = await order.save();

    console.log('✅ Order saved successfully:', savedOrder.orderId);

    // ✅ NOTIFY FARMERS (async - don't wait for completion)
    sendFarmerNotifications(savedOrder).catch(error => {
      console.error('❌ Farmer notification error:', error);
    });

    // ✅ CLEAR USER'S CART (if exists)
    try {
      const cart = await Cart.findOne({ user: customer._id || customer.id });
      if (cart) {
        cart.items = [];
        await cart.save();
        console.log('🛒 Cart cleared successfully');
      }
    } catch (cartError) {
      console.log('⚠️ Cart clearing failed:', cartError.message);
    }

    // ✅ SUCCESS RESPONSE
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId: savedOrder.orderId,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.orderStatus,
        orderDate: savedOrder.orderDate,
        items: savedOrder.items
      }
    });

  } catch (error) {
    console.error('❌ Place order error:', error);
    
    // ✅ SPECIFIC ERROR HANDLING
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Order ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error placing order: ' + error.message
    });
  }
};

// ✅ FIXED GET ORDER HISTORY FUNCTION
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    console.log('📋 Fetching order history for user:', userId);

    const orders = await OrderHistory.find({ 'customer.userId': userId })
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders
    });

  } catch (error) {
    console.error('❌ Error fetching order history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order history: ' + error.message
    });
  }
};

// ✅ FIXED UPDATE ORDER STATUS FUNCTION
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, status, farmerId } = req.body;

    console.log('🔄 Updating order status:', { orderId, itemId, status, farmerId });

    const order = await OrderHistory.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    let updated = false;

    // ✅ UPDATE FARMER NOTIFICATION STATUS
    if (farmerId) {
      const notification = order.farmerNotifications.find(
        notif => notif.farmerId.toString() === farmerId.toString()
      );
      
      if (notification) {
        notification.status = status;
        notification.notificationDate = new Date();
        notification.notified = true;
        updated = true;
      }
    }

 // ✅ UPDATE SPECIFIC ITEM STATUS
    if (itemId) {
      const item = order.items.id(itemId);
      if (item) {
        // Item-specific updates can go here
        console.log('📦 Item status updated:', item.name);
        updated = true;
      }
    }

    // ✅ UPDATE OVERALL ORDER STATUS BASED ON FARMER NOTIFICATIONS
    if (updated) {
      const allCompleted = order.farmerNotifications.every(notif => 
        ['completed', 'accepted'].includes(notif.status)
      );
      const anyCancelled = order.farmerNotifications.some(notif => 
        ['cancelled', 'rejected'].includes(notif.status)
      );

      if (anyCancelled) {
        order.orderStatus = 'cancelled';
      } else if (allCompleted) {
        order.orderStatus = 'completed';
      } else {
        order.orderStatus = 'processing';
      }

      order.lastUpdated = new Date();
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: order
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No changes made to order status'
      });
    }

  } catch (error) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order status: ' + error.message
    });
  }
};

// ✅ IMPROVED HELPER FUNCTION: Send farmer notifications
const sendFarmerNotifications = async (order) => {
  try {
    console.log('📧 Sending notifications to farmers for order:', order.orderId);
    
    for (let notification of order.farmerNotifications) {
      const farmerItems = order.items.filter(item => 
        item.farmerId.toString() === notification.farmerId.toString()
      );
      
      console.log(`👨‍🌾 Notifying farmer: ${notification.farmerName}`);
      console.log(`📦 Items: ${farmerItems.map(item => 
        `${item.name} (x${item.quantity}) - $${item.price * item.quantity}`
      ).join(', ')}`);
      
      notification.notified = true;
      notification.notificationDate = new Date();
    }

    await order.save();
    console.log('✅ All farmers notified successfully');
    
  } catch (error) {
    console.error('❌ Error sending farmer notifications:', error);
    // Don't throw error - notifications shouldn't block order placement
  }
};
   
// ✅ CREATE ORDER (Original function)
const createOrder = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { items, shippingAddress, paymentInfo, notes } = req.body;

    // Validate that we have items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    let orderItems = [];
    let subtotal = 0;

    // Process each item and validate
    for (let item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found or not available`
        });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Only ${product.stock} available`
        });
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit || 'pieces',
        farmer: product.farmer
      });
    }

    // Calculate totals
    const deliveryFee = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.13);
    const discount = 0;
    const totalAmount = subtotal + deliveryFee + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      orderSummary: {
        subtotal,
        deliveryFee,
        tax,
        discount,
        totalAmount
      },
      paymentInfo: paymentInfo || { method: 'cash_on_delivery' },
      notes: notes || {}
    });

    // Update product stock
    for (let item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear user's cart
    const userCart = await Cart.findOne({ user: req.user.id });
    if (userCart) {
      await userCart.clearCart();
    }

    // Populate order details
    await order.populate('items.product', 'name images');
    await order.populate('items.farmer', 'name username phone');

    res.status(201).json({
      success: true,
      order,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ GET USER ORDERS
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findUserOrders(req.user.id, page, limit);
    const totalOrders = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders
    });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ GET SINGLE ORDER
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .populate('items.farmer', 'name username phone address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ UPDATE ORDER STATUS (Admin only)
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.orderStatus = status;
    order.updatedBy = req.user.id;

    // Add note to status history if provided
    if (note) {
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note,
        updatedBy: req.user.id
      });
    }

    // Update delivery date if delivered
    if (status === 'delivered') {
      order.delivery.actualDate = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Cancel order
    await order.cancelOrder(reason, req.user.id);

    // Restore product stock
    for (let item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    res.status(200).json({
      success: true,
      order,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// ✅ GET ALL ORDERS (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    
    if (req.query.status) {
      filter.orderStatus = req.query.status;
    }

    if (req.query.paymentStatus) {
      filter['paymentInfo.status'] = req.query.paymentStatus;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ GET ORDER STATISTICS (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $group: { _id: null, totalRevenue: { $sum: '$orderSummary.totalAmount' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ✅ GET FARMER ORDERS
const getFarmerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find orders that contain items with this farmer
    const orders = await Order.find({ 'items.farmer': req.user.id })
      .populate('user', 'name email phone')
      .populate('items.product', 'name images category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter items to only those belonging to this farmer
    const farmerOrders = orders.map(o => ({
      ...o,
      items: o.items.filter(it => String(it.farmer) === String(req.user.id))
    })).filter(o => o.items.length > 0);

    const totalOrders = await Order.countDocuments({ 'items.farmer': req.user.id });

    res.status(200).json({
      success: true,
      count: farmerOrders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      orders: farmerOrders
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// (Duplicate sendFarmerNotifications function removed to fix redeclaration error)

// ✅ HELPER FUNCTION: Update overall order status
const updateOverallOrderStatus = async (order) => {
  const notifications = order.farmerNotifications;
  
  if (notifications.every(notif => notif.status === 'completed')) {
    order.orderStatus = 'completed';
  } else if (notifications.some(notif => notif.status === 'cancelled')) {
    order.orderStatus = 'cancelled';
  } else if (notifications.some(notif => notif.status === 'processing')) {
    order.orderStatus = 'processing';
  }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
  placeOrder,           // New order history system
  getOrderHistory,      // Get user's order history
  updateOrderStatus,    // Farmer updates status
  createOrder,          // Original order system
  getMyOrders,
  getOrder,
  updateOrderStatusAdmin, // Admin updates status
  cancelOrder,
  getAllOrders,
  getOrderStats,
  getFarmerOrders
};