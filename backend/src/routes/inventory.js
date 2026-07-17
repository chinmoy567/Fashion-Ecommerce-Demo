import express from 'express';
import Product from '../models/Product.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /inventory - Get inventory status (admin only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  let query = {};
  if (status === 'low') query.stock = { $lt: 10, $gt: 0 };
  if (status === 'outofstock') query.stock = 0;
  if (status === 'available') query.stock = { $gt: 0 };

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('categoryId brandId')
    .skip(skip)
    .limit(parseInt(limit))
    .select('name sku price stock categoryId brandId status');

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    message: 'Inventory retrieved',
    data: {
      items: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /inventory/summary - Get inventory summary
router.get('/summary', verifyToken, verifyAdmin, async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10, $gt: 0 } });
  const outOfStockProducts = await Product.countDocuments({ stock: 0 });
  const totalValue = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$price', '$stock'] } },
      },
    },
  ]);

  res.json({
    success: true,
    message: 'Inventory summary retrieved',
    data: {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      availableProducts: totalProducts - outOfStockProducts,
      totalInventoryValue: totalValue[0]?.totalValue || 0,
    },
  });
});

// POST /inventory/adjust - Adjust stock for a product (admin only)
router.post('/adjust', verifyToken, verifyAdmin, async (req, res) => {
  const { productId, quantity, reason } = req.body;

  if (!productId || quantity === undefined || !reason) {
    return res.status(400).json({
      success: false,
      message: 'productId, quantity, and reason are required',
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const previousStock = product.stock;
  product.stock = Math.max(0, product.stock + quantity);

  await product.save();

  res.json({
    success: true,
    message: 'Stock adjusted',
    data: {
      productId,
      productName: product.name,
      reason,
      previousStock,
      newStock: product.stock,
      adjustment: quantity,
    },
  });
});

// GET /inventory/low-stock - Get low stock products
router.get('/low-stock', verifyToken, verifyAdmin, async (req, res) => {
  const products = await Product.find({ stock: { $lt: 10, $gt: 0 } })
    .populate('categoryId brandId')
    .select('name sku price stock categoryId')
    .sort({ stock: 1 });

  res.json({
    success: true,
    message: 'Low stock products retrieved',
    data: {
      count: products.length,
      items: products,
    },
  });
});

// GET /inventory/out-of-stock - Get out of stock products
router.get('/out-of-stock', verifyToken, verifyAdmin, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;
  const products = await Product.find({ stock: 0 })
    .populate('categoryId brandId')
    .skip(skip)
    .limit(parseInt(limit))
    .select('name sku price categoryId');

  const total = await Product.countDocuments({ stock: 0 });

  res.json({
    success: true,
    message: 'Out of stock products retrieved',
    data: {
      items: products,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// POST /inventory/restock - Request restock for a product
router.post('/restock', verifyToken, verifyAdmin, async (req, res) => {
  const { productId, quantity, supplier } = req.body;

  if (!productId || !quantity || !supplier) {
    return res.status(400).json({
      success: false,
      message: 'productId, quantity, and supplier are required',
    });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Log restock request (in a real system, this would create a Restock model)
  product.stock += quantity;
  await product.save();

  res.json({
    success: true,
    message: 'Restock request created',
    data: {
      productId,
      productName: product.name,
      restockQuantity: quantity,
      supplier,
      newStock: product.stock,
      requestDate: new Date(),
    },
  });
});

export default router;
