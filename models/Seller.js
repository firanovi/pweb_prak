const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  namaToko: { type: String, required: true },
  deskripsiToko: { type: String, default: '' },
  alamatToko: { type: String, default: '' },
  noHp: { type: String, default: '' },
  fotoProfil: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema);