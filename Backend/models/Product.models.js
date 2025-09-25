const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'fruits',
      'vegetables', 
      'grains',
      'dairy',
      'meat',
      'spices',
      'beverages',
      'organic',
      'others'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit'],
    enum: ['kg', 'grams', 'pieces', 'liters', 'ml', 'dozen', 'bundle']
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  maxOrderQuantity: {
    type: Number,
    min: [1, 'Maximum order quantity must be at least 1']
  },
  farmerName: { type: String, trim: true },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must belong to a farmer']
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [300, 'Review comment cannot be more than 300 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  origin: {
    type: String,
    trim: true
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Check if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Create index for better search performance
productSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  tags: 'text'
});

productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ farmer: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

// Update ratings when reviews are added
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.ratings.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.ratings.count = this.reviews.length;
  }
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);