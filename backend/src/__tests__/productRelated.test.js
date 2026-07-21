import request from 'supertest';
import app from '../app.js';
import { createCategory, createProduct } from './helpers.js';

describe('GET /api/products/:id/related', () => {
  it('returns other active products from the same category, excluding itself', async () => {
    const category = await createCategory({ name: 'Men' });
    const product = await createProduct({ categoryId: category._id, name: 'Main', sku: 'MAIN-1' });
    const sibling = await createProduct({ categoryId: category._id, name: 'Sibling', sku: 'SIB-1' });

    const res = await request(app).get(`/api/products/${product._id}/related`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(String(sibling._id));
  });

  it('excludes inactive products from another category', async () => {
    const category = await createCategory({ name: 'Women' });
    const otherCategory = await createCategory({ name: 'Kids' });
    const product = await createProduct({ categoryId: category._id, sku: 'MAIN-2' });
    await createProduct({ categoryId: otherCategory._id, sku: 'OTHER-1' });
    await createProduct({ categoryId: category._id, sku: 'INACTIVE-1', status: 'inactive' });

    const res = await request(app).get(`/api/products/${product._id}/related`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);
  });

  it('respects the limit query param', async () => {
    const category = await createCategory({ name: 'Shoes' });
    const product = await createProduct({ categoryId: category._id, sku: 'MAIN-3' });
    for (let i = 0; i < 5; i++) {
      await createProduct({ categoryId: category._id, sku: `SIB-${i}` });
    }

    const res = await request(app).get(`/api/products/${product._id}/related?limit=2`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('returns 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/507f1f77bcf86cd799439011/related');
    expect(res.status).toBe(404);
  });
});
