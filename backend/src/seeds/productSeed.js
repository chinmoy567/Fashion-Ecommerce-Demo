import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { connectDB } from '../config/database.js';

dotenv.config();

// Category structure
const CATEGORIES = {
  'mens-clothing': {
    name: "Men's Clothing",
    subcategories: {
      'mens-upper': { name: "Men's Upper Wear" },
      'mens-lower': { name: "Men's Lower Wear" }
    }
  },
  'womens-clothing': {
    name: "Women's Clothing",
    subcategories: {
      'womens-upper': { name: "Women's Upper Wear" },
      'womens-lower': { name: "Women's Lower Wear" },
      'womens-fullbody': { name: "Women's Full Body" }
    }
  },
  'kids-clothing': {
    name: "Kids' Clothing",
    subcategories: {
      'kids-boys': { name: "Boys' Clothing" },
      'kids-girls': { name: "Girls' Clothing" }
    }
  },
  'accessories': {
    name: 'Accessories',
    subcategories: {
      'headwear': { name: 'Headwear' },
      'footwear': { name: 'Footwear' },
      'belts': { name: 'Belts' },
      'scarves': { name: 'Scarves' }
    }
  }
};

// Product data organized by category
const PRODUCTS = [
  // Men's Upper Wear - Shirts
  {
    name: 'DeerFit Classic Cotton Shirt',
    description: 'Premium cotton shirt perfect for casual and formal wear',
    categoryId: 'mens-shirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 'shirt',
    price: 2500,
    stock: 50,
    sku: 'MEN-SHIRT-001',
    material: 'Cotton',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Black', 'Gray'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad1" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234a90e2;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%232e5c8a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad1)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👔%3C/text%3E%3C/svg%3E'
  },
  {
    name: 'DeerFit Formal Business Shirt',
    description: 'Professional formal shirt for business meetings and events',
    categoryId: 'mens-shirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 'shirt',
    price: 3200,
    stock: 35,
    sku: 'MEN-SHIRT-002',
    material: '100% Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Black'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad2" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ffffff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23f0f0f0;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad2)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="%23333" text-anchor="middle" dominant-baseline="middle"%3E🎩%3C/text%3E%3C/svg%3E'
  },

  // Men's Upper Wear - T-Shirts
  {
    name: 'DeerFit Casual T-Shirt',
    description: 'Comfortable casual t-shirt for everyday wear',
    categoryId: 'mens-tshirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 't-shirt',
    price: 1200,
    stock: 100,
    sku: 'MEN-TSHIRT-001',
    material: 'Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Blue', 'Red', 'Gray', 'Green'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad3" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23333333;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad3)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👕%3C/text%3E%3C/svg%3E'
  },
  {
    name: 'DeerFit Graphic Print T-Shirt',
    description: 'Stylish t-shirt with modern graphic prints',
    categoryId: 'mens-tshirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 't-shirt',
    price: 1500,
    stock: 75,
    sku: 'MEN-TSHIRT-002',
    material: 'Cotton',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Charcoal', 'Olive'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad4" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad4)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🎨%3C/text%3E%3C/svg%3E'
  },

  // Men's Upper Wear - Jackets
  {
    name: 'DeerFit Denim Jacket',
    description: 'Classic denim jacket for all seasons',
    categoryId: 'mens-jacket',
    gender: 'men',
    clothingType: 'upper',
    itemType: 'jacket',
    price: 5500,
    stock: 40,
    sku: 'MEN-JACKET-001',
    material: 'Denim',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad5" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231e3a8a;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230f172a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad5)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🧥%3C/text%3E%3C/svg%3E'
  },

  // Men's Lower Wear - Pants
  {
    name: 'DeerFit Chino Pants',
    description: 'Comfortable chino pants for casual office wear',
    categoryId: 'mens-pants',
    gender: 'men',
    clothingType: 'lower',
    itemType: 'pants',
    price: 3500,
    stock: 60,
    sku: 'MEN-PANTS-001',
    material: 'Cotton Blend',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Black', 'Gray'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad6" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23a16207;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23713f12;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad6)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👖%3C/text%3E%3C/svg%3E'
  },

  // Men's Lower Wear - Jeans
  {
    name: 'DeerFit Premium Denim Jeans',
    description: 'High-quality denim jeans with perfect fit',
    categoryId: 'mens-jeans',
    gender: 'men',
    clothingType: 'lower',
    itemType: 'jeans',
    price: 4200,
    stock: 80,
    sku: 'MEN-JEANS-001',
    material: 'Denim',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad7" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23264653;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231d3557;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad7)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👖%3C/text%3E%3C/svg%3E'
  },

  // Women's Upper Wear - Shirts
  {
    name: 'DeerFit Women Silk Blouse',
    description: 'Elegant silk blouse for formal and casual occasions',
    categoryId: 'womens-blouse',
    gender: 'women',
    clothingType: 'upper',
    itemType: 'blouse',
    price: 3800,
    stock: 45,
    sku: 'WOM-BLOUSE-001',
    material: 'Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Rose', 'Navy'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad8" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ec4899;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23be185d;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad8)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E💄%3C/text%3E%3C/svg%3E'
  },

  // Women's Upper Wear - T-Shirts
  {
    name: 'DeerFit Women Casual T-Shirt',
    description: 'Comfortable cotton t-shirt for everyday wear',
    categoryId: 'womens-tshirt',
    gender: 'women',
    clothingType: 'upper',
    itemType: 't-shirt',
    price: 1400,
    stock: 90,
    sku: 'WOM-TSHIRT-001',
    material: 'Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Pink', 'Purple', 'Turquoise'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad9" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23f472b6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23ec4899;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad9)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👚%3C/text%3E%3C/svg%3E'
  },

  // Women's Upper Wear - Jackets
  {
    name: 'DeerFit Women Leather Jacket',
    description: 'Stylish leather jacket for a bold look',
    categoryId: 'womens-jacket',
    gender: 'women',
    clothingType: 'upper',
    itemType: 'jacket',
    price: 6500,
    stock: 30,
    sku: 'WOM-JACKET-001',
    material: 'Leather',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Brown', 'Burgundy'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad10" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23713f12;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23450a0a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad10)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🧥%3C/text%3E%3C/svg%3E'
  },

  // Women's Lower Wear - Jeans
  {
    name: 'DeerFit Women Skinny Jeans',
    description: 'Perfect fit skinny jeans for all occasions',
    categoryId: 'womens-jeans',
    gender: 'women',
    clothingType: 'lower',
    itemType: 'jeans',
    price: 3800,
    stock: 70,
    sku: 'WOM-JEANS-001',
    material: 'Denim',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad11" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231e40af;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e3a8a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad11)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👖%3C/text%3E%3C/svg%3E'
  },

  // Women's Lower Wear - Skirts
  {
    name: 'DeerFit Women Maxi Skirt',
    description: 'Elegant maxi skirt perfect for any occasion',
    categoryId: 'womens-skirt',
    gender: 'women',
    clothingType: 'lower',
    itemType: 'skirt',
    price: 2800,
    stock: 55,
    sku: 'WOM-SKIRT-001',
    material: 'Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy', 'Forest Green'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad12" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23000000;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23333333;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad12)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👗%3C/text%3E%3C/svg%3E'
  },

  // Women's Full Body - Dresses
  {
    name: 'DeerFit Summer Floral Dress',
    description: 'Beautiful summer dress with floral prints',
    categoryId: 'womens-dress',
    gender: 'women',
    clothingType: 'full-body',
    itemType: 'dress',
    price: 4200,
    stock: 40,
    sku: 'WOM-DRESS-001',
    material: 'Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral', 'Blue', 'Yellow'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad13" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23fbbf24;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23f59e0b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad13)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🌻%3C/text%3E%3C/svg%3E'
  },

  // Women's Full Body - Sarees
  {
    name: 'DeerFit Traditional Silk Saree',
    description: 'Stunning traditional silk saree for special occasions',
    categoryId: 'womens-saree',
    gender: 'women',
    clothingType: 'full-body',
    itemType: 'saree',
    price: 5500,
    stock: 25,
    sku: 'WOM-SAREE-001',
    material: 'Silk',
    sizes: ['One Size'],
    colors: ['Red', 'Green', 'Blue', 'Purple', 'Gold'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad14" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23dc2626;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%239b1c1c;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad14)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="gold" text-anchor="middle" dominant-baseline="middle"%3E💃%3C/text%3E%3C/svg%3E'
  },

  // Kids' Clothing
  {
    name: 'DeerFit Kids Cotton T-Shirt',
    description: 'Soft and comfortable t-shirt for kids',
    categoryId: 'kids-boys',
    gender: 'kids',
    clothingType: 'upper',
    itemType: 't-shirt',
    price: 900,
    stock: 70,
    sku: 'KID-TSHIRT-001',
    material: 'Cotton',
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad15" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23ef4444;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23b91c1c;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad15)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E👦%3C/text%3E%3C/svg%3E'
  },

  // Accessories - Headwear
  {
    name: 'DeerFit Classic Baseball Cap',
    description: 'Comfortable baseball cap for everyday wear',
    categoryId: 'headwear',
    gender: 'unisex',
    clothingType: 'accessories',
    itemType: 'cap',
    price: 700,
    stock: 100,
    sku: 'ACC-CAP-001',
    material: 'Cotton Canvas',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Red', 'Navy', 'Khaki'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad16" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23dc2626;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23991b1b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad16)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🧢%3C/text%3E%3C/svg%3E'
  },

  // Accessories - Belts
  {
    name: 'DeerFit Genuine Leather Belt',
    description: 'Premium leather belt perfect with any outfit',
    categoryId: 'belts',
    gender: 'unisex',
    clothingType: 'accessories',
    itemType: 'belt',
    price: 1800,
    stock: 50,
    sku: 'ACC-BELT-001',
    material: 'Genuine Leather',
    sizes: ['28-30', '30-32', '32-34', '34-36', '36-38'],
    colors: ['Black', 'Brown', 'Tan'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad17" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23713f12;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23450a0a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad17)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🪗%3C/text%3E%3C/svg%3E'
  },

  // Accessories - Scarves
  {
    name: 'DeerFit Wool Scarf',
    description: 'Warm and cozy wool scarf for winter',
    categoryId: 'scarves',
    gender: 'unisex',
    clothingType: 'accessories',
    itemType: 'scarf',
    price: 1200,
    stock: 65,
    sku: 'ACC-SCARF-001',
    material: 'Wool',
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy', 'Burgundy', 'Cream'],
    image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Cdefs%3E%3ClinearGradient id="grad18" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23b45309;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2378350f;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad18)" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="100" fill="white" text-anchor="middle" dominant-baseline="middle"%3E🧣%3C/text%3E%3C/svg%3E'
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create categories
    console.log('📁 Creating categories...');
    const categoryMap = {};

    // Create parent categories
    for (const [parentKey, parentData] of Object.entries(CATEGORIES)) {
      const parentCategory = await Category.create({
        name: parentData.name,
        description: `${parentData.name} collection`,
        slug: parentKey
      });
      categoryMap[parentKey] = parentCategory._id;
      console.log(`  ✓ ${parentData.name}`);

      // Create subcategories
      for (const [subKey, subData] of Object.entries(parentData.subcategories)) {
        const subCategory = await Category.create({
          name: subData.name,
          description: `${subData.name} collection`,
          parentId: parentCategory._id,
          slug: subKey
        });
        categoryMap[subKey] = subCategory._id;
        console.log(`    ✓ ${subData.name}`);
      }
    }

    console.log('\n📦 Creating products...');
    let productCount = 0;

    // Create products with category references
    for (const product of PRODUCTS) {
      const categoryId = categoryMap[product.categoryId];
      if (!categoryId) {
        console.warn(`  ⚠ Skipping ${product.name} - category not found`);
        continue;
      }

      await Product.create({
        ...product,
        categoryId: categoryId,
        isFeatured: Math.random() > 0.7,
        status: 'active'
      });
      productCount++;
      console.log(`  ✓ ${product.name}`);
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Categories created: ${Object.keys(categoryMap).length}`);
    console.log(`   Products created: ${productCount}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
