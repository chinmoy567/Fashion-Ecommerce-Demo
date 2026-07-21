import request from 'supertest';
import app from '../app.js';
import Product from '../models/Product.js';
import { createAdmin, createCustomer, createCategory, createProduct } from './helpers.js';

describe('GET /api/products/export/csv', () => {
  it('exports products as CSV with a header row', async () => {
    const { token } = await createAdmin();
    await createProduct({ name: 'Blue Shirt', sku: 'BLU-1', price: 500, stock: 10 });

    const res = await request(app).get('/api/products/export/csv').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/csv');
    expect(res.text.split('\r\n')[0]).toBe('sku,name,category,price,discountPrice,stock,material,sizes,colors,status');
    expect(res.text).toContain('BLU-1');
  });

  it('rejects a non-admin', async () => {
    const { token } = await createCustomer();
    const res = await request(app).get('/api/products/export/csv').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('POST /api/products/import/csv', () => {
  it('creates new products from a CSV upload', async () => {
    const { token } = await createAdmin();
    const category = await createCategory({ name: 'Men' });

    const csv = [
      'sku,name,category,price,discountPrice,stock,material,sizes,colors,status',
      `"NEW-1","New Shirt","Men","1000","","5","Cotton","S|M|L","Black|White","active"`,
    ].join('\r\n');

    const res = await request(app)
      .post('/api/products/import/csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from(csv), 'products.csv');

    expect(res.status).toBe(200);
    expect(res.body.data.created).toBe(1);
    expect(res.body.data.failed).toBe(0);

    const product = await Product.findOne({ sku: 'NEW-1' });
    expect(product.name).toBe('New Shirt');
    expect(product.categoryId.toString()).toBe(category._id.toString());
    expect(product.sizes).toEqual(['S', 'M', 'L']);
  });

  it('updates an existing product matched by SKU', async () => {
    const { token } = await createAdmin();
    const category = await createCategory({ name: 'Women' });
    await createProduct({ sku: 'EXIST-1', name: 'Old Name', price: 100, stock: 1, categoryId: category._id });

    const csv = [
      'sku,name,category,price,discountPrice,stock,material,sizes,colors,status',
      `"EXIST-1","Updated Name","Women","200","","20","","","","active"`,
    ].join('\r\n');

    const res = await request(app)
      .post('/api/products/import/csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from(csv), 'products.csv');

    expect(res.status).toBe(200);
    expect(res.body.data.updated).toBe(1);

    const product = await Product.findOne({ sku: 'EXIST-1' });
    expect(product.name).toBe('Updated Name');
    expect(product.stock).toBe(20);
  });

  it('reports per-row errors for unknown categories without failing the whole import', async () => {
    const { token } = await createAdmin();
    await createCategory({ name: 'Kids' });

    const csv = [
      'sku,name,category,price,discountPrice,stock,material,sizes,colors,status',
      `"OK-1","Valid Row","Kids","300","","5","","","","active"`,
      `"BAD-1","Bad Row","Nonexistent","300","","5","","","","active"`,
    ].join('\r\n');

    const res = await request(app)
      .post('/api/products/import/csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from(csv), 'products.csv');

    expect(res.status).toBe(200);
    expect(res.body.data.created).toBe(1);
    expect(res.body.data.failed).toBe(1);
    expect(res.body.data.errors[0].message).toContain('Unknown category');
  });

  it('rejects when no file is attached', async () => {
    const { token } = await createAdmin();
    const res = await request(app).post('/api/products/import/csv').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('rejects a non-admin', async () => {
    const { token } = await createCustomer();
    const res = await request(app)
      .post('/api/products/import/csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('sku,name\r\n'), 'products.csv');
    expect(res.status).toBe(403);
  });
});
