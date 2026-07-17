import mongoose from 'mongoose';

// Wishlist schema for saved products
const wishlistSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ customerId: 1 });
wishlistSchema.index({ customerId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
