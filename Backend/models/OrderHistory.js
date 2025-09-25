const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true,
        required: true
    },
    customer: {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        farmerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        farmerName: { type: String, required: true },
        farmerEmail: { type: String, required: true }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    farmerNotifications: [{
        farmerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        farmerName: { type: String, required: true },
        notified: { type: Boolean, default: false },
        notificationDate: { type: Date },
        status: { 
            type: String, 
            enum: ['pending', 'accepted', 'rejected'], 
            default: 'pending' 
        }
    }],
    orderDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

// Generate unique order ID
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('OrderHistory', orderSchema);