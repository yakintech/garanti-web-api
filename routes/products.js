const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Joi = require('joi');
const moment = require('moment');

// Joi Şeması
const productSchemaJoi = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).max(1000000).required(),
  category: Joi.string().required()
});

router.get('/', async (req, res) => {
  const products = await Product.find().select('-__v').populate('category', 'name');
  const response = products.map(product => ({
    name: product.name,
    categoryName: product.category.name,
    id: product._id,
    unitPrice: product.price,
    createdAt: moment(product.createdAt).format('DD MMMM YYYY')
  }));
  res.send(response);
});

router.post('/', async (req, res) => {
  // Joi ile doğrulama
  const { error } = productSchemaJoi.validate(req.body);
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const product = new Product(req.body);
  await product.save();
  res.status(201).send(product);
});

module.exports = router;