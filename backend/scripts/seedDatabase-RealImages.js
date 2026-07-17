import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Brand from '../src/models/Brand.js';

dotenv.config();

// ✅ DNS FIX
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✅ DNS Override: Using Google Public DNS (8.8.8.8, 8.8.4.4)\n');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://chinmoy:666@cluster0.yfyovpw.mongodb.net/deerfit?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔄 DeerFit Database Seeding (With Real Images)\n');

// Real clothing images from Unsplash (free, no attribution required)
const PRODUCT_IMAGES = {
  men: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', // Men's T-shirt
    'https://images.unsplash.com/photo-1596362051314-47a7e7e4f7a8?w=400&h=400&fit=crop', // Men's Shirt
    'https://images.unsplash.com/photo-1598639917318-b69e9b0f3e69?w=400&h=400&fit=crop', // Men's Formal Shirt
    'https://images.unsplash.com/photo-1538049387789-4d135313e318?w=400&h=400&fit=crop', // Polo Shirt
    'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop', // Jeans
    'https://images.unsplash.com/photo-1473441109150-5dac8d30651d?w=400&h=400&fit=crop', // Chino Pants
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop', // Shorts
    'https://images.unsplash.com/photo-1556821552-107fcfcb52ad?w=400&h=400&fit=crop', // Sweatshirt
    'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop', // Winter Jacket
    'https://images.unsplash.com/photo-1556821552-07d440d270e7?w=400&h=400&fit=crop', // Hoodie
  ],
  women: [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop', // Women's Top
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', // Blouse
    'https://images.unsplash.com/photo-1595777707802-21b287214926?w=400&h=400&fit=crop', // Dress
    'https://images.unsplash.com/photo-1589701109802-1e3c77a4a41e?w=400&h=400&fit=crop', // Saree
    'https://images.unsplash.com/photo-1597764227041-cf4ee3b61bbb?w=400&h=400&fit=crop', // Salwar Kameez
    'https://images.unsplash.com/photo-1611652022419-a7c984b51e5e?w=400&h=400&fit=crop', // Kurti
    'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop', // Women's Jeans
    'https://images.unsplash.com/photo-1556821552-107fcfcb52ad?w=400&h=400&fit=crop', // Skirt
    'https://images.unsplash.com/photo-1506629082632-07fa0cadc84d?w=400&h=400&fit=crop', // Leggings
    'https://images.unsplash.com/photo-1551760521-f91b04caf0db?w=400&h=400&fit=crop', // Cardigan
  ],
  kids: [
    'https://images.unsplash.com/photo-1519238263413-426d494038e5?w=400&h=400&fit=crop', // Kids T-shirt
    'https://images.unsplash.com/photo-1503919545889-aef636cb63ec?w=400&h=400&fit=crop', // Kids Shirt
    'https://images.unsplash.com/photo-1519074069444-1065a1a57e97?w=400&h=400&fit=crop', // Kids Shorts
    'https://images.unsplash.com/photo-1595777707802-21b287214926?w=400&h=400&fit=crop', // Kids Dress
    'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop', // Kids Jeans
    'https://images.unsplash.com/photo-1556821552-07d440d270e7?w=400&h=400&fit=crop', // Kids Sweatshirt
    'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop', // Kids Jacket
    'https://images.unsplash.com/photo-1556821552-107fcfcb52ad?w=400&h=400&fit=crop', // Kids Hoodie
    'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=400&fit=crop', // Kids Pants
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop', // Kids Sweater
  ],
  accessories: [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', // Cap
    'https://images.unsplash.com/photo-1601924260368-ae2f83cf8b7f?w=400&h=400&fit=crop', // Scarf
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // Belt
    'https://images.unsplash.com/photo-1582715471805-dd28287db1fc?w=400&h=400&fit=crop', // Socks
    'https://images.unsplash.com/photo-1539180556448-4bc85f1e9b84?w=400&h=400&fit=crop', // Gloves
    'https://images.unsplash.com/photo-1601924260368-ae2f83cf8b7f?w=400&h=400&fit=crop', // Beanie
    'https://images.unsplash.com/photo-1530268729831-4be0ea6a3d84?w=400&h=400&fit=crop', // Tie
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop', // Shawl
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', // Handbag
    'https://images.unsplash.com/photo-1548690312-f66d72a95147?w=400&h=400&fit=crop', // Wallet
  ],
};

const categories = [
  { name: 'Men\'s Clothing', slug: 'mens-clothing', description: 'Premium men\'s fashion collection by DeerFit' },
  { name: 'Women\'s Clothing', slug: 'womens-clothing', description: 'Elegant women\'s fashion collection by DeerFit' },
  { name: 'Kids\' Clothing', slug: 'kids-clothing', description: 'Comfortable kids\' wear by DeerFit' },
  { name: 'Accessories', slug: 'accessories', description: 'DeerFit accessories and add-ons' },
];

const brands = [
  { name: 'DeerFit', description: 'Premium clothing brand' },
  { name: 'DeerFit Premium', description: 'Premium collection' },
  { name: 'DeerFit Casual', description: 'Casual wear collection' },
];

const productsData = {
  men: [
    { name: 'DeerFit Classic T-Shirt', description: 'Premium cotton t-shirt for men', price: 1200, stock: 50 },
    { name: 'DeerFit Casual Shirt', description: 'Comfortable casual shirt', price: 2500, stock: 40 },
    { name: 'DeerFit Formal Shirt', description: 'Professional formal shirt', price: 3500, stock: 30 },
    { name: 'DeerFit Polo Shirt', description: 'Stylish polo shirt', price: 2000, stock: 45 },
    { name: 'DeerFit Denim Jeans', description: 'Classic denim jeans', price: 3500, stock: 35 },
    { name: 'DeerFit Chino Pants', description: 'Smart chino pants', price: 2800, stock: 40 },
    { name: 'DeerFit Sports Shorts', description: 'Breathable sports shorts', price: 1500, stock: 50 },
    { name: 'DeerFit Sweatshirt', description: 'Cozy sweatshirt', price: 2200, stock: 35 },
    { name: 'DeerFit Winter Jacket', description: 'Warm winter jacket', price: 5500, stock: 20 },
    { name: 'DeerFit Hoodie', description: 'Casual hoodie', price: 2800, stock: 40 },
  ],
  women: [
    { name: 'DeerFit Women\'s Top', description: 'Stylish women\'s top', price: 1500, stock: 45 },
    { name: 'DeerFit Women\'s Blouse', description: 'Elegant blouse', price: 2200, stock: 35 },
    { name: 'DeerFit Women\'s Dress', description: 'Beautiful casual dress', price: 3500, stock: 30 },
    { name: 'DeerFit Women\'s Saree', description: 'Traditional saree', price: 4500, stock: 20 },
    { name: 'DeerFit Women\'s Salwar Kameez', description: 'Traditional dress', price: 3200, stock: 25 },
    { name: 'DeerFit Women\'s Kurti', description: 'Casual kurti', price: 1800, stock: 40 },
    { name: 'DeerFit Women\'s Jeans', description: 'Comfortable women\'s jeans', price: 3200, stock: 35 },
    { name: 'DeerFit Women\'s Skirt', description: 'Stylish skirt', price: 2500, stock: 30 },
    { name: 'DeerFit Women\'s Leggings', description: 'Comfortable leggings', price: 1200, stock: 50 },
    { name: 'DeerFit Women\'s Cardigan', description: 'Warm cardigan', price: 2800, stock: 25 },
  ],
  kids: [
    { name: 'DeerFit Kids T-Shirt', description: 'Comfortable kids t-shirt', price: 800, stock: 60 },
    { name: 'DeerFit Kids Shirt', description: 'Kids shirt', price: 1500, stock: 50 },
    { name: 'DeerFit Kids Shorts', description: 'Kids shorts', price: 1200, stock: 55 },
    { name: 'DeerFit Kids Dress', description: 'Kids dress', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Jeans', description: 'Kids jeans', price: 1800, stock: 40 },
    { name: 'DeerFit Kids Sweatshirt', description: 'Kids sweatshirt', price: 1500, stock: 45 },
    { name: 'DeerFit Kids Jacket', description: 'Kids jacket', price: 3000, stock: 25 },
    { name: 'DeerFit Kids Hoodie', description: 'Kids hoodie', price: 2000, stock: 35 },
    { name: 'DeerFit Kids Pants', description: 'Comfortable kids pants', price: 1600, stock: 45 },
    { name: 'DeerFit Kids Sweater', description: 'Warm kids sweater', price: 2200, stock: 30 },
  ],
  accessories: [
    { name: 'DeerFit Cap', description: 'Stylish cap', price: 600, stock: 100 },
    { name: 'DeerFit Scarf', description: 'Warm scarf', price: 900, stock: 80 },
    { name: 'DeerFit Belt', description: 'Leather belt', price: 1200, stock: 70 },
    { name: 'DeerFit Socks', description: 'Comfortable socks pack', price: 500, stock: 150 },
    { name: 'DeerFit Gloves', description: 'Winter gloves', price: 800, stock: 60 },
    { name: 'DeerFit Beanie', description: 'Warm beanie', price: 700, stock: 90 },
    { name: 'DeerFit Tie', description: 'Formal tie', price: 1500, stock: 50 },
    { name: 'DeerFit Shawl', description: 'Elegant shawl', price: 2500, stock: 40 },
    { name: 'DeerFit Handbag', description: 'Stylish handbag', price: 3500, stock: 30 },
    { name: 'DeerFit Wallet', description: 'Leather wallet', price: 1800, stock: 60 },
  ],
};

async function seedDatabase() {
  try {
    console.log('🔗 Attempting MongoDB connection with DNS override...\n');

    mongoose.set('strictQuery', false);

    await mongoose.connect(MONGODB_URI, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      maxPoolSize: 10,
    });

    console.log('✅ Connected to MongoDB Atlas!\n');

    // Clear existing data
    console.log('🧹 Clearing existing collections...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Brand.deleteMany({});
    console.log('✅ Collections cleared\n');

    // Create brands
    console.log('🏢 Creating brands...');
    const createdBrands = await Brand.insertMany(brands);
    console.log(`✅ Created ${createdBrands.length} brands\n`);

    // Create categories and products
    console.log('📂 Creating categories and products:\n');
    let totalProducts = 0;
    const categoryOrder = ['men', 'women', 'kids', 'accessories'];

    for (const catKey of categoryOrder) {
      let categoryDoc;
      if (catKey === 'men') categoryDoc = categories[0];
      else if (catKey === 'women') categoryDoc = categories[1];
      else if (catKey === 'kids') categoryDoc = categories[2];
      else if (catKey === 'accessories') categoryDoc = categories[3];

      const createdCategory = await Category.create(categoryDoc);
      console.log(`   📦 ${createdCategory.name}`);

      const products = productsData[catKey];
      const images = PRODUCT_IMAGES[catKey];

      for (let i = 0; i < products.length; i++) {
        const prodData = products[i];
        const sku = `DEERFIT-${catKey.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const product = await Product.create({
          name: prodData.name,
          description: prodData.description,
          categoryId: createdCategory._id,
          brandId: createdBrands[0]._id,
          price: prodData.price,
          stock: prodData.stock,
          sku,
          material: 'Cotton/Polyester Blend',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Blue', 'Red', 'Green'],
          status: 'active',
          isFeatured: Math.random() > 0.7,
          image: images[i] || images[0], // Use real image URL
        });

        totalProducts++;
      }
    }

    console.log(`\n✅ Successfully seeded ${totalProducts} products with REAL images!\n`);
    console.log('📊 Database Seed Summary:');
    console.log(`   ✓ Categories: ${categories.length}`);
    console.log(`   ✓ Products: ${totalProducts}`);
    console.log(`   ✓ Brands: ${createdBrands.length}`);
    console.log(`   ✓ Images: ${totalProducts} (Real Clothing Images from Unsplash)\n`);
    console.log('✨ DeerFit database is ready with real product images!\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:');
    console.error(`   ${error.message}\n`);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    console.log('✓ Database connection closed\n');
  }
}

seedDatabase();
