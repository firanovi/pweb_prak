const mongoose = require('mongoose');

const produkSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  deskripsi: { type: String, default: '' },
  harga: { type: Number, required: true },
  stok: { type: Number, required: true, default: 0 },
  gambar: { type: String, default: '' },
  kategori: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending', 'On Sale'],
    default: 'Active'
  },
  diskon: { type: Number, default: 0 },        // persentase diskon (0-99)
  hargaDiskon: { type: Number, default: null } // harga setelah dipotong diskon
}, { timestamps: true });

module.exports = mongoose.model('Produk', produkSchema);