import request from 'supertest';
import app from '../app.js';
import Cart from '../models/Cart.js';
import { createCustomer, createAdmin, createProduct } from './helpers.js';

const addToCart = async (token, product, quantity = 1) =>
  request(app)
    .post('/api/cart/add')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId: product._id, quantity });

describe('POST /api/orders', () => {
  it('creates an order from the cart and clears the cart', async () => {
    const { customer, token } = await createCustomer();
    const product = await createProduct({ stock: 10, price: 1000 });
    await addToCart(token, product, 2);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        shippingAddress: {
          line1: '123 Main St',
          city: 'Dhaka',
          upazila: 'Mirpur',
          division: 'Dhaka',
          postalCode: '1200',
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.data.subtotal).toBe(2000);
    expect(res.body.data.total).toBe(2060);
    expect(res.body.data.status).toBe('pending');

    const cart = await Cart.findOne({ customerId: customer._id });
    expect(cart.items.length).toBe(0);
  });

  it('rejects order creation with an empty cart', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    expect(res.status).toBe(400);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.status).toBe(401);
  });
});

describe('POST /api/orders/:id/payment', () => {
  it('submits payment proof with a transaction id', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app)
      .post(`/api/orders/${orderRes.body.data._id}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ senderMobile: '01700000000', transactionId: 'TXN123' });

    expect(res.status).toBe(200);
    expect(res.body.data.paymentStatus).toBe('pending');
  });

  it('rejects payment submission without any proof', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app)
      .post(`/api/orders/${orderRes.body.data._id}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ senderMobile: '01700000000' });

    expect(res.status).toBe(400);
  });
});

describe('PUT /api/orders/:id/payment/confirm', () => {
  it('confirms payment as admin', async () => {
    const { token } = await createCustomer();
    const { token: adminToken } = await createAdmin();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    await request(app)
      .post(`/api/orders/${orderRes.body.data._id}/payment`)
      .set('Authorization', `Bearer ${token}`)
      .send({ senderMobile: '01700000000', transactionId: 'TXN123' });

    const res = await request(app)
      .put(`/api/orders/${orderRes.body.data._id}/payment/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.order.status).toBe('confirmed');
  });

  it('rejects confirmation when no payment proof was submitted', async () => {
    const { token } = await createCustomer();
    const { token: adminToken } = await createAdmin();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app)
      .put(`/api/orders/${orderRes.body.data._id}/payment/confirm`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/orders', () => {
  it("retrieves the customer's own orders", async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);
    await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('PUT /api/orders/:id/status', () => {
  it('updates order status to shipped as admin', async () => {
    const { token } = await createCustomer();
    const { token: adminToken } = await createAdmin();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app)
      .put(`/api/orders/${orderRes.body.data._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'shipped', parcelId: 'PARCEL-1' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('shipped');
    expect(res.body.data.parcelId).toBe('PARCEL-1');
  });

  it('rejects a customer token (admin only)', async () => {
    const { token } = await createCustomer();
    const product = await createProduct({ stock: 10 });
    await addToCart(token, product, 1);

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: { line1: 'x', city: 'x', upazila: 'x', division: 'x', postalCode: 'x' } });

    const res = await request(app)
      .put(`/api/orders/${orderRes.body.data._id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'shipped' });

    expect(res.status).toBe(403);
  });
});
