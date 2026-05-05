const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
      jumlah: { type: Number, default: 1 },
      harga: { type: Number }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);