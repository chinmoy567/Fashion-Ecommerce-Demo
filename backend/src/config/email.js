import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Validate email configuration
export const validateEmailConfig = () => {
  const required = ['SMTP_MAIL', 'SMTP_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Email configuration incomplete. Missing: ${missing.join(', ')}`);
    return false;
  }

  return true;
};

// Test email connection
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (error) {
    console.warn(`⚠️  Email service warning: ${error.message}`);
    return false;
  }
};

export default createTransporter;
