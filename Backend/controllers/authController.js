const { validationResult } = require('express-validator');
const User = require('../models/user.models');
const CustomerSignup = require('../models/CustomerSignup.model');
const FarmerSignup = require('../models/FarmerSignup.model');
const Farmer = require('../models/Farmer.model');
const bcrypt = require('bcryptjs');
const { sendTokenResponse, verifyRefreshToken, generateToken } = require('../utils/jwtUtils');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
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

    const { name, username, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
      phone,
      role: role || 'user'
    });

    // Send token response
    sendTokenResponse(user, 201, res);
    
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
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

    const { email, password } = req.body;

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Send token response
    sendTokenResponse(user, 200, res);
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};



// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const fieldsToUpdate = {};
    const allowedFields = ['name', 'phone', 'address', 'avatar'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: newToken,
      user: user.getPublicProfile()
    });
    
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    })
    .status(200)
    .json({
      success: true,
      message: 'User logged out successfully'
    });
};

// Role-specific signup/login for compatibility
const customerSignup = async (req, res) => {
  try {
    const { fullName, email, phone, address, password } = req.body;
    if (!fullName || !email || !phone || !address || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const user = await User.create({ name: fullName, username: email, email, password, phone, address: { street: address }, role: 'user' });
    // store a mirror document in customersignup
    const passwordHash = await bcrypt.hash(password, 10);
    await CustomerSignup.create({ fullName, email, phone, address, passwordHash });
    return sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('customerSignup error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customerRec = await CustomerSignup.findOne({ email });
    if (!customerRec) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    const match = await bcrypt.compare(password, customerRec.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    return sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('customerLogin error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const farmerSignup = async (req, res) => {
  try {
    const { fullName, email, phone, address, password } = req.body;
    if (!fullName || !email || !phone || !address || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }
    const user = await User.create({ name: fullName, username: email, email, password, phone, address: { street: address }, role: 'farmer' });
    const passwordHash = await bcrypt.hash(password, 10);
    await FarmerSignup.create({ fullName, email, phone, address, passwordHash });
    await Farmer.create({ fullName, email, phone, address, user: user._id });
    return sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error('farmerSignup error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const farmerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmerRec = await FarmerSignup.findOne({ email });
    if (!farmerRec) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    const match = await bcrypt.compare(password, farmerRec.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    const user = await User.findOne({ email, role: 'farmer' });
    if (!user) {
      return res.status(401).json({ success: false, message: 'email and password doesnot match please try again' });
    }
    return sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('farmerLogin error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  customerSignup,
  customerLogin,
  farmerSignup,
  farmerLogin
};
