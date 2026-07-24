import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCustomer, createProduct } from './helpers.js';

describe('GET /api/admin/dashboard', () => {
  it('returns dashboard metrics for an admin', async () => {
    const { token } = await createAdmin();

    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalOrders');
    expect(res.body.data).toHaveProperty('totalRevenue');
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app).get('/api/admin/dashboard').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/admin/customers', () => {
  it('lists all customers for an admin', async () => {
    const { token } = await createAdmin();
    await createCustomer({ email: 'c1@test.com' });

    const res = await request(app).get('/api/admin/customers').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('POST /api/admin/create-staff', () => {
  it('creates a new staff account for a super admin', async () => {
    const { token } = await createAdmin({ email: 'superadmin1@test.com' });

    const res = await request(app).post('/api/admin/create-staff').set('Authorization', `Bearer ${token}`).send({
      email: 'newstaff@test.com',
      password: 'Password123!',
      fullName: 'New Staff',
      role: 'manager',
    });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('manager');
  });

  it('rejects a manager token', async () => {
    const { token } = await createAdmin({ email: 'manager1@test.com', role: 'manager' });

    const res = await request(app).post('/api/admin/create-staff').set('Authorization', `Bearer ${token}`).send({
      email: 'blocked@test.com',
      password: 'Password123!',
      fullName: 'Blocked',
      role: 'manager',
    });

    expect(res.status).toBe(403);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).post('/api/admin/create-staff').send({
      email: 'notoken@test.com',
      password: 'Password123!',
      fullName: 'No Token',
      role: 'manager',
    });

    expect(res.status).toBe(401);
  });

  it('rejects an invalid role', async () => {
    const { token } = await createAdmin({ email: 'superadmin2@test.com' });

    const res = await request(app).post('/api/admin/create-staff').set('Authorization', `Bearer ${token}`).send({
      email: 'badrole@test.com',
      password: 'Password123!',
      fullName: 'Bad Role',
      role: 'superuser',
    });

    expect(res.status).toBe(400);
  });

  it('rejects a duplicate staff email with 409', async () => {
    const { token } = await createAdmin({ email: 'superadmin3@test.com' });

    await request(app).post('/api/admin/create-staff').set('Authorization', `Bearer ${token}`).send({
      email: 'dupstaff@test.com',
      password: 'Password123!',
      fullName: 'Dup Staff',
      role: 'manager',
    });

    const res = await request(app).post('/api/admin/create-staff').set('Authorization', `Bearer ${token}`).send({
      email: 'dupstaff@test.com',
      password: 'Password123!',
      fullName: 'Dup Staff',
      role: 'manager',
    });

    expect(res.status).toBe(409);
  });
});

describe('GET /api/admin/staff', () => {
  it('lists staff for a super admin', async () => {
    const { token } = await createAdmin({ email: 'superadmin4@test.com' });

    const res = await request(app).get('/api/admin/staff').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('rejects a manager token', async () => {
    const { token } = await createAdmin({ email: 'manager2@test.com', role: 'manager' });

    const res = await request(app).get('/api/admin/staff').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/admin/staff/:id/status', () => {
  it('lets a super admin deactivate another staff member', async () => {
    const { token } = await createAdmin({ email: 'superadmin5@test.com' });
    const { adminUser: manager } = await createAdmin({ email: 'manager3@test.com', role: 'manager' });

    const res = await request(app)
      .put(`/api/admin/staff/${manager._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isActive).toBe(false);
  });

  it('rejects a manager token', async () => {
    const { token } = await createAdmin({ email: 'manager4@test.com', role: 'manager' });
    const { adminUser: otherManager } = await createAdmin({ email: 'manager5@test.com', role: 'manager' });

    const res = await request(app)
      .put(`/api/admin/staff/${otherManager._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ isActive: false });

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/admin/orders/:id/confirm and /cancel', () => {
  it('returns 404 for a non-existent order on confirm', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .put('/api/admin/orders/507f1f77bcf86cd799439011/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(404);
  });

  it('returns 404 for a non-existent order on cancel', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .put('/api/admin/orders/507f1f77bcf86cd799439011/cancel')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /api/admin/seed-stats', () => {
  it('returns counts of products, customers and orders', async () => {
    const { token } = await createAdmin();
    await createProduct();

    const res = await request(app)
      .get('/api/admin/seed-stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.products).toBe(1);
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/admin/seed-stats');

    expect(res.status).toBe(401);
  });
});
