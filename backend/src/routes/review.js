import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /reviews - Create a review for a product
router.post('/', verifyToken, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const customerId = req.user.userId;

  if (!productId || !rating) {
    return res.status(400).json({ success: false, message: 'productId and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Check if customer already reviewed this product
  const existingReview = await Review.findOne({ productId, customerId });
  if (existingReview) {
    return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
  }

  const review = new Review({
    customerId,
    productId,
    rating,
    comment: comment || '',
    status: 'pending',
  });

  await review.save();

  res.status(201).json({ success: true, message: 'Review submitted for moderation', data: review });
});

// GET /reviews/product/:productId - Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const reviews = await Review.find({ productId: req.params.productId, status: 'approved' })
    .populate('customerId', 'name email')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ productId: req.params.productId, status: 'approved' });

  // Calculate average rating
  const allReviews = await Review.find({ productId: req.params.productId, status: 'approved' });
  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : 0;

  res.json({
    success: true,
    message: 'Reviews retrieved',
    data: {
      items: reviews,
      averageRating,
      totalReviews: allReviews.length,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /reviews/my-reviews - Get customer's own reviews
router.get('/my-reviews', verifyToken, async (req, res) => {
  const customerId = req.user.userId;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const reviews = await Review.find({ customerId })
    .populate('productId', 'name price')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Review.countDocuments({ customerId });

  res.json({
    success: true,
    message: 'Your reviews retrieved',
    data: {
      items: reviews,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// PUT /reviews/:id - Update own review
router.put('/:id', verifyToken, async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.customerId.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'You can only edit your own reviews' });
  }

  const { rating, comment } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  if (rating) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  review.status = 'pending';

  await review.save();

  res.json({ success: true, message: 'Review updated', data: review });
});

// DELETE /reviews/:id - Delete own review
router.delete('/:id', verifyToken, async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  if (review.customerId.toString() !== req.user.userId) {
    return res.status(403).json({ success: false, message: 'You can only delete your own reviews' });
  }

  await Review.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Review deleted' });
});

export default router;
