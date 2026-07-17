import mongoose from 'mongoose';

// Product Image schema for product photos
const productImageSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productImageSchema.index({ productId: 1 });

export default mongoose.model('ProductImage', productImageSchema);
