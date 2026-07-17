import mongoose from 'mongoose';

// Address schema for customer addresses
const addressSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    upazila: { type: String, required: true },
    union: { type: String },
    division: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String },
    label: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ customerId: 1 });
addressSchema.index({ customerId: 1, isDefault: 1 });

export default mongoose.model('Address', addressSchema);
