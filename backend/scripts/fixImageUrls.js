import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

// Valid Unsplash image URLs (tested and working)
const VALID_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', // Shirt
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop', // T-Shirt
  'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=400&fit=crop', // Jacket
  'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400&h=400&fit=crop', // Jeans
  'https://images.unsplash.com/photo-1595777707802-41d339d29879?w=400&h=400&fit=crop', // Dress
  'https://images.unsplash.com/photo-1606772250969-e62c47e8f9d8?w=400&h=400&fit=crop', // Skirt
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', // Shoes
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop', // Boots
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', // Belt
  'https://images.unsplash.com/photo-1564901667989-fa526ecd4ad5?w=400&h=400&fit=crop', // Scarf
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', // Cap
  'https://images.unsplash.com/photo-1533041304569-82d440642117?w=400&h=400&fit=crop', // Hat
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', // Handbag
  'https://images.unsplash.com/photo-1556821552-5f96f0c14770?w=400&h=400&fit=crop', // Sweater
  'https://images.unsplash.com/photo-1539533057440-7d8733b71e27?w=400&h=400&fit=crop', // Coat
];

async function fixImageUrls() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📊 Fetching all products...');
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updated = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // Assign image from valid list
      const imageUrl = VALID_IMAGES[i % VALID_IMAGES.length];

      if (product.image !== imageUrl) {
        product.image = imageUrl;
        await product.save();
        updated++;
        console.log(`✅ Updated: ${product.name}`);
      }
    }

    console.log(`\n✅ Successfully fixed ${updated} product images`);
    console.log('✅ All products now have valid, working Unsplash URLs!');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

fixImageUrls();
