import type { Config } from '@jest/types';
import fs from 'fs';
import path from 'path';

// Create empty setup files if they don't exist
const ensureFileExists = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, '// Auto-generated empty setup file\n');
  }
};

// Ensure setup files exist
ensureFileExists(path.resolve(__dirname, 'tests/setup.ts'));
ensureFileExists(path.resolve(__dirname, 'tests/setup.route-controller.ts'));

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,

  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/tests/unit/**/*.test.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '^tests/(.*)$': '<rootDir>/tests/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    },
    {
      displayName: 'route-controller',
      testMatch: ['**/tests/route-controller/**/*.test.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/'],
      transform: {
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '^tests/(.*)$': '<rootDir>/tests/$1',
        '^@/(.*)$': '<rootDir>/src/$1',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/setup.route-controller.ts'],
    },
  ],
  collectCoverage: process.env.COLLECT_COVERAGE === 'true',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],
  coverageDirectory: 'coverage',
};

export default config;
