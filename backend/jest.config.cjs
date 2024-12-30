// backend/jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.mjs$': 'babel-jest',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  testMatch: ['**/test/**/*_test.mjs', '**/test/*.mjs'],
  testTimeout: 10000,
};
