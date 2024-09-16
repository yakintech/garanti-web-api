const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Joi = require('joi');
const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth'); // Auth middleware'ini içe aktarın

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
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
  image: Joi.string().required()
});

router.get('/', async (req, res) => {
  const products = await Product.find().select('-__v').populate('category', 'name');
  const response = products.map(product => ({
    name: product.name,
    categoryName: product.category.name,
    id: product._id,
    unitPrice: product.price,
    image: product.image,
    createdAt: moment(product.createdAt).format('DD MMMM YYYY')
  }));
  res.send(response);
});

router.post('/', [auth, upload.single('image')], async (req, res) => {
  const { error } = productSchemaJoi.validate({ ...req.body, image: req.file.path });
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const product = new Product({
    ...req.body,
    image: req.file.path
  });
  await product.save();
  res.status(201).send(product);
});

module.exports = router;