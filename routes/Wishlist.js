const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// GET - Ambil wishlist user
router.get('/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.params.userId
    }).populate('items');

    if (!wishlist) {
      return res.json({ items: [] });
    }

    res.json(wishlist);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Tambah produk ke wishlist
router.post('/add', async (req, res) => {
  try {
    const { userId, produkId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }

    const sudahAda = wishlist.items.some(
      item => item.toString() === produkId
    );

    if (sudahAda) {
      return res.status(400).json({
        message: 'Produk sudah ada di wishlist'
      });
    }

    wishlist.items.push(produkId);

    await wishlist.save();

    res.status(200).json({
      message: 'Produk berhasil ditambahkan ke wishlist'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Hapus produk dari wishlist
router.delete('/remove', async (req, res) => {
  try {
    const { userId, produkId } = req.body;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        message: 'Wishlist tidak ditemukan'
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item.toString() !== produkId
    );

    await wishlist.save();

    res.json({
      message: 'Produk berhasil dihapus dari wishlist',
      wishlist
    });

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

    res.json({
      message: 'Wishlist berhasil dikosongkan'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;