const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST - Register User
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar!' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ nama, email, password: hashed, role: 'user' });
    await user.save();

    res.status(201).json({ message: 'Registrasi berhasil!', userId: user._id, nama: user.nama });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: 'user' });
    if (!user) return res.status(404).json({ message: 'Email tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah!' });

    res.json({ message: 'Login berhasil!', userId: user._id, nama: user.nama, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;