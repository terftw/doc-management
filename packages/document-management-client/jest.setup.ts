// Import Jest DOM extensions
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Next.js app router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock ky
const mockKy = jest.fn() as jest.Mock & { create: jest.Mock };
mockKy.create = jest.fn();
jest.mock('ky', () => mockKy);

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'test-id',
}));

// Mock React Query
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: () => ({
    invalidateQueries: jest.fn(),
  }),
  useMutation: () => ({
    mutate: jest.fn(),
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Set testing timeouts if needed
jest.setTimeout(10000); // 10 seconds
