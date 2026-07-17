import express from 'express';
import Customer from '../models/Customer.js';
import AdminUser from '../models/AdminUser.js';
import { generateOTP, OTP_VALIDITY } from '../utils/otp.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /auth/register - Register new customer
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_VALIDITY * 60000);

  const customer = new Customer({
    name,
    email,
    phone,
    password,
    otp,
    otpExpiry,
  });

  await customer.save();

  // TODO: Send OTP email via Nodemailer
  console.log(`OTP for ${email}: ${otp}`);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: { customerId: customer._id, email: customer.email },
  });
});

// POST /auth/verify-email - Verify customer email with OTP
router.post('/verify-email', async (req, res) => {
  const { email, otp } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  if (customer.otp !== otp || new Date() > customer.otpExpiry) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  customer.emailVerified = true;
  customer.emailVerifiedAt = new Date();
  customer.otp = null;
  customer.otpExpiry = null;
  await customer.save();

  const token = generateToken(customer._id, 'customer');
  const refreshToken = generateRefreshToken(customer._id);

  res.json({
    success: true,
    message: 'Email verified successfully',
    data: { verified: true, token, refreshToken },
  });
});

// POST /auth/login - Customer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isPasswordValid = await customer.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!customer.emailVerified) {
    const otp = generateOTP();
    customer.otp = otp;
    customer.otpExpiry = new Date(Date.now() + OTP_VALIDITY * 60000);
    await customer.save();
    console.log(`OTP for ${email}: ${otp}`);
    return res.json({
      success: true,
      message: 'Email verification required. OTP sent.',
      data: { requiresVerification: true },
    });
  }

  customer.lastLogin = new Date();
  await customer.save();

  const token = generateToken(customer._id, 'customer');
  const refreshToken = generateRefreshToken(customer._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: { token, refreshToken, customer: customer.toJSON() },
  });
});

// POST /auth/refresh - Refresh JWT token
router.post('/refresh', verifyToken, async (req, res) => {
  const token = generateToken(req.user.userId, req.user.role);
  res.json({ success: true, message: 'Token refreshed', data: { token } });
});

// POST /auth/logout - Logout (optional, token invalidation handled client-side)
router.post('/logout', verifyToken, (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// POST /auth/staff-login - Staff (admin/manager) login
router.post('/staff-login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const adminUser = await AdminUser.findOne({ email });
  if (!adminUser) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!adminUser.isActive) {
    return res.status(403).json({ success: false, message: 'Account is inactive' });
  }

  const isPasswordValid = await adminUser.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  adminUser.lastLogin = new Date();
  await adminUser.save();

  const token = generateToken(adminUser._id, adminUser.role);
  const refreshToken = generateRefreshToken(adminUser._id);

  res.json({
    success: true,
    message: 'Staff login successful',
    data: { token, refreshToken, adminUser: adminUser.toJSON() },
  });
});

export default router;
