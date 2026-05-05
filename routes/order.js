const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// GET - Ambil semua order (bisa filter by seller lewat query)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.seller) {
      // Cari order yang mengandung produk milik seller ini
      const Produk = require('../models/Produk');
      const produkSeller = await Produk.find({ seller: req.query.seller }).select('_id');
      const produkIds = produkSeller.map(p => p._id);
      filter['items.produk'] = { $in: produkIds };
    }
    const orders = await Order.find(filter)
      .populate('user', 'nama email noHp')
      .populate('items.produk', 'nama harga gambar')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil semua order user (history pembeli)
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

// PUT - Update status order (untuk seller)
router.put('/:id', async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.status === 'selesai') updateData.statusPembayaran = 'Lunas';

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - Hapus order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
    res.json({ message: 'Order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;