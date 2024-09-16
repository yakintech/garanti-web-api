const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Bağlantısı
mongoose.connect('mongodb+srv://user_garanti:sWYRaGRpj8VuWxK1@cluster0.jcus0vv.mongodb.net/catchme-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Model Tanımlama
const Item = mongoose.model('Item', new mongoose.Schema({
  name: String,
  quantity: Number
}));

// Rotalar
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.send(items);
});

app.post('/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.send(item);
});

// Sunucuyu Başlatma
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});