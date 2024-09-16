const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const auth = require('../middleware/auth'); // Auth middleware'ini içe aktarın

router.get('/', async (req, res) => {
  const categories = await Category.find().select('-__v');
  res.send(categories);
});

router.post('/', auth, async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});

module.exports = router;