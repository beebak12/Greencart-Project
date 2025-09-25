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
  getFarmerOrders
} = require('../controllers/orderController');

const { protect, adminOnly, farmerOnly } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', validateOrder, createOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);

// ✅ NEW ORDER HISTORY ROUTES
router.post('/place-order', placeOrder);
router.get('/history/:userId', getOrderHistory);

// ✅ FARMER ROUTES (Updated)
router.get('/farmer/orders', farmerOnly, getFarmerOrders); // Get farmer's orders
router.put('/farmer/update-status/:orderId', farmerOnly, updateOrderStatus); // Farmer updates status

// ✅ ADMIN ROUTES
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getOrderStats);
router.put('/admin/update-status/:id', adminOnly, updateOrderStatus); // Admin updates status

module.exports = router;