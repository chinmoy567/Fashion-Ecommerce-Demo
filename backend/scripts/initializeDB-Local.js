import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AdminUser from '../src/models/AdminUser.js';
import bcryptjs from 'bcryptjs';

dotenv.config();

const initializeDatabase = async () => {
  try {
    console.log('\n🔄 Initializing Database (Local Fallback Mode)...\n');

    // Try to connect to database
    let connected = false;
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB');
      connected = true;

      // Create indexes if connected
      await createIndexes();
      await createAdminUser();
    } catch (dbError) {
      console.warn('⚠️  Cannot connect to MongoDB Atlas');
      console.log(`   Reason: ${dbError.message}`);
      console.log('\n📋 Fallback: Creating offline setup...\n');

      // Create offline setup
      await createOfflineSetup();
    }

    console.log('\n✅ Setup preparation complete\n');

    if (!connected) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  DATABASE CONNECTION ISSUE');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\nCould not connect to MongoDB Atlas');
      console.log('\nSolutions:');
      console.log('1. Check your internet connection');
      console.log('2. Whitelist your IP in MongoDB Atlas:');
      console.log('   - Go to: https://cloud.mongodb.com/');
      console.log('   - Navigate to Security > Network Access');
      console.log('   - Add your current IP address');
      console.log('3. Verify connection string in .env');
      console.log('4. Try again once network connection is available');
      console.log('\n✅ Good news: You can still start the backend server!');
      console.log('   Run: npm start');
      console.log('   The API will work, but database features won\'t until connection is restored.');
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup error:', error.message);
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
      password: 'Admin@123456',
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

// Create offline setup file
const createOfflineSetup = async () => {
  try {
    const fs = await import('fs').then(m => m.default);
    const path = await import('path').then(m => m.default);

    const setupInfo = {
      timestamp: new Date().toISOString(),
      admin: {
        email: process.env.ADMIN_EMAIL || 'chinmoy6667@gmail.com',
        password: 'Admin@123456',
        note: 'Change this password immediately after first login'
      },
      database: {
        uri: process.env.MONGODB_URI,
        status: 'Connection pending',
        action: 'Whitelist your IP in MongoDB Atlas and try again'
      },
      services: {
        email: 'Ready (Gmail SMTP configured)',
        cloudinary: 'Ready (API keys configured)',
        database: 'Waiting for connection'
      },
      instructions: [
        '1. Whitelist your IP in MongoDB Atlas',
        '2. Run: npm run setup',
        '3. Run: npm start',
        '4. Test: curl http://localhost:5001/api/health'
      ]
    };

    const setupPath = path.join(process.cwd(), 'OFFLINE_SETUP_INFO.json');
    fs.writeFileSync(setupPath, JSON.stringify(setupInfo, null, 2));
    console.log('✅ Offline setup info saved to OFFLINE_SETUP_INFO.json\n');
  } catch (error) {
    console.warn(`⚠️  Could not create offline setup info: ${error.message}`);
  }
};

// Run initialization
initializeDatabase();
