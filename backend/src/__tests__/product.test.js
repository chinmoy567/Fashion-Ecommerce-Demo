import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCustomer, createCategory, createProduct } from './helpers.js';

describe('GET /api/products', () => {
  it('lists active products with pagination', async () => {
    await createProduct({ name: 'A' });
    await createProduct({ name: 'B' });

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(2);
    expect(res.body.data.pagination.total).toBe(2);
  });

  it('filters by category', async () => {
    const cat1 = await createCategory({ name: 'Men', slug: 'men' });
    const cat2 = await createCategory({ name: 'Women', slug: 'women' });
    await createProduct({ name: 'Shirt', categoryId: cat1._id });
    await createProduct({ name: 'Dress', categoryId: cat2._id });

    const res = await request(app).get('/api/products').query({ category: cat1._id.toString() });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].name).toBe('Shirt');
  });

  it('filters by price range', async () => {
    await createProduct({ name: 'Cheap', price: 500 });
    await createProduct({ name: 'Expensive', price: 5000 });

    const res = await request(app).get('/api/products').query({ minPrice: 1000 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].name).toBe('Expensive');
  });
});

describe('GET /api/products/:id', () => {
  it('returns product details and increments view count', async () => {
    const product = await createProduct();

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.viewCount).toBe(1);
  });

  it('returns 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/507f1f77bcf86cd799439011');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/products', () => {
  it('creates a product as admin', async () => {
    const { token } = await createAdmin();
    const category = await createCategory();

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Product',
        categoryId: category._id,
        price: 1500,
        stock: 20,
        sku: 'NEW-SKU-1',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.sku).toBe('NEW-SKU-1');
  });

  it('rejects duplicate SKU', async () => {
    const { token } = await createAdmin();
    const category = await createCategory();
    await createProduct({ sku: 'DUP-SKU', categoryId: category._id });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Dup', categoryId: category._id, price: 100, stock: 5, sku: 'DUP-SKU' });

    expect(res.status).toBe(400);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).post('/api/products').send({ name: 'No Auth' });
    expect(res.status).toBe(401);
  });

  it('rejects a customer token (not admin)', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Customer Product' });

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/products/:id', () => {
  it('updates a product as admin', async () => {
    const { token } = await createAdmin();
    const product = await createProduct();

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 2000 });

    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(2000);
  });

  it('returns 404 for a non-existent product', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .put('/api/products/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 2000 });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  it('deletes a product as admin', async () => {
    const { token } = await createAdmin();
    const product = await createProduct();

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('returns 404 for a non-existent product', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .delete('/api/products/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
