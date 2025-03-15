/**
 * Document API Integration Tests
 *
 * Tests the HTTP endpoints for document operations:
 * - Document creation
 * - Document updates
 * - Document deletion (soft delete)
 *
 * Uses supertest to simulate HTTP requests and mocks Prisma for database interactions.
 */
import { HttpStatus } from '@/shared/types/http-status';
import { Express } from 'express';
import request from 'supertest';
import { mockFileType, resetMocks } from 'tests/setup.route-controller';
import { DocumentDtoFactory } from 'tests/utils/factories/document/document-dto.factory';
import { DocumentFactory } from 'tests/utils/factories/document/document.factory';
import { setupDocumentTestApp } from 'tests/utils/helpers/document.app.setup';
import { prismaMock } from 'tests/utils/mocks/prisma-mock';

// Mock error handling to isolate API behavior
jest.mock('@/shared/errors');

describe('Document API routes and controller', () => {
  let app: Express;

  // Reset mocks and create a fresh test app before each test
  beforeEach(() => {
    resetMocks();
    app = setupDocumentTestApp();
  });

  /**
   * Document creation test
   * Verifies that:
   * - The API accepts document creation requests
   * - Returns a 201 Created status
   * - Returns the created document with all expected fields
   */
  it('should create a document', async () => {
    // Mock file type detection for PDF files
    mockFileType('pdf');

    // Create test data using factories
    const createDocumentDto = DocumentDtoFactory.createCreateDocumentDto();
    const createdDocument = DocumentFactory.create(createDocumentDto);

    // Mock the Prisma create operation
    prismaMock.document.create.mockResolvedValue(createdDocument);

    // Send HTTP request to create document endpoint
    const response = await request(app)
      .post('/api/documents')
      .send(createDocumentDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.CREATED);

    // Convert date strings to Date objects for comparison
    const responseBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };

    // Verify the response matches our expected document
    expect(responseBody).toEqual(createdDocument);
  });

  /**
   * Document update test
   * Verifies that:
   * - The API accepts document update requests
   * - Returns a 200 OK status
   * - Returns the updated document with all fields properly modified
   */
  it('should update a document', async () => {
    // Create test data for document update
    const updateDocumentDto = DocumentDtoFactory.createUpdateDocumentDto();
    const updatedDocument = DocumentFactory.create(updateDocumentDto);

    // Mock the Prisma update operation
    prismaMock.document.update.mockResolvedValue(updatedDocument);

    // Send HTTP request to update document endpoint
    const response = await request(app)
      .patch(`/api/documents/${updatedDocument.id}`)
      .send(updateDocumentDto)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(HttpStatus.OK);

    // Convert date strings to Date objects for comparison
    const responseBody = {
      ...response.body,
      createdAt: new Date(response.body.createdAt),
      updatedAt: new Date(response.body.updatedAt),
    };

    // Verify the response matches our expected updated document
    expect(responseBody).toEqual(DocumentFactory.create(updateDocumentDto));
  });

  /**
   * Document deletion test (soft delete)
   * Verifies that:
   * - The API accepts document deletion requests
   * - Returns a 204 No Content status
   * - Updates the document's isDeleted flag rather than removing it from the database
   */
  it('should delete a document', async () => {
    // Create test data for document before and after deletion
    const createdDocument = DocumentFactory.create({ isDeleted: false });
    const deletedDocument = DocumentFactory.create({
      ...createdDocument,
      isDeleted: true,
    });

    // Mock Prisma operations for finding and updating the document
    prismaMock.document.findFirst.mockResolvedValue(createdDocument);
    prismaMock.document.update.mockResolvedValue(deletedDocument);

    // Send HTTP request to delete document endpoint
    await request(app).delete(`/api/documents/${deletedDocument.id}`).expect(HttpStatus.NO_CONTENT);

    // Verify that Prisma was called with the correct soft delete parameters
    expect(prismaMock.document.update).toHaveBeenCalledWith({
      where: { id: deletedDocument.id },
      data: { isDeleted: true },
    });
  });
});
