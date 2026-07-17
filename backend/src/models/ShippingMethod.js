import mongoose from 'mongoose';

// Shipping Method schema
const shippingMethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    charge: { type: Number, required: true },
    estimatedDays: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ShippingMethod', shippingMethodSchema);
