const { validationResult } = require('express-validator');
const Product = require('../models/Product.models');
const User = require('../models/user.models');
const { FruitDoc, VegetableDoc, GrainDoc } = require('../models/CategorySnapshots.models');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isActive: true };
    
    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Organic filter
    if (req.query.organic === 'true') {
      filter.isOrganic = true;
    }

    // Featured filter
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    // In stock filter
    if (req.query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Sort options
    let sortOption = {};
    switch (req.query.sort) {
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { 'ratings.average': -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(filter)
      .populate('farmer', 'name username')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages,
      currentPage: page,
      products
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name username phone address')
      .populate('reviews.user', 'name username');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not available'
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Get product error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmer/Admin only)
const createProduct = async (req, res) => {
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

    // Add farmer to product data
    req.body.farmer = req.user.id;
    if (req.body.farmerName == null) {
      const u = await User.findById(req.user.id);
      req.body.farmerName = u?.name || '';
    }
    // If imageBase64 provided, map to images array
    if (req.body.imageBase64 && !req.body.images) {
      req.body.images = [{ url: req.body.imageBase64, alt: req.body.name, isPrimary: true }];
    }

    const product = await Product.create(req.body);

    // Mirror into category collections
    const snapshot = {
      product: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      stock: product.stock,
      unit: product.unit,
      farmerName: product.farmerName,
      farmer: product.farmer
    };
    if (product.category === 'fruits') await FruitDoc.create(snapshot);
    if (product.category === 'vegetables') await VegetableDoc.create(snapshot);
    if (product.category === 'grains') await GrainDoc.create(snapshot);

    // Populate farmer data
    await product.populate('farmer', 'name username');

    res.status(201).json({
      success: true,
      product,
      message: 'Product created successfully'
    });

  } catch (error) {
    console.error('Create product error:', error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Owner/Admin only)
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // If imageBase64 provided, map to images array
    if (req.body.imageBase64 && !req.body.images) {
      req.body.images = [{ url: req.body.imageBase64, alt: req.body.name, isPrimary: true }];
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('farmer', 'name username');

    // Update snapshot docs
    const snapshot = {
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      stock: product.stock,
      unit: product.unit,
      farmerName: product.farmerName
    };
    if (product.category === 'fruits') await FruitDoc.findOneAndUpdate({ product: product._id }, snapshot, { upsert: true });
    if (product.category === 'vegetables') await VegetableDoc.findOneAndUpdate({ product: product._id }, snapshot, { upsert: true });
    if (product.category === 'grains') await GrainDoc.findOneAndUpdate({ product: product._id }, snapshot, { upsert: true });

    res.status(200).json({
      success: true,
      product,
      message: 'Product updated successfully'
    });

  } catch (error) {
    console.error('Update product error:', error);

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Owner/Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Remove snapshots
    await FruitDoc.deleteOne({ product: req.params.id });
    await VegetableDoc.deleteOne({ product: req.params.id });
    await GrainDoc.deleteOne({ product: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);

    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const products = await Product.find({ 
      category, 
      isActive: true 
    })
      .populate('farmer', 'name username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ 
      category, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      category,
      products
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get farmer's products
// @route   GET /api/products/my-products
// @access  Private (Farmer only)
const getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ farmer: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({ farmer: req.user.id });

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products
    });

  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    await product.calculateAverageRating();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getMyProducts,
  addProductReview
};