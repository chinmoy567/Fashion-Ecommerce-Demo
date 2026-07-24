import mongoose from 'mongoose';

// Category schema for product organization
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    image: { type: String },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

categorySchema.index({ parentId: 1 });

export default mongoose.model('Category', categorySchema);
