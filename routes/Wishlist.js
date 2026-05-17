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

// POST - Pindahkan item dari wishlist ke cart
router.post('/move-to-cart', async (req, res) => {
  const { userId, produkId } = req.body;
  try {
    const Produk = require('../models/Produk');
    const Cart   = require('../models/Cart');

    const produk = await Produk.findById(produkId);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    // Tambah ke cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const idx = cart.items.findIndex(i => i.produk.toString() === produkId);
    if (idx > -1) {
      cart.items[idx].jumlah += 1;
    } else {
      cart.items.push({ produk: produkId, jumlah: 1, harga: produk.harga });
    }
    await cart.save();

    // Hapus dari wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(i => i.produk.toString() !== produkId);
      await wishlist.save();
    }

    res.json({ message: 'Berhasil dipindahkan ke cart' });
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