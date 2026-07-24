import mongoose from 'mongoose';

// Cart schema for shopping cart management
const cartSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    couponCode: { type: String },
    total: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Note: customerId is indexed via `unique: true` on the field above.

export default mongoose.model('Cart', cartSchema);
