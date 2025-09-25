const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  placeOrder,
  getOrderHistory,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  getFarmerOrders,
  updateOrderStatusAdmin
} = require('../controllers/orderController');

const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', validateOrder, createOrder); // ✅ FIXED: Single middleware array
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// ✅ ORDER HISTORY ROUTES (New system - uses different validation)
router.post('/place-order', placeOrder); // Uses custom validation in controller
router.get('/history/:userId', getOrderHistory);

// ✅ FARMER ROUTES
router.get('/farmer/orders', farmerOnly, getFarmerOrders);
router.put('/farmer/update-status/:orderId', farmerOnly, updateOrderStatus);

// ✅ ADMIN ROUTES
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getOrderStats);
router.put('/admin/update-status/:id', adminOnly, updateOrderStatusAdmin);

module.exports = router;