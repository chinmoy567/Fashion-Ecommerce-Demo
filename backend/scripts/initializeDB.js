import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AdminUser from '../src/models/AdminUser.js';

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('\n🔄 Initializing Database...\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');

    // Create indexes
    await createIndexes();

    // Create default admin user
    await createAdminUser();

    console.log('\n✅ Database initialization complete\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Create indexes for optimal performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    console.log('\n📊 Creating indexes...');

    // Customer indexes
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await db.collection('customers').createIndex({ isActive: 1, createdAt: -1 });
    console.log('  ✓ Customer indexes');

    // Product indexes
    await db.collection('products').createIndex({ sku: 1 }, { unique: true });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('products').createIndex({ brandId: 1 });
    await db.collection('products').createIndex({ status: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });
    console.log('  ✓ Product indexes');

    // Order indexes
    await db.collection('orders').createIndex({ orderId: 1 }, { unique: true });
    await db.collection('orders').createIndex({ customerId: 1, orderPlacedDate: -1 });
    await db.collection('orders').createIndex({ status: 1, orderPlacedDate: -1 });
    console.log('  ✓ Order indexes');

    // Cart indexes
    await db.collection('carts').createIndex({ customerId: 1 });
    console.log('  ✓ Cart indexes');

    // Payment indexes
    await db.collection('payments').createIndex({ orderId: 1 });
    await db.collection('payments').createIndex({ status: 1 });
    console.log('  ✓ Payment indexes');

    // Category indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    console.log('  ✓ Category indexes');

    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.warn(`⚠️  Warning creating indexes: ${error.message}`);
  }
};

// Create default admin user
const createAdminUser = async () => {
  try {
    console.log('\n👤 Setting up admin user...');

    const adminEmail = process.env.ADMIN_EMAIL || 'chinmoy6667@gmail.com';
    const existingAdmin = await AdminUser.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`  ✓ Admin user already exists: ${adminEmail}`);
      return;
    }

    const adminUser = new AdminUser({
      fullName: 'System Administrator',
      email: adminEmail,
      phone: '+8801700000000',
      password: 'Admin@123456', // Default password - should be changed
      role: 'super_admin',
      isActive: true,
    });

    await adminUser.save();
    console.log(`  ✓ Admin user created: ${adminEmail}`);
    console.log('  ⚠️  Default password: Admin@123456');
    console.log('  ⚠️  Please change this password immediately in production!\n');
  } catch (error) {
    if (error.code === 11000) {
      console.log(`  ✓ Admin user already exists`);
    } else {
      console.warn(`⚠️  Warning creating admin user: ${error.message}`);
    }
  }
};

// Run initialization
initializeDatabase();
