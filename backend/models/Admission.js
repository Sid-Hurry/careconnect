const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bed: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed', default: null },
  admissionReason: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  dischargeDate: { type: Date, default: null },
  status: { type: String, enum: ['Pending', 'Admitted', 'Discharged'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);
