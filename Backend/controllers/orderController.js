const { validationResult } = require('express-validator');
const Order = require('../models/Order.models');
const Cart = require('../models/Cart.models');
const Product = require('../models/Product.models');
const OrderHistory = require('../models/OrderHistory');

// ✅ PLACE ORDER FUNCTION (for new order history system)
const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const customer = req.user;

    // Create farmer notifications
    const farmerNotifications = [];
    const uniqueFarmers = new Map();

    for (let item of items) {
      if (!uniqueFarmers.has(item.farmerId)) {
        uniqueFarmers.set(item.farmerId, {
          farmerId: item.farmerId,
          farmerName: item.farmerName,
          notified: false,
          notificationDate: null,
          status: 'pending'
        });
      }
    }

    farmerNotifications.push(...uniqueFarmers.values());

    // Create order history
    const order = new OrderHistory({
      customer: {
        userId: customer._id || customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      items: items,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      farmerNotifications: farmerNotifications
    });

    // Save order
    const savedOrder = await order.save();

    // Notify farmers
    await sendFarmerNotifications(savedOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: savedOrder
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order: ' + error.message
    });
  }
};

// ✅ GET ORDER HISTORY FUNCTION
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    const orders = await OrderHistory.find({ 'customer.userId': userId })
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order history' 
    });
  }
};

// ✅ UPDATE ORDER STATUS BY FARMER
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { itemId, status } = req.body;

    const order = await OrderHistory.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Update specific item status
    const item = order.items.id(itemId);
    if (item) {
      // Update farmer notification status
      const farmerNotification = order.farmerNotifications.find(
        notif => notif.farmerId.toString() === item.farmerId.toString()
      );
      
      if (farmerNotification) {
        farmerNotification.status = status;
        farmerNotification.notificationDate = new Date();
      }

      order.lastUpdated = new Date();
      await order.save();

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        order: order
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Item not found in order'
      });
    }

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating order status' 
    });
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

// ✅ HELPER FUNCTION: Send farmer notifications
const sendFarmerNotifications = async (order) => {
  try {
    order.farmerNotifications.forEach(async (notification) => {
      console.log(`📧 Notification sent to farmer: ${notification.farmerName}`);
      console.log(`📦 Order Details: ${order.items.filter(item => 
        item.farmerId.toString() === notification.farmerId.toString()
      ).map(item => item.name).join(', ')}`);
      
      notification.notified = true;
      notification.notificationDate = new Date();
    });

    await order.save();
    
  } catch (error) {
    console.error('Error sending farmer notifications:', error);
  }
};

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