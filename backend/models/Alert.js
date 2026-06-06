const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Queue Alert', 'Bed Alert', 'Inventory Alert', 'Admission Alert'], required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  resolved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
