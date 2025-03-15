/**
 * FSEntry Service Unit Tests
 *
 * Tests the service that provides a unified interface for managing
 * both documents and folders as file system entries (FSEntries).
 *
 * Key functionality tested:
 * - Retrieval of mixed document/folder listings
 * - Pagination of combined results
 * - Search functionality via Elasticsearch
 * - Proper type mapping between database entities and FSEntry type
 */
import { FSEntryService } from '@/features/fsentry/fsentry.service';
import * as elasticSearch from '@/shared/plugins/elastic-search';
import { documentToFSEntry, folderToFSEntry, isDocument, isFolder } from '@/shared/types/fsentry';
import { DocumentFactory } from 'tests/utils/factories/document';
import { FolderFactory } from 'tests/utils/factories/folder';
import { FSEntryDtoFactory, FSEntryFactory } from 'tests/utils/factories/fsentry';
import { prismaMock } from 'tests/utils/mocks/prisma-mock';

describe('FSEntryService', () => {
  let fsEntryService: FSEntryService;

  // Reset mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks();
    fsEntryService = new FSEntryService();
  });

  /**
   * Tests for the getFSEntries method
   *
   * This method provides a unified way to retrieve both folders and documents,
   * with support for pagination, filtering, and searching.
   */
  describe('getFSEntries', () => {
    /**
     * Test retrieval of root-level entries
     *
     * Verifies that:
     * - Both folders and documents at root level are retrieved
     * - The entries are properly combined into a single result set
     * - Pagination metadata is correctly calculated
     */
    it('should return paginated FS entries for root level', async () => {
      const userId = 1;
      const queryDto = FSEntryDtoFactory.createFSEntryQueryDTO();

      // Create test folders at root level (parentId = null)
      const folders = FolderFactory.createMany(3, {
        creatorId: userId,
        parentId: null,
      }).map(folder => folderToFSEntry({ ...folder, creator: { name: 'Test User' } }));

      // Create test documents at root level (folderId = null)
      const documents = DocumentFactory.createMany(2, {
        creatorId: userId,
        folderId: null,
        fileSize: 1024,
      }).map(document => documentToFSEntry({ ...document, creator: { name: 'Test User' } }));

      // Mock database responses
      prismaMock.folder.findMany.mockResolvedValueOnce(folders);
      prismaMock.document.findMany.mockResolvedValueOnce(documents);
      prismaMock.folder.count.mockResolvedValueOnce(3);
      prismaMock.document.count.mockResolvedValueOnce(2);

      // Execute service method
      const result = await fsEntryService.getFSEntries(userId, queryDto);

      // Verify folder query uses correct filters for root level (parentId = null)
      expect(prismaMock.folder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            creatorId: userId,
            parentId: null,
            isDeleted: false,
          },
          skip: 0,
          take: 3,
        }),
      );

      // Verify document query uses correct filters for root level (folderId = null)
      expect(prismaMock.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            creatorId: userId,
            folderId: null,
            isDeleted: false,
          },
          skip: 0,
          take: 2,
        }),
      );

      // Verify combined results and pagination metadata
      expect(result.data.length).toBe(5);
      expect(result.metadata).toEqual({
        currentPage: 1,
        pageSize: 10,
        totalCount: 5,
        totalPages: 1,
      });
    });

    /**
     * Test retrieval of folder contents
     *
     * Verifies that:
     * - Both subfolders and documents within a specific folder are retrieved
     * - The correct parentId/folderId filtering is applied
     * - Entries are properly combined into a single result set
     */
    it('should return paginated FS entries for a specific folder', async () => {
      const userId = 1;
      const folderId = 5; // The folder we're looking inside
      const queryDto = FSEntryDtoFactory.createFSEntryQueryDTO();

      // Create test subfolders (parentId = folderId)
      const folders = FolderFactory.createMany(2, {
        creatorId: userId,
        parentId: null, // This would actually be folderId in real data
      }).map(folder => folderToFSEntry({ ...folder, creator: { name: 'Test User' } }));

      // Create test documents in the folder (folderId = folderId)
      const documents = DocumentFactory.createMany(3, {
        creatorId: userId,
        folderId: null, // This would actually be folderId in real data
        fileSize: 1024,
      }).map(document => documentToFSEntry({ ...document, creator: { name: 'Test User' } }));

      // Mock database responses
      prismaMock.folder.findMany.mockResolvedValueOnce(folders);
      prismaMock.document.findMany.mockResolvedValueOnce(documents);
      prismaMock.folder.count.mockResolvedValueOnce(2);
      prismaMock.document.count.mockResolvedValueOnce(3);

      // Execute service method with specific folderId
      const result = await fsEntryService.getFSEntries(userId, queryDto, folderId);

      // Verify folder query uses correct parent folder filter
      expect(prismaMock.folder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            creatorId: userId,
            parentId: folderId,
            isDeleted: false,
          },
          skip: 0,
          take: 2,
        }),
      );

      // Verify document query uses correct folder filter
      expect(prismaMock.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            creatorId: userId,
            folderId: folderId,
            isDeleted: false,
          },
          skip: 0,
          take: 3,
        }),
      );

      // Verify combined results and pagination metadata
      expect(result.data.length).toBe(5);
      expect(result.metadata).toEqual({
        currentPage: 1,
        pageSize: 10,
        totalCount: 5,
        totalPages: 1,
      });
    });

    /**
     * Test search functionality
     *
     * Verifies that:
     * - Elasticsearch is used for searching across both documents and folders
     * - Search results are properly retrieved from database using IDs from search
     * - Results are correctly mapped to FSEntry type
     */
    it('should apply search filter correctly', async () => {
      const userId = 1;
      const searchQuery = 'test';
      const queryDto = FSEntryDtoFactory.createFSEntryQueryDTO({ searchQuery });

      // Create a test folder to be returned from database
      const folder = folderToFSEntry({
        ...FolderFactory.create({
          id: 1,
          creatorId: userId,
          parentId: null,
        }),
        creator: { name: 'Test User' },
      });

      // Create a test document to be returned from database
      const document = documentToFSEntry({
        ...DocumentFactory.create({
          id: 2,
          creatorId: userId,
          folderId: null,
          fileSize: 1024,
        }),
        creator: { name: 'Test User' },
      });

      // Mock Elasticsearch search response with IDs of matching items
      const mockedSearch = elasticSearch.search as jest.Mock;
      mockedSearch.mockResolvedValue({
        hits: [
          {
            _id: '1',
            _source: { id: 1, creatorId: userId, name: 'Test Folder 1' },
            _index: 'folders',
          },
          {
            _id: '2',
            _source: { id: 2, creatorId: userId, name: 'Test Document 1' },
            _index: 'documents',
          },
        ],
        total: { value: 2 },
      });

      // Mock database lookups for the items found in search
      prismaMock.folder.findUnique.mockResolvedValueOnce(folder);
      prismaMock.document.findUnique.mockResolvedValueOnce(document);

      // Execute service method with search query
      const result = await fsEntryService.getFSEntries(userId, queryDto);

      // Verify Elasticsearch search was called with correct parameters
      expect(mockedSearch).toHaveBeenCalledWith(
        searchQuery,
        expect.objectContaining({
          indices: ['documents', 'folders'],
          includeDeleted: false,
        }),
      );

      // Verify database lookups for found items
      expect(prismaMock.folder.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          creator: {
            select: {
              name: true,
            },
          },
        },
      });

      expect(prismaMock.document.findUnique).toHaveBeenCalledWith({
        where: { id: 2 },
        include: {
          creator: {
            select: {
              name: true,
            },
          },
        },
      });

      // Verify search results
      expect(result.data.length).toBe(2);
      expect(result.metadata.totalCount).toBe(2);
    });

    /**
     * Test pagination logic
     *
     * Verifies that:
     * - Pagination parameters are correctly applied to database queries
     * - Results are properly distributed across pages
     * - Skip/take calculations handle both folders and documents correctly
     */
    it('should handle pagination correctly', async () => {
      const userId = 1;
      const page = 2;
      const pageSize = 5;
      const queryDto = FSEntryDtoFactory.createFSEntryQueryDTO({ page, pageSize });

      // Create mock response with pagination
      const mockResponse = FSEntryFactory.createFSEntriesResponse({
        folderCount: 7,
        documentCount: 8,
        page,
        pageSize,
        creatorId: userId,
      });

      // Mock database responses
      prismaMock.folder.findMany.mockResolvedValueOnce(
        mockResponse.data.filter(entry => isFolder(entry)),
      );
      prismaMock.document.findMany.mockResolvedValueOnce(
        mockResponse.data.filter(entry => isDocument(entry)),
      );
      prismaMock.folder.count.mockResolvedValueOnce(7);
      prismaMock.document.count.mockResolvedValueOnce(8);

      // Execute service method with pagination parameters
      const result = await fsEntryService.getFSEntries(userId, queryDto);

      // Verify folder query has correct pagination (skip=5, take=2)
      // This means we're skipping the first 5 folders and taking 2
      expect(prismaMock.folder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 2,
        }),
      );

      // Verify document query has correct pagination (skip=0, take=3)
      // This means we're taking 3 documents from the beginning
      // These different skip/take values are because of the combined pagination algorithm
      expect(prismaMock.document.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 3,
        }),
      );

      // Verify pagination metadata
      expect(result.metadata).toEqual({
        currentPage: 2,
        pageSize: 5,
        totalCount: 15, // 7 folders + 8 documents
        totalPages: 3, // 15 items with 5 per page = 3 pages
      });
    });

    /**
     * Test entity mapping to FSEntry type
     *
     * Verifies that:
     * - Folder entities are correctly mapped to FSEntry with 'folder' type
     * - Document entities are correctly mapped to FSEntry with 'document' type
     * - All required fields are properly included in the mapped entries
     */
    it('should map folder and document entries to FSEntry type', async () => {
      const userId = 1;
      const queryDto = FSEntryDtoFactory.createFSEntryQueryDTO();

      // Create test folder entry
      const folder = folderToFSEntry({
        ...FolderFactory.create({
          creatorId: userId,
          parentId: null,
        }),
        creator: { name: 'Test User' },
      });

      // Create test document entry
      const document = documentToFSEntry({
        ...DocumentFactory.create({
          creatorId: userId,
          folderId: null,
          fileSize: 1024,
        }),
        creator: { name: 'Test User' },
      });

      // Mock database responses
      prismaMock.folder.findMany.mockResolvedValueOnce([folder]);
      prismaMock.document.findMany.mockResolvedValueOnce([document]);
      prismaMock.folder.count.mockResolvedValueOnce(1);
      prismaMock.document.count.mockResolvedValueOnce(1);

      // Execute service method
      const result = await fsEntryService.getFSEntries(userId, queryDto);

      // Verify total result count
      expect(result.data).toHaveLength(2);

      // Verify folder mapping
      const mappedFolder = result.data.find(entry => entry.entryType === 'folder');
      expect(mappedFolder).toEqual(
        expect.objectContaining({
          id: folder.id,
          name: folder.name,
          description: folder.description,
          entryType: 'folder',
          creator: folder.creator,
          createdAt: folder.createdAt,
        }),
      );

      // Verify document mapping
      const mappedDocument = result.data.find(entry => entry.entryType === 'document');
      expect(mappedDocument).toEqual(
        expect.objectContaining({
          id: document.id,
          name: document.name,
          description: document.description,
          entryType: 'document',
          creator: document.creator,
          createdAt: document.createdAt,
        }),
      );
    });
  });
});
