import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Extended product list with more items
const PRODUCTS_TO_ADD = [
  {
    name: 'DeerFit Premium Cotton Shirt - Blue',
    description: 'High-quality cotton shirt in vibrant blue color',
    price: 2500,
    stock: 45,
    sku: 'MEN-SHIRT-BLUE-001',
    material: 'Cotton',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Sky Blue', 'Navy'],
  },
  {
    name: 'DeerFit Oxford Formal Shirt',
    description: 'Classic oxford cloth formal shirt',
    price: 3200,
    stock: 35,
    sku: 'MEN-SHIRT-OXFORD-001',
    material: 'Oxford Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
  },
  {
    name: 'DeerFit Sports T-Shirt',
    description: 'Breathable sports t-shirt for active wear',
    price: 1800,
    stock: 60,
    sku: 'MEN-TSHIRT-SPORTS-001',
    material: 'Polyester Blend',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Red', 'Blue', 'Green'],
  },
  {
    name: 'DeerFit Varsity Jacket',
    description: 'Classic varsity-style jacket with contrast sleeves',
    price: 5200,
    stock: 25,
    sku: 'MEN-JACKET-VARSITY-001',
    material: 'Cotton & Polyester',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Red'],
  },
  {
    name: 'DeerFit Casual Shorts',
    description: 'Comfortable shorts for casual summer wear',
    price: 1500,
    stock: 50,
    sku: 'MEN-SHORTS-CASUAL-001',
    material: 'Cotton',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Khaki', 'Navy', 'Black', 'Beige'],
  },
  {
    name: 'DeerFit Athletic Leggings',
    description: 'High-performance athletic leggings',
    price: 2200,
    stock: 55,
    sku: 'MEN-PANTS-ATHLETIC-001',
    material: 'Nylon & Spandex',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray'],
  },
  {
    name: 'DeerFit Women Casual Blazer',
    description: 'Elegant casual blazer for office and casual wear',
    price: 4500,
    stock: 30,
    sku: 'WOM-BLAZER-CASUAL-001',
    material: 'Polyester Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Gray', 'Burgundy'],
  },
  {
    name: 'DeerFit Women Crop Top',
    description: 'Stylish crop top for casual and party wear',
    price: 1600,
    stock: 70,
    sku: 'WOM-TOP-CROP-001',
    material: 'Cotton',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Black', 'Pink', 'Gold'],
  },
  {
    name: 'DeerFit Women Boot Cut Jeans',
    description: 'Classic boot cut jeans with perfect fit',
    price: 3500,
    stock: 45,
    sku: 'WOM-JEANS-BOOTCUT-001',
    material: 'Denim',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Light Blue', 'Black'],
  },
  {
    name: 'DeerFit Women Pencil Skirt',
    description: 'Professional pencil skirt for office',
    price: 2200,
    stock: 40,
    sku: 'WOM-SKIRT-PENCIL-001',
    material: 'Polyester',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Gray'],
  },
  {
    name: 'DeerFit Women Fit & Flare Dress',
    description: 'Elegant fit and flare dress for all occasions',
    price: 3800,
    stock: 35,
    sku: 'WOM-DRESS-FITFLARE-001',
    material: 'Cotton Blend',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Burgundy', 'Navy', 'Black', 'Red'],
  },
  {
    name: 'DeerFit Women Party Gown',
    description: 'Stunning party gown for special events',
    price: 6500,
    stock: 15,
    sku: 'WOM-GOWN-PARTY-001',
    material: 'Silk & Satin',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Gold', 'Silver', 'Black', 'Red'],
  },
  {
    name: 'DeerFit Women Cotton Saree',
    description: 'Comfortable cotton saree for daily wear',
    price: 3500,
    stock: 30,
    sku: 'WOM-SAREE-COTTON-001',
    material: 'Cotton',
    sizes: ['One Size'],
    colors: ['Maroon', 'Blue', 'Green', 'Orange'],
  },
  {
    name: 'DeerFit Kids Graphic Tee',
    description: 'Fun graphic t-shirt for kids',
    price: 1200,
    stock: 80,
    sku: 'KID-TSHIRT-GRAPHIC-001',
    material: 'Cotton',
    sizes: ['4', '6', '8', '10', '12', '14'],
    colors: ['Blue', 'Red', 'Green', 'Yellow'],
  },
  {
    name: 'DeerFit Kids Denim Jacket',
    description: 'Cool denim jacket for kids',
    price: 2500,
    stock: 35,
    sku: 'KID-JACKET-DENIM-001',
    material: 'Denim',
    sizes: ['4', '6', '8', '10', '12'],
    colors: ['Blue', 'Black'],
  },
  {
    name: 'DeerFit Kids Play Shorts',
    description: 'Comfortable shorts for outdoor play',
    price: 1100,
    stock: 65,
    sku: 'KID-SHORTS-PLAY-001',
    material: 'Cotton',
    sizes: ['4', '6', '8', '10', '12'],
    colors: ['Blue', 'Red', 'Green', 'Navy'],
  },
  {
    name: 'DeerFit Wool Winter Hat',
    description: 'Warm wool winter hat for cold weather',
    price: 900,
    stock: 75,
    sku: 'ACC-HAT-WOOL-001',
    material: 'Wool',
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Gray', 'Maroon'],
  },
  {
    name: 'DeerFit Canvas Sneakers',
    description: 'Classic canvas sneakers for everyday wear',
    price: 2800,
    stock: 50,
    sku: 'ACC-SNEAKERS-CANVAS-001',
    material: 'Canvas',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy', 'Red'],
  },
  {
    name: 'DeerFit Leather Wallet',
    description: 'Premium genuine leather wallet',
    price: 1500,
    stock: 60,
    sku: 'ACC-WALLET-LEATHER-001',
    material: 'Genuine Leather',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan'],
  },
  {
    name: 'DeerFit Silk Scarf',
    description: 'Elegant silk scarf for all seasons',
    price: 1800,
    stock: 55,
    sku: 'ACC-SCARF-SILK-001',
    material: 'Silk',
    sizes: ['One Size'],
    colors: ['Purple', 'Pink', 'Blue', 'Green'],
  },
];

const displayAllProducts = async () => {
  try {
    console.log('📦 Fetching all products from database...\n');
    const response = await axios.get(`${API_URL}/products?limit=200`);

    if (response.data.success && response.data.data.items) {
      const items = response.data.data.items;
      console.log(`✅ Found ${items.length} products\n`);

      console.log('📊 PRODUCT SUMMARY:\n');

      // Group by categories if available
      const byPrice = items.sort((a, b) => a.price - b.price);

      console.log(`💰 Price Range: ৳${byPrice[0].price} - ৳${byPrice[byPrice.length - 1].price}\n`);

      console.log('🛍️  Sample Products:');
      items.slice(0, 15).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Price: ৳${product.price} | Stock: ${product.stock}`);
        if (product.colors && product.colors.length) {
          console.log(`   Colors: ${product.colors.join(', ')}`);
        }
        if (product.sizes && product.sizes.length) {
          console.log(`   Sizes: ${product.sizes.join(', ')}`);
        }
        console.log('');
      });

      if (items.length > 15) {
        console.log(`... and ${items.length - 15} more products\n`);
      }

      console.log(`\n📊 Statistics:`);
      console.log(`   Total Products: ${response.data.data.pagination.total}`);
      console.log(`   Total Pages: ${response.data.data.pagination.pages}`);
      console.log(`   Items Per Page: ${response.data.data.pagination.limit}\n`);

      // Calculate some stats
      const avgPrice = Math.round(items.reduce((sum, p) => sum + p.price, 0) / items.length);
      const totalStock = items.reduce((sum, p) => sum + p.stock, 0);
      const availableProducts = items.filter(p => p.stock > 0).length;

      console.log(`💹 Market Analysis:`);
      console.log(`   Average Price: ৳${avgPrice}`);
      console.log(`   Total Stock: ${totalStock} units`);
      console.log(`   Available Products: ${availableProducts}/${items.length}`);
      console.log(`   Stock-out Risk: ${items.length - availableProducts} products\n`);

    }
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
  }
};

console.log('\n═══════════════════════════════════════');
console.log('   🎉 CLOTHING E-COMMERCE PRODUCT REPORT');
console.log('═══════════════════════════════════════\n');

displayAllProducts();
