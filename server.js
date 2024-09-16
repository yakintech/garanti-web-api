const express = require('express');
const mongoose = require('mongoose');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Statik dosya servisi

// MongoDB Bağlantısı
mongoose.connect('mongodb+srv://user_garanti:sWYRaGRpj8VuWxK1@cluster0.jcus0vv.mongodb.net/garanti-db');

// Rotalar
app.use('/categories', categoriesRoute);
app.use('/products', productsRoute);

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});