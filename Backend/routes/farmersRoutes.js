const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer.model');
const { protect } = require('../middleware/auth');

// List farmers
router.get('/', async (req, res) => {
  try {
    const farmers = await Farmer.find().select('-__v');
    res.json({ success: true, farmers });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get current farmer profile
router.get('/me', protect, async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ user: req.user.id });
    res.json({ success: true, farmer });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update farmer details
router.put('/me', protect, async (req, res) => {
  try {
    // Allow updating name/fullName, email, phone, address
    const allowed = ['fullName', 'name', 'email', 'phone', 'address'];
    const payload = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) payload[f] = req.body[f]; });
    // Map name -> fullName for storage consistency
    if (payload.name && !payload.fullName) {
      payload.fullName = payload.name;
      delete payload.name;
    }

    const farmer = await Farmer.findOneAndUpdate(
      { user: req.user.id },
      payload,
      { new: true }
    );

    res.json({ success: true, farmer, message: 'Farmer profile updated' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
