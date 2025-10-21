const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    price:     { type: Number, required: true, min: 0 },
    quantity:  { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const RouteSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    email:  { type: String, required: true, trim: true, lowercase: true },
    items:  { type: [ItemSchema], required: true, validate: v => v.length > 0 },
    total:  { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending','paid','cancelled'], default: 'pending' },
  },
  { timestamps: true, collection: 'Routes' }
);

module.exports = mongoose.model('Route', RouteSchema);
