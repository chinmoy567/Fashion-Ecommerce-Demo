import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixOrderIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');

    // List all indexes
    const indexes = await ordersCollection.getIndexes();
    console.log('Current indexes:', Object.keys(indexes));

    // Drop orderId index if it exists
    if (indexes.orderId_1) {
      await ordersCollection.dropIndex('orderId_1');
      console.log('✓ Dropped orderId_1 index');
    }

    // Verify new indexes
    const newIndexes = await ordersCollection.getIndexes();
    console.log('Updated indexes:', Object.keys(newIndexes));

    await mongoose.connection.close();
    console.log('✓ Script completed');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

fixOrderIndex();
