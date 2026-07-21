import request from 'supertest';
import app from '../app.js';
import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import Cart from '../models/Cart.js';
import { createCustomer, createAdmin, createProduct } from './helpers.js';

describe('Product variant CRUD', () => {
  it('creates a variant and flips trackVariantStock on the product', async () => {
    const { token } = await createAdmin();
    const product = await createProduct();

    const res = await request(app)
      .post(`/api/products/${product._id}/variants`)
      .set('Authorization', `Bearer ${token}`)
      .send({ size: 'M', color: 'Black', stock: 5 });

    expect(res.status).toBe(201);
    expect(res.body.data.stock).toBe(5);

    const updated = await Product.findById(product._id);
    expect(updated.trackVariantStock).toBe(true);
  });

  it('rejects a duplicate size/color variant', async () => {
    const { token } = await createAdmin();
    const product = await createProduct();
    await ProductVariant.create({ productId: product._id, size: 'M', color: 'Black', stock: 5 });

    const res = await request(app)
      .post(`/api/products/${product._id}/variants`)
      .set('Authorization', `Bearer ${token}`)
      .send({ size: 'M', color: 'Black', stock: 3 });

    expect(res.status).toBe(400);
  });

  it('rejects variant creation from a non-admin', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .post(`/api/products/${product._id}/variants`)
      .set('Authorization', `Bearer ${token}`)
      .send({ size: 'M', color: 'Black', stock: 5 });

    expect(res.status).toBe(403);
  });

  it('deletes a variant and reverts trackVariantStock when none remain', async () => {
    const { token } = await createAdmin();
    const product = await createProduct({ trackVariantStock: true });
    const variant = await ProductVariant.create({ productId: product._id, size: 'M', color: 'Black', stock: 5 });

    const res = await request(app)
      .delete(`/api/products/${product._id}/variants/${variant._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const updated = await Product.findById(product._id);
    expect(updated.trackVariantStock).toBe(false);
  });
});

describe('Cart with variants', () => {
  it('requires variantId when the product tracks variant stock', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ trackVariantStock: true });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    expect(res.status).toBe(400);
  });

  it('adds a variant item to the cart and checks its own stock', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ trackVariantStock: true });
    const variant = await ProductVariant.create({ productId: product._id, size: 'M', color: 'Black', stock: 3 });

    const ok = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, variantId: variant._id, quantity: 2 });
    expect(ok.status).toBe(200);

    const overStock = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, variantId: variant._id, quantity: 2 });
    expect(overStock.status).toBe(400);
  });

  it('keeps two variants of the same product as separate cart lines', async () => {
    const { token, customer } = await createCustomer();
    const product = await createProduct({ trackVariantStock: true });
    const variantM = await ProductVariant.create({ productId: product._id, size: 'M', color: 'Black', stock: 5 });
    const variantL = await ProductVariant.create({ productId: product._id, size: 'L', color: 'Black', stock: 5 });

    await request(app).post('/api/cart/add').set('Authorization', `Bearer ${token}`).send({ productId: product._id, variantId: variantM._id, quantity: 1 });
    await request(app).post('/api/cart/add').set('Authorization', `Bearer ${token}`).send({ productId: product._id, variantId: variantL._id, quantity: 1 });

    const cart = await Cart.findOne({ customerId: customer._id });
    expect(cart.items.length).toBe(2);
  });
});

describe('Order creation deducts variant stock', () => {
  it('deducts stock from the correct variant on order creation', async () => {
    const { token, customer } = await createCustomer();
    const product = await createProduct({ trackVariantStock: true });
    const variant = await ProductVariant.create({ productId: product._id, size: 'M', color: 'Black', stock: 5 });

    await request(app).post('/api/cart/add').set('Authorization', `Bearer ${token}`).send({ productId: product._id, variantId: variant._id, quantity: 2 });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddress: { line1: 'A', city: 'Dhaka', upazila: 'X', division: 'Dhaka', postalCode: '1200' },
      });

    expect(res.status).toBe(201);
    const updatedVariant = await ProductVariant.findById(variant._id);
    expect(updatedVariant.stock).toBe(3);
  });
});
