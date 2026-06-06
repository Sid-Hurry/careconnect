const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  medicalHistory: [{ type: String }],
  currentVitals: {
    bloodPressure: { type: String, default: '120/80' },
    heartRate: { type: Number, default: 75 },
    temperature: { type: Number, default: 98.6 },
    oxygenLevel: { type: Number, default: 98 },
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
