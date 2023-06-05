// @type {import('ts-jest/dist/types').InitialOptionsTsJest}
jest.mock('nanoid-esm', () => ({}))
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper:{
    '@/(.*)$': '<rootDir>/src/$1'
  },
  // testMatch: ["<rootDir>/tests/**/*.(spec|test).ts?(x)"],
  transform: {
      "^.+\\.js$": "babel-jest",
      "^.+\\.(ts|tsx)$": "ts-jest"
  },
  transformIgnorePatterns: ['node_modules/(?!(nanoid)/)']
};
