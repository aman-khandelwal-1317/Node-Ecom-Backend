const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
  orderItems: [
    {
      qty: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingAddress: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Address',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'ready to ship', 'shipped', 'delivered'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
