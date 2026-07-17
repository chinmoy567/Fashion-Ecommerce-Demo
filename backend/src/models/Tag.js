import mongoose from 'mongoose';

// Tag schema for product tags
const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

tagSchema.index({ name: 1 });

export default mongoose.model('Tag', tagSchema);
