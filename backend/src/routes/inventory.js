import express from 'express';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
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

// GET /inventory/summary - Get inventory summary (variant-tracked products counted by their variants)
router.get('/summary', verifyToken, verifyAdmin, async (req, res) => {
  const simpleProducts = await Product.find({ trackVariantStock: { $ne: true } }).select('price stock');
  const variantProducts = await Product.find({ trackVariantStock: true }).select('price');

  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let totalInventoryValue = 0;

  for (const product of simpleProducts) {
    totalInventoryValue += product.price * product.stock;
    if (product.stock === 0) outOfStockProducts += 1;
    else if (product.stock < 10) lowStockProducts += 1;
  }

  for (const product of variantProducts) {
    const variants = await ProductVariant.find({ productId: product._id }).select('stock');
    const productStock = variants.reduce((sum, v) => sum + v.stock, 0);
    totalInventoryValue += product.price * productStock;
    if (productStock === 0) outOfStockProducts += 1;
    else if (productStock < 10) lowStockProducts += 1;
  }

  const totalProducts = simpleProducts.length + variantProducts.length;

  res.json({
    success: true,
    message: 'Inventory summary retrieved',
    data: {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      availableProducts: totalProducts - outOfStockProducts,
      totalInventoryValue,
    },
  });
});

// POST /inventory/adjust - Adjust stock for a product or a specific variant (admin only)
router.post('/adjust', verifyToken, verifyAdmin, async (req, res) => {
  const { productId, variantId, quantity, reason } = req.body;

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

  if (variantId) {
    const variant = await ProductVariant.findOne({ _id: variantId, productId });
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    const previousStock = variant.stock;
    variant.stock = Math.max(0, variant.stock + quantity);
    await variant.save();

    return res.json({
      success: true,
      message: 'Stock adjusted',
      data: {
        productId,
        variantId,
        productName: product.name,
        reason,
        previousStock,
        newStock: variant.stock,
        adjustment: quantity,
      },
    });
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
