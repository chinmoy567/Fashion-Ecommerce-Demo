import express from 'express';
import Category from '../models/Category.js';
import { verifyToken, verifySuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /categories - Get all categories
router.get('/', async (req, res) => {
  const categories = await Category.find().populate('parentId');
  res.json({ success: true, message: 'Categories retrieved', data: categories });
});

// POST /categories - Create category (super admin only)
router.post('/', verifyToken, verifySuperAdmin, async (req, res) => {
  const { name, description, parentId } = req.body;

  const category = new Category({ name, description, parentId });
  await category.save();

  res.status(201).json({ success: true, message: 'Category created', data: category });
});

// PUT /categories/:id - Update category (super admin only)
router.put('/:id', verifyToken, verifySuperAdmin, async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.json({ success: true, message: 'Category updated', data: category });
});

// DELETE /categories/:id - Delete category (super admin only)
router.delete('/:id', verifyToken, verifySuperAdmin, async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }

  res.json({ success: true, message: 'Category deleted' });
});

export default router;
