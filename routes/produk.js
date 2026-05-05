const express = require('express');
const router = express.Router();
const Produk = require('../models/Produk');

// GET - Ambil semua produk (dengan limit opsional)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const produk = await Produk.find().limit(limit);
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET - Ambil 1 produk by ID
router.get('/:id', async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Tambah produk baru
router.post('/', async (req, res) => {
  const { nama, deskripsi, harga, stok, gambar, kategori, seller } = req.body;
  try {
    const produk = new Produk({ nama, deskripsi, harga, stok, gambar, kategori, seller });
    await produk.save();
    res.status(201).json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;