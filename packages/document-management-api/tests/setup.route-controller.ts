import { prismaMock } from './utils/mocks/prisma-mock';

/**
 * Mock the PrismaClient instance for testing
 *
 * This mock provides a deep mock of the PrismaClient instance
 * with all methods mocked to return appropriate values
 *
 * Used to control database interactions in tests
 */
jest.mock('@/shared/db/prisma', () => ({
  __esModule: true,
  default: prismaMock,
}));

// Mock the firebase auth module
jest.mock('@/shared/plugins/firebase', () => ({
  auth: {
    verifyIdToken: jest.fn(),
    getUser: jest.fn(),
  },
}));

// Mock the UserService class
jest.mock('@/features/user/user.service', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        getUserByFirebaseUid: jest.fn(),
        createUser: jest.fn(),
      };
    }),
  };
});

// Mock the logger
jest.mock('@/shared/utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
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

// Also mock the Elasticsearch synchronization
jest.mock('@/shared/middleware/es.middleware', () => ({
  syncWithElasticSearch: jest.fn().mockResolvedValue(undefined),
}));

export const mockFileType = (extension: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'csv') => {
  const fileTypeMap = {
    pdf: {
      id: 1,
      extension: 'pdf',
      mimeType: 'application/pdf',
    },
    docx: {
      id: 2,
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
    pptx: {
      id: 3,
      extension: 'pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    },
    xlsx: {
      id: 4,
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    csv: {
      id: 5,
      extension: 'csv',
      mimeType: 'text/csv',
    },
  };

  prismaMock.fileType.findUnique.mockResolvedValue(fileTypeMap[extension] || null);
};

// Reset all mocks
export const resetMocks = () => {
  jest.resetAllMocks();
};
