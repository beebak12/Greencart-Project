const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getMyProducts,
  addProductReview
} = require('../controllers/productController');

const { protect, farmerOnly, optionalAuth } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProducts);
router.get('/category/:category', getProductsByCategory);
// Important: define this before '/:id' so it isn't captured as ':id'
router.get('/my/products', protect, getMyProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect); // All routes after this middleware are protected

// User routes
router.post('/:id/reviews', addProductReview);

// Allow any authenticated user to add/update/delete products (auto-approval)
router.post('/', protect, validateProduct, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;