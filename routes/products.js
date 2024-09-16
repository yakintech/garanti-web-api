const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Joi = require('joi');
const moment = require('moment');
const multer = require('multer');
const path = require('path');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Joi Şeması
const productSchemaJoi = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).max(1000000).required(),
  category: Joi.string().required(),
  image: Joi.string().required() // Yeni image alanı
});

router.get('/', async (req, res) => {
  const products = await Product.find().select('-__v').populate('category', 'name');
  const response = products.map(product => ({
    name: product.name,
    categoryName: product.category.name,
    id: product._id,
    unitPrice: product.price,
    image: product.image, // Image alanını ekleyin
    createdAt: moment(product.createdAt).format('DD MMMM YYYY')
  }));
  res.send(response);
});

router.post('/', upload.single('image'), async (req, res) => {
  // Dosya türü kontrolü
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(req.file.originalname).toLowerCase());
  const mimetype = fileTypes.test(req.file.mimetype);

  if (!extname || !mimetype) {
    return res.status(400).send({ error: 'Only jpeg, jpg, and png files are allowed' });
  }

  // Joi ile doğrulama
  if (!req.file) {
    return res.status(400).send({ error: 'Image file is required' });
  }

  const { error } = productSchemaJoi.validate({ ...req.body, image: req.file.path });
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const product = new Product({
    ...req.body,
    image: req.file.path // Image alanını ekleyin
  });
  await product.save();
  res.status(201).send(product);
});

module.exports = router;