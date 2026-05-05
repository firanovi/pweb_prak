const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  foto: { type: String, default: '' },
  alamat: { type: String, default: '' },
  noHp: { type: String, default: '' },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);