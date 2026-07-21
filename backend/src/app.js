import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';

import { errorHandler } from './middlewares/errorHandler.js';

// Import routes (will be created)
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import productVariantRoutes from './routes/productVariant.js';
import categoryRoutes from './routes/category.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';
import customerRoutes from './routes/customer.js';
import adminRoutes from './routes/admin.js';
import reviewRoutes from './routes/review.js';
import couponRoutes from './routes/coupon.js';
import inventoryRoutes from './routes/inventory.js';
import notificationRoutes from './routes/notification.js';
import analyticsRoutes from './routes/analytics.js';
import blogRoutes from './routes/blog.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products/:productId/variants', productVariantRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/blog', blogRoutes);

// Error handler (must be last)
app.use(errorHandler);

export default app;
