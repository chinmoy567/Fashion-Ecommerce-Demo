import express from 'express';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router({ mergeParams: true });

// GET /products/:productId/variants - List variants for a product (public)
router.get('/', async (req, res) => {
  const variants = await ProductVariant.find({ productId: req.params.productId }).sort({ size: 1, color: 1 });
  res.json({ success: true, message: 'Variants retrieved', data: variants });
});

// POST /products/:productId/variants - Create a variant (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { size, color, stock } = req.body;

  if (stock === undefined || stock === null) {
    return res.status(400).json({ success: false, message: 'stock is required' });
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const existing = await ProductVariant.findOne({ productId: product._id, size: size || null, color: color || null });
  if (existing) {
    return res.status(400).json({ success: false, message: 'A variant with this size/color already exists' });
  }

  const variant = await ProductVariant.create({ productId: product._id, size, color, stock });

  if (!product.trackVariantStock) {
    product.trackVariantStock = true;
    await product.save();
  }

  res.status(201).json({ success: true, message: 'Variant created', data: variant });
});

// PUT /products/:productId/variants/:variantId - Update a variant (admin only)
router.put('/:variantId', verifyToken, verifyAdmin, async (req, res) => {
  const { size, color, stock } = req.body;

  const variant = await ProductVariant.findOne({ _id: req.params.variantId, productId: req.params.productId });
  if (!variant) {
    return res.status(404).json({ success: false, message: 'Variant not found' });
  }

  if (size !== undefined) variant.size = size;
  if (color !== undefined) variant.color = color;
  if (stock !== undefined) variant.stock = stock;

  await variant.save();
  res.json({ success: true, message: 'Variant updated', data: variant });
});

// DELETE /products/:productId/variants/:variantId - Delete a variant (admin only)
router.delete('/:variantId', verifyToken, verifyAdmin, async (req, res) => {
  const variant = await ProductVariant.findOneAndDelete({ _id: req.params.variantId, productId: req.params.productId });
  if (!variant) {
    return res.status(404).json({ success: false, message: 'Variant not found' });
  }

  const remaining = await ProductVariant.countDocuments({ productId: req.params.productId });
  if (remaining === 0) {
    await Product.findByIdAndUpdate(req.params.productId, { trackVariantStock: false });
  }

  res.json({ success: true, message: 'Variant deleted' });
});

export default router;
