import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AdminUser from '../src/models/AdminUser.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate secure random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const createManagerAccount = async () => {
  try {
    console.log('\n🔐 Creating Manager Account...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-store';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    const managerEmail = 'chinmoy7776@gmail.com';
    const existingManager = await AdminUser.findOne({ email: managerEmail });

    if (existingManager) {
      console.log(`\n✓ Manager account already exists: ${managerEmail}`);
      console.log(`  Role: ${existingManager.role}`);
      console.log(`  Status: ${existingManager.isActive ? 'Active' : 'Inactive'}`);
      await mongoose.connection.close();
      return;
    }

    const tempPassword = generatePassword();

    const managerUser = new AdminUser({
      fullName: 'Manager Account',
      email: managerEmail,
      phone: '+8801700000001',
      password: tempPassword,
      role: 'manager',
      isActive: true,
    });

    await managerUser.save();

    console.log('\n✅ Manager account created successfully!\n');
    console.log('📧 Email: ' + managerEmail);
    console.log('🔑 Temporary Password: ' + tempPassword);
    console.log('\n⚠️  Please save the password above — it will be needed for first login.');
    console.log('⚠️  Change the password immediately after first login for security.\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('\n❌ Error creating manager account:', error.message);
    process.exit(1);
  }
};

createManagerAccount();
