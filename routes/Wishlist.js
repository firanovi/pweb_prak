const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// GET - Ambil wishlist user
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.params.userId })
      .populate('items.produk');
    if (!wishlist) return res.json({ items: [] });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Tambah produk ke wishlist
router.post('/add', async (req, res) => {
  const { userId, produkId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, items: [] });
    }

    // Cek apakah produk sudah ada di wishlist
    const sudahAda = wishlist.items.some(
      item => item.produk.toString() === produkId
    );

    if (sudahAda) {
      return res.status(400).json({ message: 'Produk sudah ada di wishlist' });
    }

    wishlist.items.push({ produk: produkId });
    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Hapus produk dari wishlist
router.delete('/remove', async (req, res) => {
  const { userId, produkId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist tidak ditemukan' });

    wishlist.items = wishlist.items.filter(
      item => item.produk.toString() !== produkId
    );

    await wishlist.save();
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Kosongkan wishlist
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.params.userId },
      { items: [] }
    );
    res.json({ message: 'Wishlist berhasil dikosongkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;