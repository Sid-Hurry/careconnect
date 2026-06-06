const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: Boolean, default: false },
  queueStatus: { type: String, enum: ['Waiting', 'In Progress', 'Completed', 'Cancelled'], default: 'Waiting' },
  estimatedWaitTime: { type: Number, default: 15 }, // in minutes
  averageConsultationTime: { type: Number, default: 10 }, // in minutes
  predictedStartTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
