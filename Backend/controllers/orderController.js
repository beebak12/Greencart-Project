const { validationResult } = require('express-validator');
const Order = require('../models/Order.models');
const Cart = require('../models/Cart.models');
const Product = require('../models/Product.models');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
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

    // Calculate delivery fee (you can customize this logic)
    const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery over Rs. 500

    // Calculate tax (13% VAT in Nepal)
    const tax = Math.round(subtotal * 0.13);

    // Apply any discount (you can add discount logic here)
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

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
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

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
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

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
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

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin only)
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

// @desc    Get orders that include items for the current farmer
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  getFarmerOrders
};
