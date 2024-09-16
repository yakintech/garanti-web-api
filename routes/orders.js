const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const auth = require('../middleware/auth');

// Tüm siparişleri detaylarıyla birlikte listeleme
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'email').lean();
    const orderIds = orders.map(order => order._id);

    const orderDetails = await OrderDetail.find({ order: { $in: orderIds } }).populate('product', 'name price').lean();

    const ordersWithDetails = orders.map(order => {
      return {
        ...order,
        details: orderDetails.filter(detail => detail.order.toString() === order._id.toString())
      };
    });

    res.send(ordersWithDetails);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching orders with details.' });
  }
});

module.exports = router;