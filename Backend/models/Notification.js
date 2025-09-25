const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['order_received', 'status_update', 'general'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'OrderHistory' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);