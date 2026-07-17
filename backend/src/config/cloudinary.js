import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate Cloudinary configuration
export const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Cloudinary configuration incomplete. Missing: ${missing.join(', ')}`);
    return false;
  }

  return true;
};

// Test Cloudinary connection
export const testCloudinaryConnection = async () => {
  try {
    await cloudinary.api.resources({ max_results: 1, type: 'upload' });
    console.log('✅ Cloudinary service connected successfully');
    return true;
  } catch (error) {
    console.warn(`⚠️  Cloudinary service warning: ${error.message}`);
    return false;
  }
};

export default cloudinary;
