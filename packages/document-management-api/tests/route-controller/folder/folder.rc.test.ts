/**
 * Folder API Integration Tests
 *
 * Tests the HTTP endpoints for folder operations:
 * - Folder creation
 * - Folder updates
 *
 * Uses supertest to simulate HTTP requests and mocks Prisma for database interactions.
 */
import { HttpStatus } from '@/shared/types/http-status';
import { Express } from 'express';
import request from 'supertest';
import { resetMocks } from 'tests/setup.route-controller';
import { FolderDtoFactory } from 'tests/utils/factories/folder/folder-dto.factory';
import { FolderFactory } from 'tests/utils/factories/folder/folder.factory';
import { setupFolderTestApp } from 'tests/utils/helpers/folder.app.setup';
import { prismaMock } from 'tests/utils/mocks/prisma-mock';

describe('Folder API routes and controller', () => {
  let app: Express;

  // Reset mocks and create a fresh test app before each test
  beforeEach(() => {
    resetMocks();
    app = setupFolderTestApp();
  });

  /**
   * Folder creation test
   * Verifies that:
   * - The API accepts folder creation requests
   * - Returns a 201 Created status
   * - Returns the created folder with all expected fields
   */
  it('should create a folder', async () => {
    // Create test data using factories
    const createFolderDto = FolderDtoFactory.createCreateFolderDto();
    const createdFolder = FolderFactory.create(createFolderDto);

    // Mock the Prisma create operation
    prismaMock.folder.create.mockResolvedValue(createdFolder);

    // Send HTTP request to create folder endpoint
    const response = await request(app)
      .post('/api/folders')
      .send(createFolderDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    // Convert date strings to Date objects for comparison
    const responseBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };

    // Verify the response matches our expected folder
    expect(responseBody).toEqual(createdFolder);
  });

  /**
   * Folder update test
   * Verifies that:
   * - The API accepts folder update requests
   * - Returns a 200 OK status
   * - Returns the updated folder with all fields properly modified
   */
  it('should update a folder', async () => {
    // Create test data for folder update
    const updateFolderDto = FolderDtoFactory.createUpdateFolderDto();
    const updatedFolder = FolderFactory.create(updateFolderDto);

    // Mock the Prisma update operation
    prismaMock.folder.update.mockResolvedValue(updatedFolder);

    // Send HTTP request to update folder endpoint
    const response = await request(app)
      .patch(`/api/folders/${updatedFolder.id}`)
      .send(updateFolderDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);

    // Convert date strings to Date objects for comparison
    const responseBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };

    // Verify the response matches our expected updated folder
    expect(responseBody).toEqual(FolderFactory.create(updateFolderDto));
  });
});
