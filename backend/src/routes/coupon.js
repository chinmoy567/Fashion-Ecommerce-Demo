import express from 'express';
import Coupon from '../models/Coupon.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// POST /coupons - Create coupon (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { code, discountType, discountValue, minPurchase, maxUsage, expiryDate, description } = req.body;

  if (!code || !discountType || discountValue === undefined) {
    return res.status(400).json({
      success: false,
      message: 'code, discountType, and discountValue are required',
    });
  }

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (existingCoupon) {
    return res.status(400).json({ success: false, message: 'Coupon code already exists' });
  }

  const coupon = new Coupon({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minPurchase: minPurchase || 0,
    maxUsage: maxUsage || null,
    currentUsage: 0,
    expiryDate: expiryDate || null,
    isActive: true,
    description: description || '',
  });

  await coupon.save();

  res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
});

// GET /coupons - Get all coupons (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;
  const coupons = await Coupon.find()
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Coupon.countDocuments();

  res.json({
    success: true,
    message: 'Coupons retrieved',
    data: {
      items: coupons,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// POST /coupons/validate - Validate and apply coupon
router.post('/validate', async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || subtotal === undefined) {
    return res.status(400).json({ success: false, message: 'code and subtotal are required' });
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  // Check if coupon is expired
  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    return res.status(400).json({ success: false, message: 'Coupon has expired' });
  }

  // Check usage limit
  if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }

  // Check minimum purchase
  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    return res.status(400).json({
      success: false,
      message: `Minimum purchase of ৳${coupon.minPurchase} required for this coupon`,
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * coupon.discountValue) / 100;
  } else if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  }

  res.json({
    success: true,
    message: 'Coupon is valid',
    data: {
      couponId: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.min(discountAmount, subtotal),
      finalAmount: Math.max(0, subtotal - discountAmount),
    },
  });
});

// GET /coupons/:id - Get coupon details (admin only)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.json({ success: true, message: 'Coupon retrieved', data: coupon });
});

// PUT /coupons/:id - Update coupon (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { discountType, discountValue, minPurchase, maxUsage, expiryDate, isActive, description } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  if (discountType) coupon.discountType = discountType;
  if (discountValue !== undefined) coupon.discountValue = discountValue;
  if (minPurchase !== undefined) coupon.minPurchase = minPurchase;
  if (maxUsage !== undefined) coupon.maxUsage = maxUsage;
  if (expiryDate) coupon.expiryDate = expiryDate;
  if (isActive !== undefined) coupon.isActive = isActive;
  if (description !== undefined) coupon.description = description;

  await coupon.save();

  res.json({ success: true, message: 'Coupon updated', data: coupon });
});

// DELETE /coupons/:id - Delete coupon (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Coupon not found' });
  }

  res.json({ success: true, message: 'Coupon deleted' });
});

export default router;
