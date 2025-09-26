const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {
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
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');

const User = require("../models/user.models");

const router = express.Router();

// ============================
// Public routes
// ============================
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);

// Role-specific routes
router.post('/customer/signup', customerSignup);
router.post('/customer/login', customerLogin);
router.post('/farmer/signup', farmerSignup);
router.post('/farmer/login', farmerLogin);

// ============================
// Forgot Password (secure way)
// ============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    // 2. Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // 3. Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      text: `Hi ${user.name},\n\nPlease click the link below to reset your password:\n${resetUrl}\n\nIf you did not request this, please ignore.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Password reset link sent to email!" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

// ============================
// Protected routes
// ============================
router.use(protect);
router.get('/me', getMe);
router.put('/profile', validateProfileUpdate, updateProfile);
router.put('/password', validatePasswordChange, changePassword);
router.post('/logout', logout);

module.exports = router;
