const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'farmers' });

module.exports = mongoose.model('Farmer', farmerSchema);
