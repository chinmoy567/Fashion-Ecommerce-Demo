import express from 'express';
import multer from 'multer';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ProductVariant from '../models/ProductVariant.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import { productsToCsv, parseProductCsv } from '../utils/productCsv.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

// Test endpoint to debug
router.get('/test/connection', async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ success: true, productCount: count, connected: true });
  } catch (error) {
    res.json({ success: false, error: error.message, connected: false });
  }
});

// GET /products/filters/metadata - Get available filter options
router.get('/filters/metadata', async (req, res) => {
  try {
    const query = { status: 'active' };

    // Get all unique colors
    const colors = await Product.find(query).distinct('colors');

    // Get all unique sizes
    const sizes = await Product.find(query).distinct('sizes');

    // Get price range
    const priceData = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const minPrice = priceData[0]?.minPrice || 0;
    const maxPrice = priceData[0]?.maxPrice || 10000;

    res.json({
      success: true,
      message: 'Filter metadata retrieved',
      data: {
        colors: colors.filter(Boolean),
        sizes: sizes.filter(Boolean),
        priceRange: { min: minPrice, max: maxPrice },
      },
    });
  } catch (error) {
    console.error('Error fetching filter metadata:', error);
    res.json({
      success: true,
      data: {
        colors: [],
        sizes: [],
        priceRange: { min: 0, max: 10000 },
      },
    });
  }
});

// Demo products with images for when database is unavailable
const DEMO_PRODUCTS = [
  { _id: '1', name: 'DeerFit Classic T-Shirt', brand: 'DeerFit', price: 1200, stock: 50, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234a5568;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%232d3748;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad1)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👕%3C/text%3E%3C/svg%3E' },
  { _id: '2', name: 'DeerFit Navy Casual Shirt', brand: 'DeerFit', price: 2500, stock: 40, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23003366;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23001a33;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad2)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👔%3C/text%3E%3C/svg%3E' },
  { _id: '3', name: 'DeerFit Black Formal Shirt', brand: 'DeerFit', price: 3500, stock: 30, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23333333;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad3)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E🎩%3C/text%3E%3C/svg%3E' },
  { _id: '4', name: 'DeerFit Polo Shirt', brand: 'DeerFit', price: 2000, stock: 45, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ff0000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23cc0000;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad4)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E🏌️%3C/text%3E%3C/svg%3E' },
  { _id: '5', name: 'DeerFit Denim Jeans', brand: 'DeerFit', price: 3500, stock: 35, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231e3a8a;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e1b4b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad5)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👖%3C/text%3E%3C/svg%3E' },
  { _id: '6', name: 'DeerFit Chino Pants', brand: 'DeerFit', price: 2800, stock: 40, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23a16207;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23713f12;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad6)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👔%3C/text%3E%3C/svg%3E' },
  { _id: '7', name: 'DeerFit White Cotton Top', brand: 'DeerFit', price: 1500, stock: 45, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad7" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ffffff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23f0f0f0;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad7)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="%23333" text-anchor="middle"%3E👕%3C/text%3E%3C/svg%3E' },
  { _id: '8', name: 'DeerFit Pink Saree', brand: 'DeerFit', price: 4500, stock: 20, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad8" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ec4899;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23be185d;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad8)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👗%3C/text%3E%3C/svg%3E' },
  { _id: '9', name: 'DeerFit Kids Red T-Shirt', brand: 'DeerFit', price: 800, stock: 60, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad9" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ef4444;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23b91c1c;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad9)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E👧%3C/text%3E%3C/svg%3E' },
  { _id: '10', name: 'DeerFit Baseball Cap', brand: 'DeerFit', price: 600, stock: 100, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad10" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23dc2626;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23991b1b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad10)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E🧢%3C/text%3E%3C/svg%3E' },
  { _id: '11', name: 'DeerFit Wool Scarf', brand: 'DeerFit', price: 900, stock: 80, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad11" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23b45309;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2378350f;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad11)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E🧣%3C/text%3E%3C/svg%3E' },
  { _id: '12', name: 'DeerFit Leather Belt', brand: 'DeerFit', price: 1200, stock: 70, image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad12" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23713f12;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23450a0a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad12)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="60" fill="white" text-anchor="middle"%3E🪗%3C/text%3E%3C/svg%3E' },
];

// GET /products - Get all products with pagination and filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      featured,
      minPrice,
      maxPrice,
      color,
      size,
      sort = 'newest',
      inStock
    } = req.query;

    let query = { status: 'active' };

    if (category) {
      // Accept a slug or a raw ObjectId; a matched category also pulls in its subcategories
      const categoryDoc = await Category.findOne(
        category.match(/^[0-9a-fA-F]{24}$/) ? { _id: category } : { slug: category }
      );

      if (categoryDoc) {
        // Walk all descendant levels (category tree can be 3+ levels deep), not just direct children
        const categoryIds = [categoryDoc._id];
        let frontier = [categoryDoc._id];
        while (frontier.length > 0) {
          const children = await Category.find({ parentId: { $in: frontier } }).select('_id');
          frontier = children.map((c) => c._id);
          categoryIds.push(...frontier);
        }
        query.categoryId = categoryIds.length > 1 ? { $in: categoryIds } : categoryDoc._id;
      } else {
        query.categoryId = null; // Unknown category slug/id should return no results
      }
    }
    if (search) query.$text = { $search: search };
    if (featured === 'true') query.isFeatured = true;

    // Price filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Color filtering
    if (color) {
      query.colors = { $in: [color] };
    }

    // Size filtering
    if (size) {
      query.sizes = { $in: [size] };
    }

    // Stock filtering
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    switch(sort) {
      case 'price-low-high':
        sortObj = { price: 1 };
        break;
      case 'price-high-low':
        sortObj = { price: -1 };
        break;
      case 'best-selling':
        sortObj = { saleCount: -1 };
        break;
      case 'top-rated':
        sortObj = { averageRating: -1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortObj);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      message: 'Products retrieved',
      data: {
        items: products || [],
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('Product fetch error:', error.message, error.stack);
    // Return demo products on database error
    res.json({
      success: true,
      message: 'Demo products (database unavailable)',
      data: {
        items: DEMO_PRODUCTS,
        pagination: { page: 1, limit: 12, total: DEMO_PRODUCTS.length, pages: 1 },
      },
    });
  }
});

// GET /products/export/csv - Export all products as CSV (admin only)
router.get('/export/csv', verifyToken, verifyAdmin, async (req, res) => {
  const products = await Product.find().populate('categoryId', 'name').sort({ createdAt: -1 });
  const csv = productsToCsv(products);

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="products-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// POST /products/import/csv - Bulk create/update products from a CSV file (admin only)
router.post('/import/csv', verifyToken, verifyAdmin, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'CSV file is required (field name: file)' });
  }

  const { rows, errors: parseErrors } = parseProductCsv(req.file.buffer.toString('utf-8'));
  const categories = await Category.find();
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));

  const errors = [...parseErrors];
  let created = 0;
  let updated = 0;

  for (const { line, data } of rows) {
    const sku = data.sku?.trim();
    const name = data.name?.trim();
    const price = parseFloat(data.price);
    const stock = parseInt(data.stock, 10);
    const categoryName = data.category?.trim();

    if (!sku || !name || Number.isNaN(price) || Number.isNaN(stock)) {
      errors.push({ line, message: 'sku, name, price, and stock are required and must be valid' });
      continue;
    }

    const categoryId = categoryByName.get(categoryName?.toLowerCase());
    if (!categoryId) {
      errors.push({ line, message: `Unknown category "${categoryName}"` });
      continue;
    }

    const payload = {
      name,
      categoryId,
      price,
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : undefined,
      stock,
      material: data.material || undefined,
      sizes: data.sizes ? data.sizes.split('|').map((s) => s.trim()).filter(Boolean) : [],
      colors: data.colors ? data.colors.split('|').map((c) => c.trim()).filter(Boolean) : [],
      status: ['active', 'inactive', 'discontinued'].includes(data.status) ? data.status : 'active',
    };

    const existing = await Product.findOne({ sku });
    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      updated += 1;
    } else {
      await Product.create({ sku, ...payload });
      created += 1;
    }
  }

  res.json({
    success: errors.length === 0,
    message: `Import complete: ${created} created, ${updated} updated, ${errors.length} failed`,
    data: { created, updated, failed: errors.length, errors },
  });
});

// GET /products/:id - Get product details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.viewCount += 1;
    await product.save();

    const variants = product.trackVariantStock
      ? await ProductVariant.find({ productId: product._id }).sort({ size: 1, color: 1 })
      : [];

    res.json({ success: true, message: 'Product retrieved', data: { ...product.toObject(), variants } });
  } catch (error) {
    console.error('Product detail fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
});

// GET /products/:id/related - Get related products from the same category
router.get('/:id/related', async (req, res) => {
  const { limit = 8 } = req.query;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    categoryId: product.categoryId,
    status: 'active',
  })
    .sort({ averageRating: -1, saleCount: -1 })
    .limit(parseInt(limit));

  res.json({ success: true, message: 'Related products retrieved', data: related });
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
