import mongoose from 'mongoose';

// Brand schema for product brands
const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Brand', brandSchema);
