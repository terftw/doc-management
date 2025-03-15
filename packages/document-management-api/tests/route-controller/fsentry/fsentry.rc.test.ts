/**
 * FSEntry API Integration Tests
 *
 * Tests the HTTP endpoints for file system entry operations:
 * - Retrieval of FSEntries with pagination and filtering
 *
 * Uses custom service mocking approach to control test data.
 */
import { FSEntryService } from '@/features/fsentry/fsentry.service';
import { FSEntry } from '@/shared/types/fsentry';
import { HttpStatus } from '@/shared/types/http-status';
import { Express } from 'express';
import { FSEntryQueryDTO } from 'src/features/fsentry/fsentry.schema';
import request from 'supertest';
import { resetMocks } from 'tests/setup.route-controller';
import { FSEntryDtoFactory } from 'tests/utils/factories/fsentry/fsentry-dto.factory';
import { FSEntryFactory } from 'tests/utils/factories/fsentry/fsentry.factory';
import { setupFSEntryTestApp } from 'tests/utils/helpers/fsentry.app.setup';

describe('FSEntry API routes and controller', () => {
  let app: Express;
  // Store original service method to restore after tests
  let originalGetFSEntries: (
    _id: number,
    _fsEntryQueryDTO: FSEntryQueryDTO,
    _folderId: number | null,
  ) => Promise<{
    data: FSEntry[];
    metadata: { currentPage: number; pageSize: number; totalCount: number; totalPages: number };
  }>;

  /**
   * Setup before each test:
   * - Reset all mocks
   * - Create a fresh test app
   * - Store original service implementation
   * - Mock the FSEntryService to return controlled test data
   */
  beforeEach(() => {
    resetMocks();
    app = setupFSEntryTestApp();

    // Save the original implementation before mocking
    originalGetFSEntries = FSEntryService.prototype.getFSEntries;

    // Create a more explicit mock that returns a Promise with the expected data
    FSEntryService.prototype.getFSEntries = jest.fn().mockImplementation(() => {
      const mockResponse = FSEntryFactory.createFSEntriesResponse();
      return Promise.resolve(mockResponse);
    });
  });

  /**
   * Cleanup after each test:
   * - Restore the original service implementation
   */
  afterEach(() => {
    FSEntryService.prototype.getFSEntries = originalGetFSEntries;
  });

  /**
   * FSEntry retrieval test
   * Verifies that:
   * - The API accepts FSEntry query requests
   * - Returns a 200 OK status
   * - Returns the expected paginated data structure
   * - Properly formats date fields in the response
   */
  it('should get all FSEntries associated to a user', async () => {
    // Create query parameters using factory
    const getFSEntriesDto = FSEntryDtoFactory.createFSEntryQueryDTO();

    // Send HTTP request to FSEntries endpoint with query parameters
    const response = await request(app)
      .get('/api/fsentries')
      .query(getFSEntriesDto)
      .set('Accept', 'application/json')
      .expect(HttpStatus.OK);

    // Generate expected response data
    const createdFSEntriesResponse = FSEntryFactory.createFSEntriesResponse();

    // Format dates as ISO strings to match API response format
    const expectedResponse = {
      data: createdFSEntriesResponse.data.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      })),
      metadata: createdFSEntriesResponse.metadata,
    };

    // Verify the service method was called
    expect(FSEntryService.prototype.getFSEntries).toHaveBeenCalled();

    // Verify response data structure and content
    expect(response.body).toEqual(expectedResponse);
  });
});
