const mongoose = require('mongoose');

const categorySnapshot = {
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  description: String,
  price: Number,
  images: [{ url: String, alt: String }],
  stock: Number,
  unit: String,
  farmerName: String,
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
};

const fruitsSchema = new mongoose.Schema(categorySnapshot, { collection: 'fruits' });
const vegetablesSchema = new mongoose.Schema(categorySnapshot, { collection: 'vegetables' });
const grainsSchema = new mongoose.Schema(categorySnapshot, { collection: 'grains' });

module.exports = {
  FruitDoc: mongoose.model('FruitDoc', fruitsSchema),
  VegetableDoc: mongoose.model('VegetableDoc', vegetablesSchema),
  GrainDoc: mongoose.model('GrainDoc', grainsSchema)
};
