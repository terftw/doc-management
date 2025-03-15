// jest.config.ts
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    './__tests__/mocks',
    './__tests__/fixtures',
    './__tests__/test-utils.tsx',
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
    '^@/components/ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@/components/shared/(.*)$': '<rootDir>/src/components/shared/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!ky|formdata-polyfill|node-fetch|fetch-blob|data-uri-to-buffer|nanoid)',
  ],
};
export default createJestConfig(customJestConfig);
