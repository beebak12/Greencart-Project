const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Nepal'
    },
    deliveryInstructions: String
  },
  orderSummary: {
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, 'Delivery fee cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cash_on_delivery', 'esewa', 'khalti', 'bank_transfer', 'card'],
      default: 'cash_on_delivery'
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  orderStatus: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered',
      'cancelled',
      'returned'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed', 
        'processing',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned'
      ]
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  delivery: {
    expectedDate: Date,
    actualDate: Date,
    trackingNumber: String,
    courier: String,
    deliveryNotes: String
  },
  notes: {
    customerNotes: String,
    adminNotes: String,
    internalNotes: String
  },
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  }
}, {
  timestamps: true
});

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `GC${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Add status to history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.statusHistory.push({
      status: this.orderStatus,
      timestamp: new Date(),
      updatedBy: this.updatedBy || null
    });
  }
  next();
});

// Virtual for calculating total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function() {
  const cancelableStatuses = ['pending', 'confirmed', 'processing'];
  return cancelableStatuses.includes(this.orderStatus);
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy) {
  if (!this.canBeCancelled()) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  this.orderStatus = 'cancelled';
  this.cancellation = {
    reason: reason,
    cancelledBy: cancelledBy,
    cancelledAt: new Date()
  };
  
  return this.save();
};

// Static method to get orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status }).populate('user items.product');
};

// Static method to get user orders
orderSchema.statics.findUserOrders = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return this.find({ user: userId })
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Order', orderSchema);