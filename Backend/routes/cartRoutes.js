const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;