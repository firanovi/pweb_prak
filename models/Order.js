const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      produk:       { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
      seller:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // ← BARU
      jumlah:       { type: Number },
      harga:        { type: Number },
      namaProduk:   { type: String, default: '' },   // snapshot nama
      gambarProduk: { type: String, default: '' }    // snapshot gambar
    }
  ],
  totalHarga:       { type: Number, required: true },
  status: {
    type:    String,
    enum:    ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled',
              'pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'],
    default: 'Pending'
  },
  alamatPengiriman: { type: String, required: true },
  metodePembayaran: { type: String, default: '' },
  statusPembayaran: { type: String, default: 'Menunggu' },
  kurir:            { type: String, default: 'JNE' },
  noResi:           { type: String, default: '' },
  ongkir:           { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);