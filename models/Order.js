const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
      jumlah: { type: Number },
      harga: { type: Number }
    }
  ],
  totalHarga: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'diproses', 'dikirim', 'selesai', 'dibatalkan'], 
    default: 'pending' 
  },
  alamatPengiriman: { type: String, required: true },
  metodePembayaran: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);