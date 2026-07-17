import dotenv from 'dotenv';
import dns from 'dns';
import app from './app.js';
import { connectDB } from './config/database.js';
import { validateEmailConfig, testEmailConnection } from './config/email.js';
import { validateCloudinaryConfig, testCloudinaryConnection } from './config/cloudinary.js';

dotenv.config();

// Apply DNS override for MongoDB Atlas connection
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('✅ DNS Override: Using Google Public DNS (8.8.8.8, 8.8.4.4)\n');

const PORT = process.env.PORT || 5000;

// Initialize services
const initializeServices = async () => {
  console.log('\n📡 Initializing services...\n');

  // Database
  await connectDB();

  // Email Service
  if (validateEmailConfig()) {
    await testEmailConnection();
  } else {
    console.warn('⚠️  Email service not fully configured - OTP emails may not work');
  }

  // Cloudinary Service
  if (validateCloudinaryConfig()) {
    await testCloudinaryConnection();
  } else {
    console.warn('⚠️  Cloudinary not configured - file uploads may not work');
  }

  console.log('\n✅ Services initialization complete\n');
};

// Start server
const startServer = async () => {
  await initializeServices();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || 'Not configured'}`);
    console.log(`\n🔗 API: http://localhost:${PORT}`);
    console.log(`📺 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
