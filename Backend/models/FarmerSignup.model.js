const mongoose = require('mongoose');

const farmerSignupSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'farmersignup' });

module.exports = mongoose.model('FarmerSignup', farmerSignupSchema);
