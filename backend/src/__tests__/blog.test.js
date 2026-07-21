import request from 'supertest';
import app from '../app.js';
import BlogPost from '../models/BlogPost.js';
import { createAdmin, createCustomer } from './helpers.js';

describe('GET /api/blog', () => {
  it('lists only published posts, excluding content', async () => {
    const { adminUser } = await createAdmin();
    await BlogPost.create({
      title: 'Published Post',
      slug: 'published-post',
      content: 'Full content',
      status: 'published',
      author: adminUser._id,
      publishedAt: new Date(),
    });
    await BlogPost.create({
      title: 'Draft Post',
      slug: 'draft-post',
      content: 'Draft content',
      status: 'draft',
      author: adminUser._id,
    });

    const res = await request(app).get('/api/blog');

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
    expect(res.body.data.items[0].content).toBeUndefined();
  });

  it('filters by category', async () => {
    const { adminUser } = await createAdmin();
    await BlogPost.create({
      title: 'Fashion Tips',
      slug: 'fashion-tips',
      content: 'x',
      category: 'fashion',
      status: 'published',
      author: adminUser._id,
      publishedAt: new Date(),
    });
    await BlogPost.create({
      title: 'Company News',
      slug: 'company-news',
      content: 'x',
      category: 'news',
      status: 'published',
      author: adminUser._id,
      publishedAt: new Date(),
    });

    const res = await request(app).get('/api/blog').query({ category: 'fashion' });

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });
});

describe('GET /api/blog/admin/all', () => {
  it('lists all posts including drafts for super admin', async () => {
    const { token, adminUser } = await createAdmin({ role: 'super_admin' });
    await BlogPost.create({ title: 'Draft', slug: 'draft', content: 'x', author: adminUser._id });

    const res = await request(app).get('/api/blog/admin/all').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBe(1);
  });

  it('rejects a manager token (super admin only)', async () => {
    const { token } = await createAdmin({ email: 'mgr@test.com', role: 'manager' });

    const res = await request(app).get('/api/blog/admin/all').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('GET /api/blog/slug/:slug', () => {
  it('returns a published post by slug', async () => {
    const { adminUser } = await createAdmin();
    await BlogPost.create({
      title: 'My Post',
      slug: 'my-post',
      content: 'Body',
      status: 'published',
      author: adminUser._id,
      publishedAt: new Date(),
    });

    const res = await request(app).get('/api/blog/slug/my-post');

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe('My Post');
  });

  it('returns 404 for a draft post accessed by slug', async () => {
    const { adminUser } = await createAdmin();
    await BlogPost.create({ title: 'Draft', slug: 'draft-slug', content: 'x', author: adminUser._id });

    const res = await request(app).get('/api/blog/slug/draft-slug');

    expect(res.status).toBe(404);
  });
});

describe('POST /api/blog', () => {
  it('creates a draft post and generates a slug', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Hello World!', content: 'Content here' });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('hello-world');
    expect(res.body.data.status).toBe('draft');
  });

  it('creates a published post with publishedAt set', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Published Now', content: 'Content', status: 'published' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('published');
    expect(res.body.data.publishedAt).toBeTruthy();
  });

  it('deduplicates slugs for identical titles', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Same Title', content: 'First' });

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Same Title', content: 'Second' });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('same-title-2');
  });

  it('rejects missing required fields', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No Content' });

    expect(res.status).toBe(400);
  });

  it('rejects a manager token (super admin only)', async () => {
    const { token } = await createAdmin({ email: 'mgr2@test.com', role: 'manager' });

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X', content: 'Y' });

    expect(res.status).toBe(403);
  });

  it('rejects a customer token', async () => {
    const { token } = await createCustomer();

    const res = await request(app)
      .post('/api/blog')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X', content: 'Y' });

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/blog/:id', () => {
  it('updates a post and regenerates the slug on title change', async () => {
    const { token, adminUser } = await createAdmin({ role: 'super_admin' });
    const post = await BlogPost.create({ title: 'Old Title', slug: 'old-title', content: 'x', author: adminUser._id });

    const res = await request(app)
      .put(`/api/blog/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Title' });

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('new-title');
  });

  it('sets publishedAt when transitioning to published', async () => {
    const { token, adminUser } = await createAdmin({ role: 'super_admin' });
    const post = await BlogPost.create({ title: 'Draft', slug: 'draft-2', content: 'x', author: adminUser._id });

    const res = await request(app)
      .put(`/api/blog/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'published' });

    expect(res.status).toBe(200);
    expect(res.body.data.publishedAt).toBeTruthy();
  });

  it('returns 404 for a non-existent post', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .put('/api/blog/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'X' });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/blog/:id', () => {
  it('deletes a post as super admin', async () => {
    const { token, adminUser } = await createAdmin({ role: 'super_admin' });
    const post = await BlogPost.create({ title: 'To Delete', slug: 'to-delete', content: 'x', author: adminUser._id });

    const res = await request(app).delete(`/api/blog/${post._id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('returns 404 for a non-existent post', async () => {
    const { token } = await createAdmin({ role: 'super_admin' });

    const res = await request(app)
      .delete('/api/blog/507f1f77bcf86cd799439011')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
