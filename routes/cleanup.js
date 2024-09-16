const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const WebUser = require('../models/webUser');
const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const auth = require('../middleware/auth'); // Sadece yetkili kullanıcıların erişebilmesi için auth middleware'i ekleyin

// Tüm koleksiyonları temizleme
router.delete('/', auth, async (req, res) => {
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await WebUser.deleteMany({});
    await Order.deleteMany({});
    await OrderDetail.deleteMany({});
    res.send({ message: 'All collections have been cleared.' });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while clearing the collections.' });
  }
});

module.exports = router;