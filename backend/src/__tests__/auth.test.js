import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import Customer from '../models/Customer.js';
import emailService from '../services/emailService.js';
import { createCustomer, createAdmin } from './helpers.js';

describe('POST /api/auth/register', () => {
  let sendOtpSpy;

  beforeEach(() => {
    sendOtpSpy = jest.spyOn(emailService, 'sendOTPEmail').mockResolvedValue(true);
  });

  afterEach(() => {
    sendOtpSpy.mockRestore();
  });

  it('registers a new customer and issues an OTP', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@test.com',
      phone: '01711111111',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('jane@test.com');

    const stored = await Customer.findOne({ email: 'jane@test.com' });
    expect(stored.emailVerified).toBe(false);
    expect(stored.otp).toBeTruthy();

    expect(sendOtpSpy).toHaveBeenCalledWith('jane@test.com', stored.otp, 'Jane Doe');
  });

  it('rejects duplicate email registration', async () => {
    await createCustomer({ email: 'dup@test.com' });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Dup',
      email: 'dup@test.com',
      phone: '01711111112',
      password: 'Password123!',
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'x@test.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/verify-email', () => {
  it('verifies a customer with a correct OTP and issues tokens', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      name: 'Verify Me',
      email: 'verify@test.com',
      phone: '01711111113',
      password: 'Password123!',
    });
    expect(reg.status).toBe(201);

    const customer = await Customer.findOne({ email: 'verify@test.com' });
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: 'verify@test.com', otp: customer.otp });

    expect(res.status).toBe(200);
    expect(res.body.data.verified).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });

  it('rejects an incorrect OTP', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Verify Me',
      email: 'verify2@test.com',
      phone: '01711111114',
      password: 'Password123!',
    });

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ email: 'verify2@test.com', otp: '000000' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  let sendOtpSpy;

  beforeEach(() => {
    sendOtpSpy = jest.spyOn(emailService, 'sendOTPEmail').mockResolvedValue(true);
  });

  afterEach(() => {
    sendOtpSpy.mockRestore();
  });

  it('logs in a verified customer', async () => {
    await createCustomer({ email: 'login@test.com' });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@test.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.customer.email).toBe('login@test.com');
  });

  it('requires re-verification via OTP for an unverified customer', async () => {
    const { customer } = await createCustomer({ email: 'unverified@test.com', emailVerified: false });

    const res = await request(app).post('/api/auth/login').send({
      email: 'unverified@test.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.requiresVerification).toBe(true);
    expect(sendOtpSpy).toHaveBeenCalledWith('unverified@test.com', expect.any(String), customer.name);
  });

  it('rejects invalid credentials', async () => {
    await createCustomer({ email: 'wrongpass@test.com' });

    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@test.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/staff-login', () => {
  it('logs in an active admin user', async () => {
    await createAdmin({ email: 'staff@test.com', role: 'manager' });

    const res = await request(app).post('/api/auth/staff-login').send({
      email: 'staff@test.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.adminUser.role).toBe('manager');
  });

  it('rejects an inactive admin account', async () => {
    await createAdmin({ email: 'inactive@test.com', isActive: false });

    const res = await request(app).post('/api/auth/staff-login').send({
      email: 'inactive@test.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(403);
  });
});
