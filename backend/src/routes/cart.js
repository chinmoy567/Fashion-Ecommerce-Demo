import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
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
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  let cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    cart = new Cart({ customerId: req.user.userId, items: [] });
  }

  const existingItem = cart.items.find(item => item.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.discountPrice || product.price });
  }

  // Check stock
  if (product.stock < quantity) {
    return res.status(400).json({ success: false, message: 'Insufficient stock' });
  }

  await cart.save();
  res.json({ success: true, message: 'Item added to cart', data: cart });
});

// PUT /cart/update/:productId - Update item quantity
router.put('/update/:productId', verifyToken, verifyCustomer, async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  const item = cart.items.find(item => item.productId.toString() === req.params.productId);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart' });
  }

  item.quantity = quantity;
  if (quantity <= 0) {
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  }

  await cart.save();
  res.json({ success: true, message: 'Cart updated', data: cart });
});

// DELETE /cart/remove/:productId - Remove item from cart
router.delete('/remove/:productId', verifyToken, verifyCustomer, async (req, res) => {
  const cart = await Cart.findOne({ customerId: req.user.userId });
  if (!cart) {
    return res.status(404).json({ success: false, message: 'Cart not found' });
  }

  cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  await cart.save();

  res.json({ success: true, message: 'Item removed from cart', data: cart });
});

export default router;
