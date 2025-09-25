const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  logout
} = require('../controllers/authController');
const { customerSignup, customerLogin, farmerSignup, farmerLogin } = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Role-specific public routes for app compatibility
router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);
router.post('/farmer/signup', farmerSignup);
router.post('/farmer/login', farmerLogin);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/password', validatePasswordChange, changePassword);
router.post('/logout', logout);

module.exports = router;