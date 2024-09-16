const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');

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

// Model Tanımlama
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  description: String
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// Rotalar
app.get('/categories', async (req, res) => {
  const categories = await Category.find().select('-__v');
  res.send(categories);
});

app.post('/categories', async (req, res) => {
    const category = new Category(req.body);
    await category.save();
    res.status(201).send(category);
});

app.get('/products', async (req, res) => {
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

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
});

app.delete('/products/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).send({ error: 'Product not found' });
    }
    res.send(product);
});

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});