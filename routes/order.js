const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET - Ambil semua order user (history)
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.produk')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil order aktif user (belum selesai/dibatalkan)
router.get('/aktif/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
      status: { $in: ['pending', 'diproses', 'dikirim'] }
    })
      .populate('items.produk')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Buat order baru
router.post('/', async (req, res) => {
  const { userId, items, totalHarga, alamatPengiriman, metodePembayaran } = req.body;
  try {
    const order = new Order({
      user: userId,
      items,
      totalHarga,
      alamatPengiriman,
      metodePembayaran,
      status: 'pending'
    });
    await order.save();

    // Kosongkan cart setelah order dibuat
    const Cart = require('../models/Cart');
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;