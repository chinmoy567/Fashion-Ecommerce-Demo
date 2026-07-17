import mongoose from 'mongoose';

// Review schema for product reviews (Phase 2)
const reviewSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ customerId: 1 });

export default mongoose.model('Review', reviewSchema);
