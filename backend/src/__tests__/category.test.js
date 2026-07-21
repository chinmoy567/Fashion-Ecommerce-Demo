import request from 'supertest';
import app from '../app.js';
import { createAdmin, createCategory } from './helpers.js';

describe('GET /api/categories', () => {
  it('lists all categories', async () => {
    await createCategory({ name: 'Men', slug: 'men' });
    await createCategory({ name: 'Women', slug: 'women' });

    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});

describe('POST /api/categories', () => {
  it('creates a category as super admin', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Shoes' });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Shoes');
  });

  it('rejects a manager token (super admin only)', async () => {
    const { token } = await createAdmin({ email: 'mgr@test.com', role: 'manager' });

    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Shoes' });

    expect(res.status).toBe(403);
  });

  it('rejects request without a token', async () => {
    const res = await request(app).post('/api/categories').send({ name: 'Shoes' });
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/categories/:id', () => {
  it('updates a category as super admin', async () => {
    const { token } = await createAdmin();
    const category = await createCategory({ name: 'Kids', slug: 'kids' });

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Kids wear' });

    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe('Kids wear');
  });

  it('returns 404 for a non-existent category', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .put('/api/categories/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'X' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('deletes a category as super admin', async () => {
    const { token } = await createAdmin();
    const category = await createCategory();

    const res = await request(app)
      .delete(`/api/categories/${category._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('returns 404 for a non-existent category', async () => {
    const { token } = await createAdmin();

    const res = await request(app)
      .delete('/api/categories/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
