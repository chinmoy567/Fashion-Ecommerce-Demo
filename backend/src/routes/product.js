import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /products - Get all products with pagination and filters
router.get('/', async (req, res) => {
  const { page = 1, limit = 12, category, search, featured } = req.query;

  let query = { status: 'active' };
  if (category) query.categoryId = category;
  if (search) query.$text = { $search: search };
  if (featured === 'true') query.isFeatured = true;

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('categoryId brandId')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    message: 'Products retrieved',
    data: {
      items: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /products/:id - Get product details
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('categoryId brandId images variants tags');

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  product.viewCount += 1;
  await product.save();

  res.json({ success: true, message: 'Product retrieved', data: product });
});

// POST /products - Create product (admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, categoryId, brandId, price, discountPrice, stock, sku, material, weight, sizes, colors } = req.body;

  const existingSku = await Product.findOne({ sku });
  if (existingSku) {
    return res.status(400).json({ success: false, message: 'SKU already exists' });
  }

  const product = new Product({
    name,
    description,
    categoryId,
    brandId,
    price,
    discountPrice,
    stock,
    sku,
    material,
    weight,
    sizes: sizes || [],
    colors: colors || [],
  });

  await product.save();
  res.status(201).json({ success: true, message: 'Product created', data: product });
});

// PUT /products/:id - Update product (admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product updated', data: product });
});

// DELETE /products/:id - Delete product (admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, message: 'Product deleted' });
});

export default router;
