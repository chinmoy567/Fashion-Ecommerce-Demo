import mongoose from 'mongoose';

// BlogPost schema for admin-authored editorial content
const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    category: { type: String, default: '' },
    tags: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1 });

export default mongoose.model('BlogPost', blogPostSchema);
