import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import AdminUser from '../src/models/AdminUser.js';

async function createAdmin() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI not set in .env');
    process.exit(1);
  }

  try {
    console.log('🔐 Creating Admin Account for chinmoy6667@gmail.com\n');

    // Connect with longer timeout
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
    });
    console.log('✅ Connected!\n');

    const adminEmail = 'chinmoy6667@gmail.com';
    const adminPassword = 'Admin@123456';

    // Check if exists
    let admin = await AdminUser.findOne({ email: adminEmail });
    if (admin) {
      console.log('✓ Admin account already exists:\n');
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.fullName}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Active: ${admin.isActive ? 'Yes' : 'No'}`);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    console.log('📝 Creating new admin account...\n');
    admin = new AdminUser({
      fullName: 'System Administrator',
      email: adminEmail,
      password: adminPassword,
      phone: '+8801700000000',
      role: 'super_admin',
      isActive: true,
    });

    await admin.save();

    console.log('✅ SUCCESS! Admin account created:\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:      ${adminEmail}`);
    console.log(`🔑 Password:   ${adminPassword}`);
    console.log(`👤 Role:       super_admin`);
    console.log(`✓  Status:     Active`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Login at: http://localhost:5173/staff-login\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure .env file has MONGODB_URI');
    console.error('2. Check your internet connection');
    console.error('3. Verify MongoDB Atlas IP whitelist includes your IP');
    console.error('4. Try running again - network issues are temporary\n');
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

createAdmin();
