const express = require('express');
const mongoose = require('mongoose');
const categoriesRoute = require('./routes/categories');
const productsRoute = require('./routes/products');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Bağlantısı
mongoose.connect('mongodb+srv://user_garanti:sWYRaGRpj8VuWxK1@cluster0.jcus0vv.mongodb.net/garanti-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Rotalar
app.use('/categories', categoriesRoute);
app.use('/products', productsRoute);

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});