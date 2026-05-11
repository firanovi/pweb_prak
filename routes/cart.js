const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET - Ambil cart user
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.produk');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Tambah item ke cart
router.post('/add', async (req, res) => {
  const { userId, produkId, jumlah, harga } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Cek apakah produk sudah ada di cart
    const itemIndex = cart.items.findIndex(
      item => item.produk.toString() === produkId
    );

    if (itemIndex > -1) {
      // Kalau sudah ada, tambah jumlahnya
      cart.items[itemIndex].jumlah += jumlah;
    } else {
      // Kalau belum ada, tambah item baru
      cart.items.push({ produk: produkId, jumlah, harga });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT - Update jumlah item di cart
router.put('/update', async (req, res) => {
  const { userId, produkId, jumlah } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart tidak ditemukan' });
 
    const item = cart.items.find(i => i.produk.toString() === produkId);
    if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' });
 
    if (jumlah <= 0) {
      cart.items = cart.items.filter(i => i.produk.toString() !== produkId);
    } else {
      item.jumlah = jumlah;
    }
 
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Hapus item dari cart
router.delete('/remove', async (req, res) => {
  const { userId, produkId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart tidak ditemukan' });

    cart.items = cart.items.filter(
      item => item.produk.toString() !== produkId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Kosongkan cart
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.params.userId },
      { items: [] }
    );
    res.json({ message: 'Cart berhasil dikosongkan' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;