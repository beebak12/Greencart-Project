const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user can have only one cart
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update cart totals before saving
cartSchema.pre('save', function(next) {
  // Calculate total items and total amount
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.updatedAt = Date.now();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );

  if (existingItemIndex >= 0) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = price; // Update price in case it changed
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity: quantity,
      price: price
    });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const itemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString()
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      this.items.splice(itemIndex, 1);
    } else {
      this.items[itemIndex].quantity = quantity;
    }
  }

  return this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Method to get cart with populated product details
cartSchema.methods.getPopulatedCart = function() {
  return this.populate({
    path: 'items.product',
    select: 'name price images stock unit category isActive',
    match: { isActive: true } // Only include active products
  });
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId });
  
  if (!cart) {
    cart = await this.create({ user: userId, items: [] });
  }
  
  return cart;
};

module.exports = mongoose.model('Cart', cartSchema);