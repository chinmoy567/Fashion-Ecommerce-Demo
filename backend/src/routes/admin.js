import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import { verifyToken, verifyAdmin, verifySuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /admin/dashboard - Dashboard metrics
router.get('/dashboard', verifyToken, verifyAdmin, async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalCustomers = await Customer.countDocuments();
  const totalProducts = await Product.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: 'pending' });
  const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
  const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  res.json({
    success: true,
    message: 'Dashboard data retrieved',
    data: {
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  });
});

// GET /admin/orders - Get all orders (admin only)
router.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  let query = {};
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const orders = await Order.find(query)
    .populate('customerId items.productId paymentId')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    message: 'Orders retrieved',
    data: {
      items: orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
});

// GET /admin/customers - Get all customers (admin only)
router.get('/customers', verifyToken, verifyAdmin, async (req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json({ success: true, message: 'Customers retrieved', data: customers });
});

// GET /admin/orders/:id - Get order details (admin only)
router.get('/orders/:id', verifyToken, verifyAdmin, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customerId items.productId paymentId');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, message: 'Order retrieved', data: order });
});

// PUT /admin/orders/:id/confirm - Confirm order (admin only)
router.put('/orders/:id/confirm', verifyToken, verifyAdmin, async (req, res) => {
  const { parcelId } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'confirmed', parcelId },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Update payment status
  if (order.paymentId) {
    await Payment.findByIdAndUpdate(order.paymentId, { status: 'verified' });
  }

  res.json({ success: true, message: 'Order confirmed', data: order });
});

// PUT /admin/orders/:id/cancel - Cancel order (admin only)
router.put('/orders/:id/cancel', verifyToken, verifyAdmin, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, message: 'Order cancelled', data: order });
});

export default router;
