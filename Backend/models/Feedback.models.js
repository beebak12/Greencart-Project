const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    trim: true,
    maxlength: [300, 'Address cannot be more than 300 characters']
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    trim: true,
    minlength: [10, 'Feedback must be at least 10 characters'],
    maxlength: [1000, 'Feedback cannot be more than 1000 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  category: {
    type: String,
    enum: ['general', 'product', 'service', 'delivery', 'website', 'complaint', 'suggestion'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'responded', 'resolved'],
    default: 'pending'
  },
  isPublic: {
    type: Boolean,
    default: false // Whether feedback can be shown as testimonial
  },
  adminResponse: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Optional: if feedback is from a logged-in user
  },
  ipAddress: String,
  userAgent: String,
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'email', 'phone'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for better search performance
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ category: 1, createdAt: -1 });
feedbackSchema.index({ rating: 1 });

// Static method to get feedback statistics
feedbackSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  
  return stats;
};

// Static method to get recent feedback
feedbackSchema.statics.getRecent = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .select('-ipAddress -userAgent');
};

// Method to mark as reviewed
feedbackSchema.methods.markAsReviewed = function() {
  this.status = 'reviewed';
  return this.save();
};

// Method to respond to feedback
feedbackSchema.methods.respond = function(message, adminId) {
  this.adminResponse = {
    message: message,
    respondedBy: adminId,
    respondedAt: new Date()
  };
  this.status = 'responded';
  return this.save();
};

module.exports = mongoose.model('Feedback', feedbackSchema);