const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST - Register
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(404).json({ message: 'Email sudah terdaftar!' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ nama, email, password: hashed });
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
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email atau Password salah!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email atau Password salah!' });

    res.json({ userId: user._id, nama: user.nama, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Ganti Password
router.post('/change-password', async (req, res) => {
  const { userId, passwordLama, passwordBaru } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah!' });

    user.password = await bcrypt.hash(passwordBaru, 10);
    await user.save();

    res.json({ message: 'Password berhasil diubah!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil data user
router.get('/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update data user
router.put('/user/:userId', async (req, res) => {
  const { nama, noHp, email, alamat } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { nama, noHp, email, alamat },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;