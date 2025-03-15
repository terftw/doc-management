import { mockReset } from 'jest-mock-extended';

import { prismaMock } from './utils/mocks/prisma-mock';

// Create a mock module for Prisma
jest.mock('@/shared/db/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

// Mock Elasticsearch services
jest.mock('@/shared/plugins/elastic-search', () => ({
  __esModule: true,
  client: {
    search: jest.fn(),
    index: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    ping: jest.fn().mockResolvedValue({ statusCode: 200 }),
    indices: {
      exists: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      refresh: jest.fn(),
    },
  },
  indexDocument: jest.fn(),
  indexFolder: jest.fn(),
  search: jest.fn(),
}));

// Mock logger
jest.mock('@/shared/utils/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

// Mock ES middleware
jest.mock('@/shared/middleware/es.middleware', () => ({
  syncWithElasticSearch: jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});
