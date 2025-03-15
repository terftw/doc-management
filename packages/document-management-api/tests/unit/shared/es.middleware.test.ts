/**
 * Elasticsearch Middleware Tests
 *
 * Tests the middleware that synchronizes database operations with Elasticsearch.
 * This middleware acts as a hook into Prisma operations to ensure
 * that document and folder changes are reflected in the search index.
 */
// Import the actual middleware implementation
import { syncWithElasticSearch } from '@/shared/middleware/es.middleware';
import { indexDocument, indexFolder } from '@/shared/plugins/elastic-search';
import { SyncableModel, SyncableOperation } from '@/shared/types/elastic-search';
import logger from '@/shared/utils/logger';

// We unmock the middleware to test the actual implementation
jest.unmock('@/shared/middleware/es.middleware');

describe('Elasticsearch Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Tests document indexing on creation
   *
   * Verifies that when a document is created in the database,
   * it is properly indexed in Elasticsearch.
   */
  it('should index document on create operation', async () => {
    // Setup a context that simulates a document creation operation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'create' as SyncableOperation,
      args: { data: { name: 'Test Document' } },
      result: { id: 1, name: 'Test Document' },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document was indexed with the correct ID
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests folder indexing on creation
   *
   * Verifies that when a folder is created in the database,
   * it is properly indexed in Elasticsearch.
   */
  it('should index folder on create operation', async () => {
    // Setup a context that simulates a folder creation operation
    const context = {
      model: 'Folder' as SyncableModel,
      operation: 'create' as SyncableOperation,
      args: { data: { name: 'Test Folder' } },
      result: { id: 1, name: 'Test Folder' },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the folder was indexed with the correct ID
    expect(indexFolder).toHaveBeenCalledWith(1);
  });

  /**
   * Tests document indexing on update
   *
   * Verifies that when a document is updated in the database,
   * it is re-indexed in Elasticsearch to reflect the changes.
   */
  it('should index document on update operation', async () => {
    // Setup a context that simulates a document update operation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'update' as SyncableOperation,
      args: {
        where: { id: 1 },
        data: { name: 'Updated Document' },
      },
      result: { id: 1, name: 'Updated Document' },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document was re-indexed with the correct ID
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests document indexing on bulk updates
   *
   * Verifies that when multiple documents are updated at once,
   * the affected documents are re-indexed in Elasticsearch.
   */
  it('should index document on updateMany operation', async () => {
    // Setup a context that simulates a bulk update operation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'updateMany' as SyncableOperation,
      args: {
        where: { id: 1 },
        data: { name: 'Bulk Updated' },
      },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document was re-indexed with the correct ID
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests document indexing on soft delete
   *
   * Verifies that when a document is soft-deleted (isDeleted flag set to true),
   * it is re-indexed in Elasticsearch to reflect its deleted status.
   */
  it('should index document when soft deleted via update', async () => {
    // Setup a context that simulates a soft delete operation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'update' as SyncableOperation,
      args: {
        where: { id: 1 },
        data: { isDeleted: true },
      },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document was re-indexed with the correct ID
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests document indexing on hard delete
   *
   * Verifies that when a document is permanently deleted from the database,
   * it is also updated in Elasticsearch accordingly.
   */
  it('should index document on delete operation', async () => {
    // Setup a context that simulates a hard delete operation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'delete' as SyncableOperation,
      args: { where: { id: 1 } },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document was updated in Elasticsearch
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests handling of complex ID filters
   *
   * Verifies that the middleware can properly extract document IDs
   * from complex Prisma filter objects when used in where clauses.
   */
  it('should handle complex ID filters in where clause', async () => {
    // Setup a context with a complex ID filter in the where clause
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'update' as SyncableOperation,
      args: {
        where: { id: { equals: 1 } },
        data: { name: 'Filtered Update' },
      },
    };

    // Execute the middleware
    await syncWithElasticSearch(context);

    // Verify the document ID was correctly extracted and used for indexing
    expect(indexDocument).toHaveBeenCalledWith(1);
  });

  /**
   * Tests error handling
   *
   * Verifies that the middleware handles indexing errors gracefully
   * without throwing exceptions that would disrupt database operations.
   */
  it('should handle errors gracefully', async () => {
    // Mock the indexDocument function to throw an error
    (indexDocument as jest.Mock).mockRejectedValue(new Error('Indexing failed'));

    // Setup a context that simulates a document creation
    const context = {
      model: 'Document' as SyncableModel,
      operation: 'create' as SyncableOperation,
      args: { data: { name: 'Test Document' } },
      result: { id: 1, name: 'Test Document' },
    };

    // Execute the middleware (should not throw despite the indexing error)
    await syncWithElasticSearch(context);

    // Verify the error was logged but not thrown
    expect(logger.error).toHaveBeenCalled();
    expect((logger.error as jest.Mock).mock.calls[0][0]).toContain('Elasticsearch sync error');
  });
});
