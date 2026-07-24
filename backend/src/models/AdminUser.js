import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Admin User schema for staff accounts
const adminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'manager'], default: 'manager' },
    profilePic: { type: String },
    phone: { type: String },
    address: {
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      upazila: { type: String },
      division: { type: String },
      postalCode: { type: String },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
adminUserSchema.pre('save', async function (next) {
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
adminUserSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Hide password in JSON response
adminUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

adminUserSchema.index({ role: 1 });

export default mongoose.model('AdminUser', adminUserSchema);
