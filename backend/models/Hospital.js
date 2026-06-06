const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  location: { type: String, required: true },
  totalBeds: { type: Number, required: true },
  availableBeds: { type: Number, required: true },
  availableICUBeds: { type: Number, required: true },
  emergencyCapacity: { type: String, enum: ['Normal', 'High', 'Full'], default: 'Normal' }
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
