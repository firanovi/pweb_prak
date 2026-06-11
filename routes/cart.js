const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// ✅ Fix 1: semua route STATIS di atas route DINAMIS /:userId
// Urutan ini kritis — /:userId akan "menelan" path seperti /remove, /add, /update
// jika diletakkan lebih dulu.

// POST - Tambah item ke cart
router.post('/add', async (req, res) => {
    try {
        const { userId, produkId, jumlah, harga } = req.body;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.produk.toString() === produkId
        );

        if (existingItem) {
            existingItem.jumlah += jumlah;
        } else {
            cart.items.push({
                produk: produkId,
                jumlah,
                harga
            });
        }

        await cart.save();

        res.status(200).json({
            message: 'Produk berhasil ditambahkan ke cart'
        });

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

// ✅ GET /:userId — paling bawah supaya tidak mengganggu route statis di atas
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

module.exports = router;