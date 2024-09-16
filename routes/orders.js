const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Joi = require('joi');
const auth = require('../middleware/auth');

// Joi Şeması
const orderSchemaJoi = Joi.object({
  user: Joi.string().required(),
  status: Joi.string().valid('Pending', 'Shipped', 'Delivered', 'Cancelled'),
  totalAmount: Joi.number().required()
});

// Tüm siparişleri listeleme
router.get('/', auth, async (req, res) => {
  const orders = await Order.find().populate('user', 'email').select('-__v');
  res.send(orders);
});

// Yeni sipariş oluşturma
router.post('/', auth, async (req, res) => {
  const { error } = orderSchemaJoi.validate(req.body);
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const order = new Order(req.body);
  await order.save();
  res.status(201).send(order);
});

module.exports = router;