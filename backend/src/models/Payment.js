import mongoose from 'mongoose';

// Payment schema for bKash payment tracking
const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    method: { type: String, default: 'bKash' },
    senderMobile: { type: String, required: true },
    transactionId: { type: String },
    screenshotUrl: { type: String },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'refunded'],
      default: 'pending',
    },
    amount: { type: Number, required: true },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);
