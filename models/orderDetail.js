const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('OrderDetail', orderDetailSchema);