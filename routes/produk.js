const express = require('express');
const router = express.Router();
const Produk = require('../models/Produk');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const filter = {};
    if (req.query.seller) filter.seller = req.query.seller;
    const produk = await Produk.find(filter).limit(limit);
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

router.put('/:id', async (req, res) => {
  try {
    const produk = await Produk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(produk);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const produk = await Produk.findByIdAndDelete(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;