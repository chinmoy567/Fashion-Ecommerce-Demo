import mongoose from 'mongoose';

// Product Variant schema for size/color variants
const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String },
    color: { type: String },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

productVariantSchema.index({ productId: 1 });

export default mongoose.model('ProductVariant', productVariantSchema);
