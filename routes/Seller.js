const express = require('express');
const router = express.Router();
const Seller = require('../models/Seller');

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

    const seller = new Seller({
      user: userId,
      namaToko,
      deskripsiToko,
      alamatToko,
      noHp,
      fotoProfil
    });

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