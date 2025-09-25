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
        image: { type: String }, // ✅ ADDED THIS FIELD
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
        fullName: { type: String, required: true }, // ✅ ADDED fullName
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true } // ✅ ADDED phone
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'COD', 'Online'], // ✅ EXPANDED options
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'], // ✅ EXPANDED options
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
            enum: ['pending', 'accepted', 'rejected', 'processing', 'completed', 'cancelled'], // ✅ EXPANDED options
            default: 'pending' 
        }
    }],
    orderDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    // ✅ ADDED new fields for better functionality
    deliveryInstructions: { type: String, default: '' },
    specialNotes: { type: String, default: '' }
}, {
    timestamps: true // ✅ ADDED timestamps for createdAt, updatedAt
});

// Generate unique order ID
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        this.orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    this.lastUpdated = new Date();
    next();
});

// ✅ ADDED: Method to update farmer notification status
orderSchema.methods.updateFarmerNotification = function(farmerId, status) {
    const notification = this.farmerNotifications.find(notif => 
        notif.farmerId.toString() === farmerId.toString()
    );
    
    if (notification) {
        notification.status = status;
        notification.notificationDate = new Date();
        if (status !== 'pending') {
            notification.notified = true;
        }
    }
};

// ✅ ADDED: Method to update overall order status based on farmer notifications
orderSchema.methods.updateOverallStatus = function() {
    const notifications = this.farmerNotifications;
    
    if (notifications.length === 0) return;
    
    if (notifications.every(notif => notif.status === 'completed')) {
        this.orderStatus = 'completed';
    } else if (notifications.some(notif => notif.status === 'cancelled')) {
        this.orderStatus = 'cancelled';
    } else if (notifications.some(notif => notif.status === 'processing')) {
        this.orderStatus = 'processing';
    } else if (notifications.every(notif => notif.status === 'accepted')) {
        this.orderStatus = 'confirmed';
    }
};

// ✅ ADDED: Static method to find orders by customer
orderSchema.statics.findByCustomer = function(userId) {
    return this.find({ 'customer.userId': userId }).sort({ orderDate: -1 });
};

// ✅ ADDED: Static method to find orders by farmer
orderSchema.statics.findByFarmer = function(farmerId) {
    return this.find({ 
        'items.farmerId': farmerId 
    }).sort({ orderDate: -1 });
};

module.exports = mongoose.model('OrderHistory', orderSchema);