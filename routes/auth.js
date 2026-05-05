const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST - Ganti Password
router.post('/change-password', async (req, res) => {
  const { userId, passwordLama, passwordBaru } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    // Cek password lama
    const isMatch = await bcrypt.compare(passwordLama, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password lama salah!' });

    // Hash password baru
    const hashed = await bcrypt.hash(passwordBaru, 10);
    user.password = hashed;
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