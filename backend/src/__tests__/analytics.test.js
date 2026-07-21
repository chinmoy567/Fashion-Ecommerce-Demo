import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCustomer } from './helpers.js';

describe('GET /api/analytics/dashboard', () => {
  it('returns dashboard metrics for admin', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('monthly');
    expect(res.body.data).toHaveProperty('yearly');
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app).get('/api/analytics/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/analytics/dashboard');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/analytics/sales', () => {
  it('returns sales metrics for a date range', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .get('/api/analytics/sales')
      .query({ startDate: '2026-01-01', endDate: '2026-12-31' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalRevenue');
  });

  it('rejects a request missing date range params', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/sales').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/analytics/customers', () => {
  it('returns customer metrics for a date range', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .get('/api/analytics/customers')
      .query({ startDate: '2026-01-01', endDate: '2026-12-31' })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalCustomers');
  });

  it('rejects a request missing date range params', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/customers').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/analytics/products', () => {
  it('returns product performance metrics', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/products').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('topProducts');
  });
});

describe('GET /api/analytics/reviews', () => {
  it('returns review metrics', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/reviews').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalReviews');
  });
});

describe('GET /api/analytics/sales/daily and /sales/monthly', () => {
  it('returns a daily sales trend array', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/sales/daily').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns a monthly sales trend array', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/sales/monthly').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/analytics/categories and /orders/status-breakdown', () => {
  it('returns category performance data', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/analytics/categories').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns order status breakdown data', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .get('/api/analytics/orders/status-breakdown')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
