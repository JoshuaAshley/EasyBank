// jest.config.cjs
module.exports = {
  transform: {
    '^.+\\.mjs$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'mjs'],
  testEnvironment: 'node',
};
