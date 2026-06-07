const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'delivered', 'cancelled'], default: 'pending' },
  orderType: { type: String, enum: ['pickup', 'delivery'], required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'debt'], default: 'unpaid' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
