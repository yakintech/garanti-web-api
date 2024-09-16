const express = require('express');
const router = express.Router();
const WebUser = require('../models/webUser');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Joi Şeması
const webUserSchemaJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Tüm kullanıcıları listeleme
router.get('/', async (req, res) => {
  const users = await WebUser.find().select('-password -__v');
  res.send(users);
});

// Yeni kullanıcı oluşturma
router.post('/', async (req, res) => {
  // Joi ile doğrulama
  const { error } = webUserSchemaJoi.validate(req.body);
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const user = new WebUser(req.body);
  await user.save();
  res.status(201).send({ email: user.email, id: user._id });
});

// Kullanıcı giriş
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Kullanıcıyı bul
  const user = await WebUser.findOne({ email });
  if (!user) {
    return res.status(400).send({ error: 'Invalid email or password.' });
  }

  // Şifreyi doğrula
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send({ error: 'Invalid email or password.' });
  }

  // JWT oluştur
  const token = jwt.sign({ _id: user._id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
  res.send({ token });
});

// Kullanıcı güncelleme
router.put('/:id', async (req, res) => {
  // Joi ile doğrulama
  const { error } = webUserSchemaJoi.validate(req.body);
  if (error) {
    return res.status(422).send({ error: error.details[0].message });
  }

  const user = await WebUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  res.send({ email: user.email, id: user._id });
});

// Kullanıcı silme
router.delete('/:id', async (req, res) => {
  const user = await WebUser.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  res.send({ message: 'User deleted successfully' });
});

module.exports = router;