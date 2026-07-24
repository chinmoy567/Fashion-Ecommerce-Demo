import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Customer schema for user account management
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },
    otp: { type: String },
    otpExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    preferences: {
      newsletter: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

// Indexes for performance
customerSchema.index({ createdAt: 1 });
customerSchema.index({ isActive: 1, createdAt: -1 });

// Hash password before saving
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
customerSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Hide password in JSON response
customerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  return obj;
};

export default mongoose.model('Customer', customerSchema);
