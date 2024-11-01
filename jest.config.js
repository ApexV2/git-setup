module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    verbose: true,
    // Ignore build artifacts and node_modules
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
}; 