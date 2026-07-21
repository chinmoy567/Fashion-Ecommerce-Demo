import request from 'supertest';
import app from '../app.js';
import { createCustomer, createProduct } from './helpers.js';

describe('POST /api/reviews', () => {
  it('creates a review for the authenticated customer', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 5, comment: 'Great' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('pending');
  });

  it('rejects a second review from the same customer for the same product', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 5 });

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 3 });

    expect(res.status).toBe(400);
  });

  it('rejects missing productId or rating with 400 before touching customerId', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 });

    expect(res.status).toBe(400);
  });

  it('rejects an out-of-range rating', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 9 });

    expect(res.status).toBe(400);
  });

  it('rejects a review for a non-existent product', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: '507f1f77bcf86cd799439011', rating: 4 });

    expect(res.status).toBe(404);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).post('/api/reviews').send({ productId: '507f1f77bcf86cd799439011', rating: 4 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/reviews/product/:productId', () => {
  it('returns an empty approved-review list for a product with no reviews', async () => {
    const product = await createProduct();

    const res = await request(app).get(`/api/reviews/product/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toEqual([]);
    expect(res.body.data.averageRating).toBe(0);
  });
});

describe('GET /api/reviews/my-reviews', () => {
  it("returns only the caller's own reviews", async () => {
    const { token } = await createCustomer({ email: 'reviewer1@test.com' });
    const { token: otherToken } = await createCustomer({ email: 'reviewer2@test.com' });
    const product = await createProduct();

    await request(app).post('/api/reviews').set('Authorization', `Bearer ${token}`).send({ productId: product._id, rating: 4 });
    await request(app).post('/api/reviews').set('Authorization', `Bearer ${otherToken}`).send({ productId: product._id, rating: 2 });

    const res = await request(app).get('/api/reviews/my-reviews').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].rating).toBe(4);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/reviews/my-reviews');
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/reviews/:id and DELETE /api/reviews/:id', () => {
  it('lets the owner update their own review', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const created = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 3 });

    const res = await request(app)
      .put(`/api/reviews/${created.body.data._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5, comment: 'Updated' });

    expect(res.status).toBe(200);
    expect(res.body.data.rating).toBe(5);
  });

  it("rejects updating another customer's review", async () => {
    const { token } = await createCustomer({ email: 'owner@test.com' });
    const { token: otherToken } = await createCustomer({ email: 'intruder@test.com' });
    const product = await createProduct();

    const created = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 3 });

    const res = await request(app)
      .put(`/api/reviews/${created.body.data._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ rating: 1 });

    expect(res.status).toBe(403);
  });

  it('lets the owner delete their own review', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const created = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, rating: 3 });

    const res = await request(app)
      .delete(`/api/reviews/${created.body.data._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
