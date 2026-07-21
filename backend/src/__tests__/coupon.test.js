import request from 'supertest';
import app from '../app.js';
import Coupon from '../models/Coupon.js';
import { createAdmin, createCustomer } from './helpers.js';

describe('POST /api/coupons', () => {
  it('creates a coupon as admin', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'save10', discountType: 'percentage', discountValue: 10 });

    expect(res.status).toBe(201);
    expect(res.body.data.code).toBe('SAVE10');
  });

  it('rejects a duplicate coupon code', async () => {
    const { token } = await createAdmin();
    await Coupon.create({ code: 'DUP10', discountType: 'fixed', discountValue: 100 });

    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'dup10', discountType: 'fixed', discountValue: 50 });

    expect(res.status).toBe(400);
  });

  it('rejects missing required fields', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'X' });

    expect(res.status).toBe(400);
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/coupons')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'CUST10', discountType: 'fixed', discountValue: 10 });

    expect(res.status).toBe(403);
  });
});

describe('POST /api/coupons/validate', () => {
  it('validates a percentage coupon and computes the discount', async () => {
    await Coupon.create({ code: 'PERC10', discountType: 'percentage', discountValue: 10, isActive: true });

    const res = await request(app).post('/api/coupons/validate').send({ code: 'perc10', subtotal: 1000 });

    expect(res.status).toBe(200);
    expect(res.body.data.discountAmount).toBe(100);
    expect(res.body.data.finalAmount).toBe(900);
  });

  it('rejects an unknown coupon code', async () => {
    const res = await request(app).post('/api/coupons/validate').send({ code: 'NOPE', subtotal: 500 });
    expect(res.status).toBe(404);
  });

  it('rejects an expired coupon', async () => {
    await Coupon.create({
      code: 'EXPIRED',
      discountType: 'fixed',
      discountValue: 50,
      expiryDate: new Date(Date.now() - 86400000),
    });

    const res = await request(app).post('/api/coupons/validate').send({ code: 'EXPIRED', subtotal: 500 });

    expect(res.status).toBe(400);
  });

  it('rejects a coupon that has hit its usage limit', async () => {
    await Coupon.create({
      code: 'MAXED',
      discountType: 'fixed',
      discountValue: 50,
      maxUsage: 1,
      currentUsage: 1,
    });

    const res = await request(app).post('/api/coupons/validate').send({ code: 'MAXED', subtotal: 500 });

    expect(res.status).toBe(400);
  });

  it('rejects when subtotal is below the minimum purchase', async () => {
    await Coupon.create({
      code: 'MINPURCHASE',
      discountType: 'fixed',
      discountValue: 50,
      minPurchase: 1000,
    });

    const res = await request(app).post('/api/coupons/validate').send({ code: 'MINPURCHASE', subtotal: 500 });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/coupons/:id', () => {
  it('updates a coupon as admin', async () => {
    const { token } = await createAdmin();
    const coupon = await Coupon.create({ code: 'UPDATE1', discountType: 'fixed', discountValue: 50 });

    const res = await request(app)
      .put(`/api/coupons/${coupon._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it('returns 404 for a non-existent coupon', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .put('/api/coupons/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/coupons/:id', () => {
  it('deletes a coupon as admin', async () => {
    const { token } = await createAdmin();
    const coupon = await Coupon.create({ code: 'DELETE1', discountType: 'fixed', discountValue: 50 });

    const res = await request(app)
      .delete(`/api/coupons/${coupon._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
