const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Management', 'Doctor', 'Nurse', 'Reception Staff'], required: true },
  department: { type: String },
  specialization: { type: String }, // Doctor specific
  assignedWard: { type: String } // Nurse specific (ICU, Emergency, General)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
