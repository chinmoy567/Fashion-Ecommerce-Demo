import express from 'express';
import Customer from '../models/Customer.js';
import AdminUser from '../models/AdminUser.js';
import { generateOTP, OTP_VALIDITY } from '../utils/otp.js';
import { generateToken, generateRefreshToken } from '../utils/jwt.js';
import { verifyToken } from '../middlewares/auth.js';
import emailService from '../services/emailService.js';

const router = express.Router();

// Send an OTP email without letting delivery failures break the request
const sendOtpEmail = (email, otp, name) => {
  emailService.sendOTPEmail(email, otp, name).catch((error) => {
    console.error(`Failed to send OTP email to ${email}:`, error.message);
  });
};

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

  sendOtpEmail(email, otp, name);

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
    data: { verified: true, token, refreshToken, customer: customer.toJSON() },
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
    sendOtpEmail(email, otp, customer.name);
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

// POST /auth/forgot-password - Request a password reset OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const customer = await Customer.findOne({ email });

  // Always return success to avoid revealing whether an email is registered
  if (customer) {
    const otp = generateOTP();
    customer.otp = otp;
    customer.otpExpiry = new Date(Date.now() + OTP_VALIDITY * 60000);
    await customer.save();

    emailService.sendPasswordResetOTPEmail(email, otp, customer.name).catch((error) => {
      console.error(`Failed to send password reset email to ${email}:`, error.message);
    });
  }

  res.json({
    success: true,
    message: 'If an account exists for this email, a reset code has been sent.',
  });
});

// POST /auth/reset-password - Reset password using OTP
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const customer = await Customer.findOne({ email });
  if (!customer || !customer.otp || customer.otp !== otp || new Date() > customer.otpExpiry) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset code' });
  }

  customer.password = newPassword;
  customer.otp = null;
  customer.otpExpiry = null;
  await customer.save();

  res.json({ success: true, message: 'Password reset successfully. Please log in.' });
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
