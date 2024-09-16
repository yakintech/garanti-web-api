const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const webUsersRoute = require('./routes/webUsers');
const ordersRoute = require('./routes/orders'); // Yeni order rotasını ekleyin
const orderDetailsRoute = require('./routes/orderDetails'); // Yeni orderDetail rotasını ekleyin

// Çevresel değişkenleri yükleyin
dotenv.config();

const app = express();
const port = 3000;

// Helmet kullanarak HTTP başlıklarını güvenli hale getirin
app.use(helmet());

// Rate limiting yapılandırması
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // 15 dakika içinde maksimum 100 istek
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(limiter); // Rate limiting middleware'ini kullanın

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI);

// Rotalar
app.use('/categories', categoriesRoute);
app.use('/products', productsRoute);
app.use('/webUsers', webUsersRoute);
app.use('/orders', ordersRoute); // Yeni order rotasını ekleyin
app.use('/orderDetails', orderDetailsRoute); // Yeni orderDetail rotasını ekleyin

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});