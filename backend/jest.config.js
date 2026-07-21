export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/src/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testTimeout: 30000,
  forceExit: true,
};
