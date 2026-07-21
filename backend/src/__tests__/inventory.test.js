import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCustomer, createProduct } from './helpers.js';

describe('GET /api/inventory', () => {
  it('lists inventory for admin', async () => {
    const { token } = await createAdmin();
    await createProduct({ stock: 5 });

    const res = await request(app).get('/api/inventory').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  it('filters by low stock status', async () => {
    const { token } = await createAdmin();
    await createProduct({ stock: 5, sku: 'LOW-1' });
    await createProduct({ stock: 50, sku: 'HIGH-1' });

    const res = await request(app)
      .get('/api/inventory')
      .query({ status: 'low' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app).get('/api/inventory').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/inventory/summary', () => {
  it('returns summary counts', async () => {
    const { token } = await createAdmin();
    await createProduct({ stock: 0, sku: 'OOS-1' });
    await createProduct({ stock: 5, sku: 'LOW-2' });

    const res = await request(app).get('/api/inventory/summary').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.totalProducts).toBe(2);
    expect(res.body.data.outOfStockProducts).toBe(1);
    expect(res.body.data.lowStockProducts).toBe(1);
  });
});

describe('POST /api/inventory/adjust', () => {
  it('adjusts stock up and down', async () => {
    const { token } = await createAdmin();
    const product = await createProduct({ stock: 10 });

    const res = await request(app)
      .post('/api/inventory/adjust')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: -3, reason: 'Damaged' });

    expect(res.status).toBe(200);
    expect(res.body.data.newStock).toBe(7);
  });

  it('clamps stock at zero when adjustment would go negative', async () => {
    const { token } = await createAdmin();
    const product = await createProduct({ stock: 2 });

    const res = await request(app)
      .post('/api/inventory/adjust')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: -10, reason: 'Correction' });

    expect(res.status).toBe(200);
    expect(res.body.data.newStock).toBe(0);
  });

  it('rejects missing required fields', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/inventory/adjust')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(400);
  });

  it('returns 404 for a non-existent product', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/inventory/adjust')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: '507f1f77bcf86cd799439011', quantity: 5, reason: 'Restock' });

    expect(res.status).toBe(404);
  });
});

describe('GET /api/inventory/low-stock and /out-of-stock', () => {
  it('returns low stock products', async () => {
    const { token } = await createAdmin();
    await createProduct({ stock: 3, sku: 'LOW-3' });

    const res = await request(app).get('/api/inventory/low-stock').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.count).toBe(1);
  });

  it('returns out-of-stock products', async () => {
    const { token } = await createAdmin();
    await createProduct({ stock: 0, sku: 'OOS-2' });

    const res = await request(app).get('/api/inventory/out-of-stock').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });
});

describe('POST /api/inventory/restock', () => {
  it('increases stock and reports the restock request', async () => {
    const { token } = await createAdmin();
    const product = await createProduct({ stock: 5 });

    const res = await request(app)
      .post('/api/inventory/restock')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 20, supplier: 'Acme Textiles' });

    expect(res.status).toBe(200);
    expect(res.body.data.newStock).toBe(25);
  });

  it('rejects missing required fields', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/inventory/restock')
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 20 });

    expect(res.status).toBe(400);
  });
});
