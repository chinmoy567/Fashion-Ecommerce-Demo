import express from 'express';
import Customer from '../models/Customer.js';
import Address from '../models/Address.js';
import Wishlist from '../models/Wishlist.js';
import { verifyToken, verifyCustomer } from '../middlewares/auth.js';

const router = express.Router();

// GET /customers/me - Get logged-in customer profile
router.get('/me', verifyToken, verifyCustomer, async (req, res) => {
  const customer = await Customer.findById(req.user.userId);
  res.json({ success: true, message: 'Customer retrieved', data: customer.toJSON() });
});

// PUT /customers/me - Update customer profile
router.put('/me', verifyToken, verifyCustomer, async (req, res) => {
  const { name, phone, profilePic } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.user.userId,
    { name, phone, profilePic },
    { new: true }
  );

  res.json({ success: true, message: 'Profile updated', data: customer.toJSON() });
});

// POST /customers/addresses - Add address
router.post('/addresses', verifyToken, verifyCustomer, async (req, res) => {
  const { line1, line2, city, upazila, division, postalCode, phone, label, isDefault } = req.body;

  const address = new Address({
    customerId: req.user.userId,
    line1,
    line2,
    city,
    upazila,
    division,
    postalCode,
    phone,
    label,
    isDefault,
  });

  await address.save();
  res.status(201).json({ success: true, message: 'Address added', data: address });
});

// GET /customers/addresses - Get all customer addresses
router.get('/addresses', verifyToken, verifyCustomer, async (req, res) => {
  const addresses = await Address.find({ customerId: req.user.userId });
  res.json({ success: true, message: 'Addresses retrieved', data: addresses });
});

// DELETE /customers/addresses/:id - Delete address
router.delete('/addresses/:id', verifyToken, verifyCustomer, async (req, res) => {
  const address = await Address.findByIdAndDelete(req.params.id);

  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }

  res.json({ success: true, message: 'Address deleted' });
});

// POST /customers/wishlist - Add to wishlist
router.post('/wishlist', verifyToken, verifyCustomer, async (req, res) => {
  const { productId } = req.body;

  const existingWishlist = await Wishlist.findOne({ customerId: req.user.userId, productId });
  if (existingWishlist) {
    return res.status(400).json({ success: false, message: 'Already in wishlist' });
  }

  const wishlist = new Wishlist({ customerId: req.user.userId, productId });
  await wishlist.save();

  res.status(201).json({ success: true, message: 'Added to wishlist', data: wishlist });
});

// GET /customers/wishlist - Get wishlist
router.get('/wishlist', verifyToken, verifyCustomer, async (req, res) => {
  const wishlist = await Wishlist.find({ customerId: req.user.userId }).populate('productId');
  res.json({ success: true, message: 'Wishlist retrieved', data: wishlist });
});

// DELETE /customers/wishlist/:productId - Remove from wishlist
router.delete('/wishlist/:productId', verifyToken, verifyCustomer, async (req, res) => {
  const wishlist = await Wishlist.findOneAndDelete({
    customerId: req.user.userId,
    productId: req.params.productId,
  });

  if (!wishlist) {
    return res.status(404).json({ success: false, message: 'Item not in wishlist' });
  }

  res.json({ success: true, message: 'Removed from wishlist' });
});

export default router;
