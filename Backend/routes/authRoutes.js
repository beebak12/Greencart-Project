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




const User = require("../models/user.models"); // adjust path if needed
const nodemailer = require("nodemailer");

// ============================
// Forgot Password Route
// ============================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    // 2. Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Email content (sending original password — as per your request)
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Greencart Account Password",
      text: `Hello ${user.name},\n\nYour password is: ${user.password}\n\nPlease keep it safe.`,
    };

    // 4. Send email
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Password sent to your email!" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

module.exports = router;


