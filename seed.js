const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Category = require('./models/category');
const Product = require('./models/product');
const WebUser = require('./models/webUser');
const Order = require('./models/order');
const OrderDetail = require('./models/orderDetail');

// Çevresel değişkenleri yükleyin
dotenv.config();

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test verilerini ekleme fonksiyonu
async function seedDatabase() {
  try {
    // Kategorileri ekleyin
    const categories = [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Clothing' }
    ];
    const insertedCategories = await Category.insertMany(categories);
    console.log('Categories added');

    // Kategori ID'lerini alın
    const electronicsCategoryId = insertedCategories.find(cat => cat.name === 'Electronics')._id;
    const booksCategoryId = insertedCategories.find(cat => cat.name === 'Books')._id;
    const clothingCategoryId = insertedCategories.find(cat => cat.name === 'Clothing')._id;

    // Ürünleri ekleyin
    const products = [
      { name: 'Laptop', price: 1000, category: electronicsCategoryId, image: 'laptop.jpg' },
      { name: 'Smartphone', price: 500, category: electronicsCategoryId, image: 'smartphone.jpg' },
      { name: 'Novel', price: 20, category: booksCategoryId, image: 'novel.jpg' }
    ];
    const insertedProducts = await Product.insertMany(products);
    console.log('Products added');

    // Ürün ID'lerini alın
    const laptopId = insertedProducts.find(product => product.name === 'Laptop')._id;
    const smartphoneId = insertedProducts.find(product => product.name === 'Smartphone')._id;
    const novelId = insertedProducts.find(product => product.name === 'Novel')._id;

    // Kullanıcıları ekleyin
    const users = [
      { email: 'user1@example.com', password: bcrypt.hashSync('password1', 10) },
      { email: 'user2@example.com', password: bcrypt.hashSync('password2', 10) }
    ];
    const insertedUsers = await WebUser.insertMany(users);
    console.log('Users added');

    // Kullanıcı ID'lerini alın
    const user1Id = insertedUsers.find(user => user.email === 'user1@example.com')._id;
    const user2Id = insertedUsers.find(user => user.email === 'user2@example.com')._id;

    // Siparişleri ekleyin
    const orders = [
      { user: user1Id, totalAmount: 1020 },
      { user: user2Id, totalAmount: 500 }
    ];
    const insertedOrders = await Order.insertMany(orders);
    console.log('Orders added');

    // Sipariş ID'lerini alın
    const order1Id = insertedOrders[0]._id;
    const order2Id = insertedOrders[1]._id;

    // Sipariş detaylarını ekleyin
    const orderDetails = [
      { order: order1Id, product: laptopId, quantity: 1, unitPrice: 1000 },
      { order: order1Id, product: novelId, quantity: 1, unitPrice: 20 },
      { order: order2Id, product: smartphoneId, quantity: 1, unitPrice: 500 }
    ];
    await OrderDetail.insertMany(orderDetails);
    console.log('Order details added');

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Veritabanını seed et
seedDatabase();