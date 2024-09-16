const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/orderDetail');
const Joi = require('joi');
const auth = require('../middleware/auth');

// Joi Şeması
const orderDetailSchemaJoi = Joi.object({
  order: Joi.string().required(),
  product: Joi.string().required(),
  quantity: Joi.number().required(),
  unitPrice: Joi.number().required()
});

// Tüm sipariş detaylarını listeleme
router.get('/', auth, async (req, res) => {
  const orderDetails = await OrderDetail.find().populate('order product', 'orderDate name').select('-__v');
  res.send(orderDetails);
});

// Yeni sipariş detayı oluşturma
router.post('/', auth, async (req, res) => {
  const { error } = orderDetailSchemaJoi.validate(req.body);
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const orderDetail = new OrderDetail(req.body);
  await orderDetail.save();
  res.status(201).send(orderDetail);
});

module.exports = router;