const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');

// ============================================
// GET - Ambil semua order (filter by seller)
// ============================================
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.seller) {
      // Filter pakai field seller di items (bukan lewat produk)
      filter['items.seller'] = req.query.seller;
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

// ============================================
// GET - Ambil semua order user (history pembeli)
// ============================================
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.produk', 'nama harga gambar')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// GET - Ambil order aktif user
// ============================================
router.get('/aktif/:userId', async (req, res) => {
  try {
    const orders = await Order.find({
      user:   req.params.userId,
      status: { $in: ['Pending', 'Processing', 'Shipping', 'pending', 'diproses', 'dikirim'] }
    })
      .populate('items.produk', 'nama harga gambar')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================
// POST - Buat order baru
// ============================================
router.post('/', async (req, res) => {
  const { userId, items, totalHarga, alamatPengiriman, metodePembayaran } = req.body;
  try {
    const Produk = require('../models/Produk');

    // Ambil data produk → simpan snapshot nama, gambar, dan seller
    const itemsWithSnapshot = await Promise.all(
      items.map(async (item) => {
        const produk = await Produk.findById(item.produk).select('nama gambar seller');
        return {
          produk:       item.produk                 || null,
          seller:       produk?.seller              || item.seller || null, // ← simpan seller
          jumlah:       item.jumlah,
          harga:        item.harga,
          namaProduk:   produk?.nama                || '',  // ← snapshot nama
          gambarProduk: produk?.gambar              || ''   // ← snapshot gambar
        };
      })
    );

    const order = new Order({
      user: userId,
      items: itemsWithSnapshot,
      totalHarga,
      alamatPengiriman,
      metodePembayaran,
      status: 'Pending'
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

// ============================================
// PUT - Update status order (untuk seller)
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const updateData = { status: req.body.status };
    if (req.body.status === 'Completed' || req.body.status === 'selesai') {
      updateData.statusPembayaran = 'Lunas';
    }

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

// ============================================
// DELETE - Hapus order
// ============================================
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