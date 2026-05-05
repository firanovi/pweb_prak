require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Preload models supaya koleksi langsung terbuat
require('./models/Seller');
require('./models/Wishlist');

// Routes
const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const orderRoutes = require('./routes/order');
app.use('/api/order', orderRoutes);

const produkRoutes = require('./routes/produk');
app.use('/api/produk', produkRoutes);

const sellerRoutes = require('./routes/seller');
app.use('/api/seller', sellerRoutes);

const wishlistRoutes = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoutes);

// Koneksi database
const url = "mongodb://firapinjam_db_user:DsURkWY2ZkuNRmlI@ac-glkbvvj-shard-00-00.runcguy.mongodb.net:27017,ac-glkbvvj-shard-00-01.runcguy.mongodb.net:27017,ac-glkbvvj-shard-00-02.runcguy.mongodb.net:27017/?ssl=true&replicaSet=atlas-jsi69i-shard-0&authSource=admin&appName=SakaMadura";

mongoose.connect(url)
  .then(() => console.log('Database Terhubung!'))
  .catch(err => console.error('Gagal konek:', err));

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});