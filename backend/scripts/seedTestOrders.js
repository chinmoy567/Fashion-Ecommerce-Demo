import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Order from '../src/models/Order.js';
import Customer from '../src/models/Customer.js';
import Product from '../src/models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const orderStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'completed', 'cancelled'];
const divisions = ['Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Barisal'];
const upazilas = ['Mirpur', 'Uttara', 'Badda', 'Gulshan', 'Motijheel', 'Dhanmondi'];
const cities = ['Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Barisal'];

// Generate random order data
function generateRandomOrder(customerId, productIds) {
  const numItems = Math.floor(Math.random() * 3) + 1;
  const items = [];
  let subtotal = 0;

  for (let i = 0; i < numItems; i++) {
    const productId = productIds[Math.floor(Math.random() * productIds.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const price = Math.floor(Math.random() * 5000) + 500;
    items.push({ productId, quantity, price });
    subtotal += price * quantity;
  }

  const shippingCharge = Math.floor(Math.random() * 200) + 50;
  const total = subtotal + shippingCharge;

  // Randomize order date within last 3 months
  const now = new Date();
  const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const orderDate = new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime()));

  return {
    customerId,
    orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
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
}

async function seedTestOrders(count = 50) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Get all products
    const products = await Product.find().select('_id').limit(50);
    if (products.length === 0) {
      console.error('✗ No products found. Please create products first.');
      process.exit(1);
    }
    const productIds = products.map(p => p._id);
    console.log(`✓ Found ${products.length} products`);

    // Get or create test customers
    let customers = await Customer.find().select('_id').limit(10);
    if (customers.length === 0) {
      console.log('Creating test customers...');
      const testCustomers = [];
      for (let i = 0; i < 10; i++) {
        testCustomers.push({
          name: `Test Customer ${i + 1}`,
          email: `customer${i + 1}@test.com`,
          phone: `01${Math.floor(Math.random() * 900000000) + 100000000}`,
          password: 'password123',
          emailVerified: true,
          isActive: true,
        });
      }
      const createdCustomers = await Customer.insertMany(testCustomers);
      customers = createdCustomers;
      console.log(`✓ Created ${customers.length} test customers`);
    } else {
      console.log(`✓ Found ${customers.length} existing customers`);
    }

    // Generate and insert test orders
    const orders = [];
    for (let i = 0; i < count; i++) {
      const customerId = customers[Math.floor(Math.random() * customers.length)]._id;
      orders.push(generateRandomOrder(customerId, productIds));
    }

    const result = await Order.insertMany(orders);
    console.log(`✓ Successfully created ${result.length} test orders`);

    // Display summary
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' },
        },
      },
    ]);

    console.log('\n📊 Order Statistics:');
    orderStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} orders (Total: ৳${stat.totalAmount.toLocaleString()})`);
    });

    await mongoose.connection.close();
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

const count = parseInt(process.argv[2]) || 50;
seedTestOrders(count);
