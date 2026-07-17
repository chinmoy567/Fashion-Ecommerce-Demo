import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Sample products to add via API
const PRODUCTS = [
  {
    name: 'DeerFit Classic Cotton Shirt',
    description: 'Premium cotton shirt perfect for casual and formal wear',
    category: 'mens-shirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 'shirt',
    price: 2500,
    stock: 50,
    sku: 'MEN-SHIRT-001',
    material: 'Cotton',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Black', 'Gray'],
  },
  {
    name: 'DeerFit Casual T-Shirt',
    description: 'Comfortable casual t-shirt for everyday wear',
    category: 'mens-tshirt',
    gender: 'men',
    clothingType: 'upper',
    itemType: 't-shirt',
    price: 1200,
    stock: 100,
    sku: 'MEN-TSHIRT-001',
    material: 'Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Blue', 'Red', 'Gray', 'Green'],
  },
  {
    name: 'DeerFit Women Silk Blouse',
    description: 'Elegant silk blouse for formal and casual occasions',
    category: 'womens-blouse',
    gender: 'women',
    clothingType: 'upper',
    itemType: 'blouse',
    price: 3800,
    stock: 45,
    sku: 'WOM-BLOUSE-001',
    material: 'Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Rose', 'Navy'],
  },
  {
    name: 'DeerFit Premium Denim Jeans',
    description: 'High-quality denim jeans with perfect fit',
    category: 'mens-jeans',
    gender: 'men',
    clothingType: 'lower',
    itemType: 'jeans',
    price: 4200,
    stock: 80,
    sku: 'MEN-JEANS-001',
    material: 'Denim',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Light Blue', 'Dark Blue', 'Black'],
  },
  {
    name: 'DeerFit Summer Floral Dress',
    description: 'Beautiful summer dress with floral prints',
    category: 'womens-dress',
    gender: 'women',
    clothingType: 'full-body',
    itemType: 'dress',
    price: 4200,
    stock: 40,
    sku: 'WOM-DRESS-001',
    material: 'Cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral', 'Blue', 'Yellow'],
  },
  {
    name: 'DeerFit Traditional Silk Saree',
    description: 'Stunning traditional silk saree for special occasions',
    category: 'womens-saree',
    gender: 'women',
    clothingType: 'full-body',
    itemType: 'saree',
    price: 5500,
    stock: 25,
    sku: 'WOM-SAREE-001',
    material: 'Silk',
    sizes: ['One Size'],
    colors: ['Red', 'Green', 'Blue', 'Purple', 'Gold'],
  },
  {
    name: 'DeerFit Classic Baseball Cap',
    description: 'Comfortable baseball cap for everyday wear',
    category: 'headwear',
    gender: 'unisex',
    clothingType: 'accessories',
    itemType: 'cap',
    price: 700,
    stock: 100,
    sku: 'ACC-CAP-001',
    material: 'Cotton Canvas',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Red', 'Navy', 'Khaki'],
  },
];

const displayProducts = async () => {
  try {
    console.log('📦 Fetching all products from database...\n');
    const response = await axios.get(`${API_URL}/products?limit=100`);

    if (response.data.success && response.data.data.items) {
      console.log(`✅ Found ${response.data.data.items.length} products\n`);
      console.log('Product List:');
      response.data.data.items.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ৳${product.price}, Stock: ${product.stock}`);
        console.log(`   Colors: ${product.colors?.join(', ') || 'N/A'}`);
        console.log(`   Sizes: ${product.sizes?.join(', ') || 'N/A'}\n`);
      });
      console.log(`\n📊 Total Products: ${response.data.data.pagination.total}`);
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
  }
};

displayProducts();
