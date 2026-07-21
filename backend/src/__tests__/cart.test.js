import request from 'supertest';
import app from '../app.js';
import { createCustomer, createProduct } from './helpers.js';

describe('GET /api/cart', () => {
  it('creates and returns an empty cart for a new customer', async () => {
    const { token } = await createCustomer();

    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items).toEqual([]);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/cart/add', () => {
  it('adds a product to the cart', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10, price: 500 });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  it('increments quantity when adding an existing item again', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10, price: 500 });

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 2 });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].quantity).toBe(5);
  });

  it('rejects adding a non-existent product', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: '507f1f77bcf86cd799439011', quantity: 1 });

    expect(res.status).toBe(404);
  });

  it('rejects adding more than available stock', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 2 });

    const res = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 5 });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/cart/update/:productId', () => {
  it('updates item quantity', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    const res = await request(app)
      .put(`/api/cart/update/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 4 });

    expect(res.status).toBe(200);
    expect(res.body.data.items[0].quantity).toBe(4);
  });

  it('removes the item when quantity is set to 0', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    const res = await request(app)
      .put(`/api/cart/update/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 0 });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(0);
  });

  it('returns 404 when the item is not in the cart', async () => {
    const { token } = await createCustomer();
    const product = await createProduct();

    const res = await request(app)
      .put(`/api/cart/update/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/cart/remove/:productId', () => {
  it('removes an item from the cart', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });

    await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    const res = await request(app)
      .delete(`/api/cart/remove/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(0);
  });
});
