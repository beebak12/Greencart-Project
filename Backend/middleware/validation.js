const { body } = require('express-validator');

// Registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('role')
    .optional()
    .isIn(['user', 'farmer', 'admin'])
    .withMessage('Role must be either user, farmer, or admin')
];

// Login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
    
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('address.street')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Street address cannot exceed 100 characters'),
    
  body('address.city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City cannot exceed 50 characters'),
    
  body('address.state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State cannot exceed 50 characters'),
    
  body('address.zipCode')
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage('Zip code cannot exceed 10 characters'),
    
  body('address.country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country cannot exceed 50 characters')
];

// Change password validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
    
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
    
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
    
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
    
  body('originalPrice')
    .optional()
    .isNumeric()
    .withMessage('Original price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Original price cannot be negative'),
    
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['fruits', 'vegetables', 'grains', 'dairy', 'meat', 'spices', 'beverages', 'organic', 'others'])
    .withMessage('Invalid category'),
    
  body('stock')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isNumeric()
    .withMessage('Stock must be a number')
    .isInt({ min: 0 })
    .withMessage('Stock cannot be negative'),
    
  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .isIn(['kg', 'grams', 'pieces', 'liters', 'ml', 'dozen', 'bundle'])
    .withMessage('Invalid unit'),
    
  body('minOrderQuantity')
    .optional()
    .isNumeric()
    .withMessage('Minimum order quantity must be a number')
    .isInt({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),
    
  body('maxOrderQuantity')
    .optional()
    .isNumeric()
    .withMessage('Maximum order quantity must be a number')
    .isInt({ min: 1 })
    .withMessage('Maximum order quantity must be at least 1')
];

// Order validation
const validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
    
  body('items.*.product')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
    
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
    
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
    
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
    
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
    
  body('paymentInfo.method')
    .optional()
    .isIn(['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer', 'card'])
    .withMessage('Invalid payment method')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateProduct,
  validateOrder
};