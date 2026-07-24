import mongoose from 'mongoose';

// Product schema for inventory management
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true },
    material: { type: String },
    weight: { type: Number },
    status: { type: String, enum: ['active', 'inactive', 'discontinued'], default: 'active' },
    isFeatured: { type: Boolean, default: false },
    trackVariantStock: { type: Boolean, default: false }, // true => stock lives on ProductVariant, not here
    image: { type: String }, // SVG data URL or image URL
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' }],
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' }],
    sizes: [{ type: String }],
    colors: [{ type: String }],
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    viewCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    saleCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for search and filtering
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
