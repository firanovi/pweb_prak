require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Preload models supaya koleksi langsung terbuat
require('./models/User');
require('./models/Seller');
require('./models/Produk');
require('./models/Cart');
require('./models/Wishlist');
require('./models/Order');

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/seller',   require('./routes/Seller'));
app.use('/api/produk',   require('./routes/produk'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/order',    require('./routes/order'));
app.use('/api/wishlist', require('./routes/Wishlist'));

// Koneksi database — pakai env variable
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Database Terhubung!'))
  .catch(err => console.error('Gagal konek:', err));

// Port — pakai env variable (Railway inject otomatis)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di port ${PORT}`);
});