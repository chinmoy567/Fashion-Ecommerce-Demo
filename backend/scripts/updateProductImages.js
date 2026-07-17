import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

// Image URLs from Unsplash for various clothing items
const UNSPLASH_IMAGES = {
  'shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
  'tshirt': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop',
  'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
  'pants': 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
  'jeans': 'https://images.unsplash.com/photo-1542272201-b1f555c8ed21?w=500&h=500&fit=crop',
  'dress': 'https://images.unsplash.com/photo-1595777707802-41d339d29879?w=500&h=500&fit=crop',
  'skirt': 'https://images.unsplash.com/photo-1606772250969-e62c47e8f9d8?w=500&h=500&fit=crop',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
  'boots': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
  'belt': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
  'scarf': 'https://images.unsplash.com/photo-1564901667989-fa526ecd4ad5?w=500&h=500&fit=crop',
  'cap': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
  'hat': 'https://images.unsplash.com/photo-1533041304569-82d440642117?w=500&h=500&fit=crop',
  'handbag': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
  'wallet': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
  'sweater': 'https://images.unsplash.com/photo-1556821552-5f96f0c14770?w=500&h=500&fit=crop',
  'hoodie': 'https://images.unsplash.com/photo-1556821552-5f96f0c14770?w=500&h=500&fit=crop',
  'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=500&h=500&fit=crop',
  'coat': 'https://images.unsplash.com/photo-1539533057440-7d8733b71e27?w=500&h=500&fit=crop',
};

async function updateProductImages() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📊 Fetching products without images...');
    const productsWithoutImages = await Product.find({ image: { $in: [null, '', undefined] } });
    console.log(`Found ${productsWithoutImages.length} products without images`);

    if (productsWithoutImages.length === 0) {
      console.log('✅ All products have images!');
      await mongoose.disconnect();
      return;
    }

    let updated = 0;
    for (const product of productsWithoutImages) {
      // Find matching image based on product name
      let imageUrl = null;

      const nameLower = product.name.toLowerCase();
      for (const [keyword, url] of Object.entries(UNSPLASH_IMAGES)) {
        if (nameLower.includes(keyword)) {
          imageUrl = url;
          break;
        }
      }

      // If no match found, use a default clothing image
      if (!imageUrl) {
        const defaultImages = Object.values(UNSPLASH_IMAGES);
        imageUrl = defaultImages[Math.floor(Math.random() * defaultImages.length)];
      }

      product.image = imageUrl;
      await product.save();
      updated++;
      console.log(`✅ Updated: ${product.name}`);
    }

    console.log(`\n✅ Successfully updated ${updated} products with images`);
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error updating images:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateProductImages();
