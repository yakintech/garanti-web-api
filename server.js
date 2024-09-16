const express = require('express');
const mongoose = require('mongoose');

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

const Category = mongoose.model('Category', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    description: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}));

// Rotalar

app.post('/categories', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});