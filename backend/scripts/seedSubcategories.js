import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import ProductImage from '../src/models/ProductImage.js';
import Brand from '../src/models/Brand.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGODB_URI = process.env.MONGODB_URI;

// Colored SVG placeholder, mirrors the pattern used in scripts/seedDatabase.js
const placeholderImage = (label, color) =>
  `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23${color}" width="400" height="400"/%3E%3Ctext x="200" y="200" font-size="22" fill="white" text-anchor="middle" dy=".3em"%3E${encodeURIComponent(label)}%3C/text%3E%3C/svg%3E`;

// Leaf categories mirror frontend/src/pages/Shop.jsx CATEGORIES (level 3, plus level-2 leaves with no children)
const SUBCATEGORIES = [
  { slug: 'mens-shirt', name: 'Men Shirts', parentSlug: 'mens-upper', color: '4a5568' },
  { slug: 'mens-tshirt', name: 'Men T-Shirts', parentSlug: 'mens-upper', color: '2d3748' },
  { slug: 'mens-jacket', name: 'Men Jackets', parentSlug: 'mens-upper', color: '1a202c' },
  { slug: 'mens-sweater', name: 'Men Sweaters', parentSlug: 'mens-upper', color: '744210' },
  { slug: 'mens-pants', name: 'Men Pants', parentSlug: 'mens-lower', color: '2c5282' },
  { slug: 'mens-jeans', name: 'Men Jeans', parentSlug: 'mens-lower', color: '1e3a8a' },
  { slug: 'mens-shorts', name: 'Men Shorts', parentSlug: 'mens-lower', color: '2f855a' },
  { slug: 'mens-activewear', name: 'Men Activewear', parentSlug: 'mens-lower', color: 'c53030' },

  { slug: 'womens-shirt', name: 'Women Shirts', parentSlug: 'womens-upper', color: 'b83280' },
  { slug: 'womens-tshirt', name: 'Women T-Shirts', parentSlug: 'womens-upper', color: 'd53f8c' },
  { slug: 'womens-blouse', name: 'Women Blouses', parentSlug: 'womens-upper', color: '97266d' },
  { slug: 'womens-jacket', name: 'Women Jackets', parentSlug: 'womens-upper', color: '702459' },
  { slug: 'womens-top', name: 'Women Tops', parentSlug: 'womens-upper', color: 'ed64a6' },
  { slug: 'womens-pants', name: 'Women Pants', parentSlug: 'womens-lower', color: '5a67d8' },
  { slug: 'womens-jeans', name: 'Women Jeans', parentSlug: 'womens-lower', color: '434190' },
  { slug: 'womens-skirt', name: 'Women Skirts', parentSlug: 'womens-lower', color: '6b46c1' },
  { slug: 'womens-leggings', name: 'Women Leggings', parentSlug: 'womens-lower', color: '553c9a' },
  { slug: 'womens-dress', name: 'Women Dresses', parentSlug: 'womens-fullbody', color: 'c53030' },
  { slug: 'womens-saree', name: 'Women Sarees', parentSlug: 'womens-fullbody', color: 'be185d' },
  { slug: 'womens-gown', name: 'Women Gowns', parentSlug: 'womens-fullbody', color: '9f1239' },

  { slug: 'kids-boys', name: "Boys' Clothing", parentSlug: 'kids-clothing', color: '2b6cb0' },
  { slug: 'kids-girls', name: "Girls' Clothing", parentSlug: 'kids-clothing', color: 'd53f8c' },

  { slug: 'headwear', name: 'Headwear', parentSlug: 'accessories', color: 'dd6b20' },
  { slug: 'footwear', name: 'Footwear', parentSlug: 'accessories', color: '744210' },
  { slug: 'belts', name: 'Belts', parentSlug: 'accessories', color: '78350f' },
  { slug: 'scarves', name: 'Scarves', parentSlug: 'accessories', color: 'b45309' },
];

// Mid-level categories that group the leaves above (level 2 in Shop.jsx)
const MID_CATEGORIES = [
  { slug: 'mens-upper', name: "Men's Upper Wear", parentSlug: 'mens-clothing', color: '4a5568' },
  { slug: 'mens-lower', name: "Men's Lower Wear", parentSlug: 'mens-clothing', color: '2d3748' },
  { slug: 'womens-upper', name: "Women's Upper Wear", parentSlug: 'womens-clothing', color: 'b83280' },
  { slug: 'womens-lower', name: "Women's Lower Wear", parentSlug: 'womens-clothing', color: '6b46c1' },
  { slug: 'womens-fullbody', name: "Women's Full Body", parentSlug: 'womens-clothing', color: '9f1239' },
];

// 10 generic product templates per leaf category, priced/named by category
const buildProductsForLeaf = (leaf) => {
  const base = leaf.name.replace(/'s?$/, '').trim();
  const variants = [
    'Classic', 'Premium', 'Casual', 'Slim Fit', 'Regular Fit',
    'Relaxed', 'Everyday', 'Signature', 'Essential', 'Deluxe',
  ];
  return variants.map((variant, i) => ({
    name: `DeerFit ${variant} ${base}`,
    description: `${variant} ${base.toLowerCase()} from DeerFit's collection.`,
    price: 800 + i * 350,
    stock: 30 + (i % 5) * 10,
  }));
};

async function seedSubcategories() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('✓ Connected to MongoDB');

    const brand = await Brand.findOne({ name: 'DeerFit' });
    if (!brand) throw new Error('Base "DeerFit" brand not found - run scripts/seedDatabase.js first');

    const slugToId = {};
    const existingCategories = await Category.find().select('slug _id');
    for (const c of existingCategories) slugToId[c.slug] = c._id;

    // Create mid-level categories (level 2) under existing top-level ones
    for (const mid of MID_CATEGORIES) {
      if (slugToId[mid.slug]) continue;
      const parentId = slugToId[mid.parentSlug];
      if (!parentId) {
        console.warn(`  ⚠ Skipping ${mid.slug}: parent ${mid.parentSlug} not found`);
        continue;
      }
      const created = await Category.create({
        name: mid.name,
        slug: mid.slug,
        parentId,
        image: placeholderImage(mid.name, mid.color),
      });
      slugToId[mid.slug] = created._id;
      console.log(`✓ Created mid-level category: ${mid.name}`);
    }

    let totalCreatedProducts = 0;
    let totalCreatedCategories = 0;

    // Create leaf categories (level 3, or level 2 for kids/accessories) and their products
    for (const leaf of SUBCATEGORIES) {
      let categoryId = slugToId[leaf.slug];

      if (!categoryId) {
        const parentId = slugToId[leaf.parentSlug];
        if (!parentId) {
          console.warn(`  ⚠ Skipping ${leaf.slug}: parent ${leaf.parentSlug} not found`);
          continue;
        }
        const created = await Category.create({
          name: leaf.name,
          slug: leaf.slug,
          parentId,
          image: placeholderImage(leaf.name, leaf.color),
        });
        categoryId = created._id;
        slugToId[leaf.slug] = categoryId;
        totalCreatedCategories++;
        console.log(`✓ Created leaf category: ${leaf.name}`);
      }

      const existingCount = await Product.countDocuments({ categoryId });
      const needed = Math.max(0, 10 - existingCount);
      if (needed === 0) {
        console.log(`  ✓ ${leaf.name} already has ${existingCount} products`);
        continue;
      }

      const templates = buildProductsForLeaf(leaf).slice(0, needed);
      for (const tmpl of templates) {
        const sku = `DEERFIT-${leaf.slug.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const product = await Product.create({
          name: tmpl.name,
          description: tmpl.description,
          categoryId,
          brandId: brand._id,
          price: tmpl.price,
          stock: tmpl.stock,
          sku,
          material: 'Cotton/Polyester Blend',
          sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White', 'Blue', 'Red', 'Green'],
          status: 'active',
          isFeatured: Math.random() > 0.8,
        });

        await ProductImage.create({
          productId: product._id,
          url: placeholderImage(tmpl.name, leaf.color),
          isPrimary: true,
        });

        totalCreatedProducts++;
      }
      console.log(`✓ ${leaf.name}: added ${templates.length} products (total now ${existingCount + templates.length})`);
    }

    console.log(`\n✨ Done. Created ${totalCreatedCategories} new categories and ${totalCreatedProducts} new products.`);
  } catch (error) {
    console.error('❌ Error seeding subcategories:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  }
}

seedSubcategories();
