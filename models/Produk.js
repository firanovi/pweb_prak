const mongoose = require('mongoose');

const produkSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, default: '' },
  harga: { type: Number, required: true },
  stok: { type: Number, required: true, default: 0 },
  gambar: { type: String, default: '' },
  kategori: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }
}, { timestamps: true });

module.exports = mongoose.model('Produk', produkSchema);