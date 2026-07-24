import mongoose from 'mongoose';

// Connect to MongoDB database
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Create indexes after connection
    await createIndexes();

    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB connection warning: ${error.message}`);
    console.log('⚠️  Server will continue running without database. API endpoints available.');
    // Don't exit - let server continue running for testing
    return null;
  }
};

// Create database indexes for optimal query performance
const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;

    // Drop problematic indexes from old schema versions
    try {
      await db.collection('orders').dropIndex('orderId_1');
      console.log('✓ Dropped old orderId_1 index from orders');
    } catch (e) {
      // Index might not exist, that's okay
    }

    // Customer indexes
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    await db.collection('customers').createIndex({ isActive: 1, createdAt: -1 });

    // Product indexes
    await db.collection('products').createIndex({ sku: 1 }, { unique: true });
    await db.collection('products').createIndex({ categoryId: 1 });
    await db.collection('products').createIndex({ brandId: 1 });
    await db.collection('products').createIndex({ status: 1 });
    await db.collection('products').createIndex({ name: 'text', description: 'text' });

    // Order indexes
    // Note: orderId index removed - use orderNumber which is already unique in the schema
    await db.collection('orders').createIndex({ customerId: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ status: 1, createdAt: -1 });

    // Cart indexes - unique because each customer has exactly one cart
    await db.collection('carts').createIndex({ customerId: 1 }, { unique: true });

    // Payment indexes
    await db.collection('payments').createIndex({ orderId: 1 });
    await db.collection('payments').createIndex({ status: 1 });

    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.warn(`⚠️  Warning creating indexes: ${error.message}`);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};
