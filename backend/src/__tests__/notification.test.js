import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCustomer } from './helpers.js';

describe('POST /api/notifications', () => {
  it('creates a broadcast notification for all customers', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientRole: 'customer', type: 'promotion', message: 'Everything 20% off' });

    expect(res.status).toBe(201);
    expect(res.body.data.recipientId).toBeFalsy();
  });

  it('creates a targeted notification for a specific customer', async () => {
    const { token } = await createAdmin();
    const { customer } = await createCustomer();

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientId: customer._id, recipientRole: 'customer', type: 'order_update', message: 'Your order shipped' });

    expect(res.status).toBe(201);
    expect(res.body.data.recipientId).toBe(String(customer._id));
  });

  it('rejects missing required fields', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'promotion' });

    expect(res.status).toBe(400);
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipientRole: 'customer', type: 'promotion', message: 'Everything 20% off' });

    expect(res.status).toBe(403);
  });
});

describe('GET /api/notifications', () => {
  it("returns the customer's targeted and broadcast notifications", async () => {
    const { token, customer } = await createCustomer();
    const { token: adminToken } = await createAdmin();

    await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ recipientRole: 'customer', type: 'promotion', message: 'Broadcast to all customers' });

    await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ recipientId: customer._id, recipientRole: 'customer', type: 'order_update', message: 'Targeted at you' });

    const res = await request(app).get('/api/notifications').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(2);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/notifications');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/notifications/count', () => {
  it('returns the correct unread count', async () => {
    const { token } = await createCustomer();
    const { token: adminToken } = await createAdmin();

    await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ recipientRole: 'customer', type: 'promotion', message: 'Broadcast' });

    const res = await request(app).get('/api/notifications/count').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.unreadCount).toBe(1);
  });
});

describe('PUT /api/notifications/:id/read', () => {
  it('marks a notification as read', async () => {
    const { token, customer } = await createCustomer();
    const { token: adminToken } = await createAdmin();

    const created = await request(app)
      .post('/api/notifications')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ recipientId: customer._id, recipientRole: 'customer', type: 'order_update', message: 'Hi' });

    const res = await request(app)
      .put(`/api/notifications/${created.body.data._id}/read`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.isRead).toBe(true);
  });

  it('returns 404 for a non-existent notification', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .put('/api/notifications/507f1f77bcf86cd799439011/read')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
