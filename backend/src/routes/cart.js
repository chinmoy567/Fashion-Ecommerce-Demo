import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import { verifyToken, verifyCustomer } from '../middlewares/auth.js';

const router = express.Router();

// GET /cart - Get customer's cart
router.get('/', verifyToken, verifyCustomer, async (req, res) => {
  let cart = await Cart.findOne({ customerId: req.user.userId }).populate('items.productId');

  if (!cart) {
    cart = new Cart({ customerId: req.user.userId, items: [] });
    await cart.save();
  }

  // Calculate total
  let total = 0;
  for (let item of cart.items) {
    total += item.price * item.quantity;
  }
  cart.total = total;
  await cart.save();

  res.json({ success: true, message: 'Cart retrieved', data: cart });
});

// POST /cart/add - Add item to cart
router.post('/add', verifyToken, verifyCustomer, async (req, res) => {
  const { productId, variantId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  if (product.trackVariantStock && !variantId) {
    return res.status(400).json({ success: false, message: 'variantId is required for this product' });
  }

  let variant = null;
  if (variantId) {
    variant = await ProductVariant.findOne({ _id: variantId, productId });
    if (!variant) {
      return res.status(404).json({ success: false, message: 'Variant not found' });
    }
  }

  const availableStock = variant ? variant.stock : product.stock;

  let cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    cart = new Cart({ customerId: req.user.userId, items: [] });
  }

  const existingItem = cart.items.find(
    item => item.productId.toString() === productId && (item.variantId?.toString() || null) === (variantId || null)
  );
  const requestedQuantity = (existingItem?.quantity || 0) + quantity;

  if (availableStock < requestedQuantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  if (existingItem) {
    existingItem.quantity = requestedQuantity;
  } else {
    cart.items.push({ productId, variantId: variantId || undefined, quantity, price: product.discountPrice || product.price });
  }

  await cart.save();
  res.json({ success: true, message: 'Item added to cart', data: cart });
});

// PUT /cart/update/:productId - Update item quantity (optionally scoped to a variant)
router.put('/update/:productId', verifyToken, verifyCustomer, async (req, res) => {
  const { quantity, variantId } = req.body;

  const cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.find(
    item => item.productId.toString() === req.params.productId && (item.variantId?.toString() || null) === (variantId || null)
  );
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  if (quantity > 0) {
    const availableStock = item.variantId
      ? (await ProductVariant.findById(item.variantId))?.stock ?? 0
      : (await Product.findById(item.productId))?.stock ?? 0;

    if (availableStock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }
  }

  item.quantity = quantity;
  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i !== item);
  }

  await cart.save();
  res.json({ success: true, message: 'Cart updated', data: cart });
});

// DELETE /cart/remove/:productId - Remove item from cart (optionally scoped to a variant)
router.delete('/remove/:productId', verifyToken, verifyCustomer, async (req, res) => {
  const { variantId } = req.query;

  const cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter(
    item => !(item.productId.toString() === req.params.productId && (item.variantId?.toString() || null) === (variantId || null))
  );
  await cart.save();

  res.json({ success: true, message: 'Item removed from cart', data: cart });
});

export default router;
