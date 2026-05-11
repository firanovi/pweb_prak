const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST - Login Seller
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: 'seller' });
    if (!user) return res.status(404).json({ message: 'Akun seller tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah!' });

    const seller = await Seller.findOne({ user: user._id });

    res.json({
      message: 'Login seller berhasil!',
      userId: user._id,
      sellerId: seller?._id,
      nama: user.nama,
      email: user.email,
      namaToko: seller?.namaToko
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil semua seller
router.get('/', async (req, res) => {
  try {
    const sellers = await Seller.find().populate('user', 'nama email');
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil profil toko berdasarkan userId
router.get('/:userId', async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.params.userId })
      .populate('user', 'nama email');
    if (!seller) return res.status(404).json({ message: 'Toko tidak ditemukan' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Daftarkan toko baru
router.post('/register', async (req, res) => {
  const { userId, namaToko, deskripsiToko, alamatToko, noHp, fotoProfil } = req.body;
  try {
    const existing = await Seller.findOne({ user: userId });
    if (existing) return res.status(400).json({ message: 'User sudah memiliki toko' });

    const seller = new Seller({ user: userId, namaToko, deskripsiToko, alamatToko, noHp, fotoProfil });
    await seller.save();
    res.status(201).json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update profil toko
router.put('/update/:userId', async (req, res) => {
  const { namaToko, deskripsiToko, alamatToko, noHp, fotoProfil } = req.body;
  try {
    const seller = await Seller.findOneAndUpdate(
      { user: req.params.userId },
      { namaToko, deskripsiToko, alamatToko, noHp, fotoProfil },
      { new: true }
    );
    if (!seller) return res.status(404).json({ message: 'Toko tidak ditemukan' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Hapus toko
router.delete('/delete/:userId', async (req, res) => {
  try {
    const seller = await Seller.findOneAndDelete({ user: req.params.userId });
    if (!seller) return res.status(404).json({ message: 'Toko tidak ditemukan' });
    res.json({ message: 'Toko berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;