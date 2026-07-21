import { generateToken } from '../utils/jwt.js';
import Customer from '../models/Customer.js';
import AdminUser from '../models/AdminUser.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Create a verified customer and return { customer, token }
export const createCustomer = async (overrides = {}) => {
  const customer = await Customer.create({
    name: 'Test Customer',
    email: overrides.email || 'customer@test.com',
    phone: '01700000000',
    password: 'Password123!',
    emailVerified: true,
    ...overrides,
  });
  const token = generateToken(customer._id, 'customer');
  return { customer, token };
};

// Create an admin/manager user and return { adminUser, token }
export const createAdmin = async (overrides = {}) => {
  const adminUser = await AdminUser.create({
    email: overrides.email || 'admin@test.com',
    password: 'Password123!',
    fullName: 'Test Admin',
    role: overrides.role || 'super_admin',
    ...overrides,
  });
  const token = generateToken(adminUser._id, adminUser.role);
  return { adminUser, token };
};

// Create a category
export const createCategory = async (overrides = {}) => {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return Category.create({
    name: overrides.name || `Category-${unique}`,
    slug: overrides.slug || `category-${unique}`,
    ...overrides,
  });
};

// Create a product under a category
export const createProduct = async (overrides = {}) => {
  const category = overrides.categoryId ? null : await createCategory();
  return Product.create({
    name: 'Test Product',
    price: 1000,
    stock: 10,
    sku: `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    categoryId: overrides.categoryId || category._id,
    ...overrides,
  });
};
