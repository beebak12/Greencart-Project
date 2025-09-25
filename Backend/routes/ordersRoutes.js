const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  getFarmerOrders
} = require('../controllers/orderController');

const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', validateOrder, createOrder);
router.get('/', getMyOrders);
// Farmer route to get orders containing their items
router.get('/farmer', farmerOnly, getFarmerOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getOrderStats);
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;