module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'], // Adjust this to match your project structure
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text', 'html'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
