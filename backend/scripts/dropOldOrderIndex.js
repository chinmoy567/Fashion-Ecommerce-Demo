import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function dropOldIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // Try to drop the problematic index
    try {
      await ordersCollection.dropIndex('orderId_1');
      console.log('✓ Dropped orderId_1 index');
    } catch (e) {
      console.log('✓ orderId_1 index does not exist or already dropped');
    }

    // List remaining indexes
    const indexes = await ordersCollection.getIndexes();
    console.log('Remaining indexes:', Object.keys(indexes));

    await mongoose.connection.close();
    console.log('✓ Done');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

dropOldIndex();
