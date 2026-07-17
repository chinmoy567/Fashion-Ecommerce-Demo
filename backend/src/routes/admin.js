import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import AdminUser from '../models/AdminUser.js';
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

// POST /admin/create-staff - Create admin/manager staff account (development/setup only)
router.post('/create-staff', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, fullName, and role are required',
      });
    }

    if (!['super_admin', 'manager'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be super_admin or manager',
      });
    }

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: `Admin user with email ${email} already exists`,
        data: { email: existingAdmin.email, role: existingAdmin.role },
      });
    }

    const adminUser = new AdminUser({
      email,
      password,
      fullName,
      role,
      phone: '+8801700000000',
      isActive: true,
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: `${role} account created successfully`,
      data: {
        email: adminUser.email,
        fullName: adminUser.fullName,
        role: adminUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating staff account',
      error: error.message,
    });
  }
});

// GET /admin/seed-stats - Check data available for seeding
router.get('/seed-stats', async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ status: 'active' });
    const customerCount = await Customer.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      success: true,
      data: {
        products: productCount,
        customers: customerCount,
        orders: orderCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /admin/seed-orders - Create test orders for dashboard (development only)
router.post('/seed-orders', async (req, res) => {
  try {
    const { count = 50 } = req.body;

    if (count < 1 || count > 500) {
      return res.status(400).json({
        success: false,
        message: 'Count must be between 1 and 500',
      });
    }

    // Get all products
    const products = await Product.find({ status: 'active' }).select('_id price').limit(50);
    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active products found. Please create products first.',
      });
    }
    const productIds = products.map(p => p._id);

    // Get or create test customers
    let customers = await Customer.find().select('_id').limit(20);
    if (customers.length === 0) {
      const testCustomers = [];
      for (let i = 0; i < 10; i++) {
        testCustomers.push({
          name: `Test Customer ${i + 1}`,
          email: `testcustomer${i + 1}-${Date.now()}@test.com`,
          phone: `01${Math.floor(Math.random() * 900000000) + 100000000}`,
          password: 'password123',
          emailVerified: true,
          isActive: true,
        });
      }
      const createdCustomers = await Customer.insertMany(testCustomers);
      customers = createdCustomers;
    }

    // Generate test orders
    const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'];
    const divisions = ['Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Barisal'];
    const upazilas = ['Mirpur', 'Uttara', 'Badda', 'Gulshan', 'Motijheel', 'Dhanmondi'];
    const cities = ['Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Barisal'];

    const baseTimestamp = Date.now();
    let createdCount = 0;
    const ordersCollection = mongoose.connection.db.collection('orders');

    for (let i = 0; i < count; i++) {
      try {
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let subtotal = 0;

        for (let j = 0; j < numItems; j++) {
          const productId = productIds[Math.floor(Math.random() * productIds.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;
          const price = Math.floor(Math.random() * 5000) + 500;
          items.push({
            productId: new mongoose.Types.ObjectId(productId),
            quantity,
            price
          });
          subtotal += price * quantity;
        }

        const shippingCharge = Math.floor(Math.random() * 200) + 50;
        const total = subtotal + shippingCharge;
        const customerId = customers[Math.floor(Math.random() * customers.length)]._id;

        // Randomize order date within last 3 months
        const now = new Date();
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        const orderDate = new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));

        // Ensure unique orderNumber
        const uniqueOrderNumber = `ORD-${baseTimestamp}-${i}-${Math.random().toString(36).substr(2, 5)}`;

        const orderDoc = {
          customerId: new mongoose.Types.ObjectId(customerId),
          orderNumber: uniqueOrderNumber,
          items,
          shippingAddress: {
            line1: `${Math.floor(Math.random() * 1000)} Street Name`,
            city: cities[Math.floor(Math.random() * cities.length)],
            upazila: upazilas[Math.floor(Math.random() * upazilas.length)],
            division: divisions[Math.floor(Math.random() * divisions.length)],
            postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
            phone: `01${Math.floor(Math.random() * 900000000) + 100000000}`,
          },
          subtotal,
          shippingCharge,
          total,
          status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          notes: Math.random() > 0.7 ? 'Special delivery instructions' : '',
          createdAt: orderDate,
          updatedAt: orderDate,
        };

        // Insert using Mongoose model
        const order = new Order(orderDoc);
        await order.save();
        createdCount++;
      } catch (error) {
        // Skip duplicate key errors silently
        if (error.code !== 11000) {
          console.error(`Error creating order ${i}:`, error.message);
        }
      }
    }

    // Get statistics
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdCount} test orders`,
      data: {
        created: createdCount,
        requested: count,
        stats: orderStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating test orders',
      error: error.message,
    });
  }
});

export default router;
