import request from 'supertest';
import app from '../app.js';
import { createCustomer, createProduct } from './helpers.js';

describe('GET /api/customers/me', () => {
  it("retrieves the logged-in customer's profile", async () => {
    const { token } = await createCustomer({ email: 'me@test.com' });

    const res = await request(app).get('/api/customers/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('me@test.com');
    expect(res.body.data.password).toBeUndefined();
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/customers/me');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/customers/me', () => {
  it('updates profile fields', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .put('/api/customers/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name', phone: '01799999999' });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Name');
  });
});

describe('Address endpoints', () => {
  it('adds and lists addresses', async () => {
    const { token } = await createCustomer();

    const addRes = await request(app)
      .post('/api/customers/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        line1: '123 Main St',
        city: 'Dhaka',
        upazila: 'Mirpur',
        division: 'Dhaka',
        postalCode: '1200',
      });

    expect(addRes.status).toBe(201);

    const listRes = await request(app)
      .get('/api/customers/addresses')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
  });

  it('deletes an address', async () => {
    const { token } = await createCustomer();

    const addRes = await request(app)
      .post('/api/customers/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({ line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' });

    const res = await request(app)
      .delete(`/api/customers/addresses/${addRes.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('returns 404 when deleting a non-existent address', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .delete('/api/customers/addresses/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('Wishlist endpoints', () => {
  it('adds a product to the wishlist', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .post('/api/customers/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    expect(res.status).toBe(201);
  });

  it('rejects adding a duplicate wishlist entry', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    await request(app)
      .post('/api/customers/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const res = await request(app)
      .post('/api/customers/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    expect(res.status).toBe(400);
  });

  it('lists and removes wishlist items', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    await request(app)
      .post('/api/customers/wishlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const listRes = await request(app)
      .get('/api/customers/wishlist')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.body.data.length).toBe(1);

    const removeRes = await request(app)
      .delete(`/api/customers/wishlist/${product._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(removeRes.status).toBe(200);
  });

  it('returns 404 when removing an item not in the wishlist', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .delete(`/api/customers/wishlist/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
