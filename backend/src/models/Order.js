import mongoose from 'mongoose';

// Order schema for purchase management
const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderNumber: { type: String, unique: true, required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      upazila: { type: String, required: true },
      division: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String },
    },
    billingAddress: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      upazila: { type: String },
      division: { type: String },
      postalCode: { type: String },
    },
    subtotal: { type: Number, required: true },
    shippingCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    parcelId: { type: String },
    courier: { type: String },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    couponCode: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes for querying
orderSchema.index({ customerId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
