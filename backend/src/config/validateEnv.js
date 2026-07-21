const REQUIRED_VARS = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];

// Ensure required secrets/config are present before the server accepts traffic
export const validateEnv = () => {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('   See backend/.env.example for the full list.');
    process.exit(1);
  }
};
