const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true, unique: true },
  category: { type: String, enum: ['Medicines', 'Consumables'], required: true },
  quantity: { type: Number, required: true },
  minimumStock: { type: Number, default: 20 },
  expiryDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
