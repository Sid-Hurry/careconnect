const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true, unique: true },
  wardType: { type: String, enum: ['ICU', 'Emergency', 'General'], required: true },
  status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);
