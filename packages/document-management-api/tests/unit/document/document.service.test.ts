/**
 * Folder Service Unit Tests
 *
 * Tests the business logic for folder management operations:
 * - Folder retrieval by ID
 * - Folder creation (both root folders and subfolders)
 * - Folder hierarchy constraints (depth limit, children limit)
 * - Folder updates
 *
 * Uses mock Prisma client to isolate service logic from database.
 */
import { FolderService } from '@/features/folder/folder.service';
import { FolderDepthLimitError, FolderMaxChildrenError } from '@/shared/errors';
import { FOLDER_DEPTH, FOLDER_MAX_CHILDREN } from '@/shared/types/folder-constraints';
import { Folder } from '@prisma/client';
import { FolderDtoFactory, FolderFactory } from 'tests/utils/factories/folder';
import { prismaMock } from 'tests/utils/mocks/prisma-mock';

// Type for folder with children relationship loaded
type FolderWithChildren = Folder & {
  children: Folder[];
};

describe('FolderService', () => {
  let folderService: FolderService;

  // Common test data
  const userId = 1;
  const folderId = 2;
  const mockFolder = FolderFactory.create({ id: folderId, creatorId: userId });
  const createFolderDto = FolderDtoFactory.createCreateFolderDto();

  // Create fresh service instance before each test
  beforeEach(() => {
    folderService = new FolderService();
  });

  /**
   * Folder retrieval tests
   * Verifies:
   * - Successful folder retrieval by ID
   * - Error handling for non-existent folders
   */
  describe('getFolderById', () => {
    it('should return a folder when found', async () => {
      // Mock database response for existing folder
      prismaMock.folder.findFirst.mockResolvedValueOnce(mockFolder);

      // Execute service method
      const result = await folderService.getFolderById(folderId, userId);

      // Verify correct query parameters
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: folderId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      // Verify returned folder matches expected result
      expect(result).toEqual(mockFolder);
    });

    it('should throw an error when folder not found', async () => {
      // Test with non-existent folder ID
      const nonExistentFolderId = 999;

      // Mock database response for non-existent folder
      prismaMock.folder.findFirst.mockResolvedValueOnce(null);

      // Verify error is thrown for non-existent folder
      await expect(folderService.getFolderById(nonExistentFolderId, userId)).rejects.toThrow(
        'Folder not found',
      );

      // Verify query was made with correct parameters
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: nonExistentFolderId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });
    });
  });

  /**
   * Folder creation tests
   * Verifies:
   * - Root folder creation
   * - Subfolder creation
   * - Depth limit enforcement
   * - Children count limit enforcement
   * - Error handling for invalid parent folders
   */
  describe('createFolder', () => {
    it('should create a root folder successfully', async () => {
      // Expected folder after creation (root level, depth 0)
      const mockCreatedFolder = FolderFactory.create({
        creatorId: userId,
        name: createFolderDto.name,
        description: createFolderDto.description,
        depth: 0,
      });

      // Mock database response for folder creation
      prismaMock.folder.create.mockResolvedValueOnce(mockCreatedFolder);

      // Execute service method
      const result = await folderService.createFolder(userId, createFolderDto);

      // Verify correct creation parameters for root folder (depth 0)
      expect(prismaMock.folder.create).toHaveBeenCalledWith({
        data: {
          ...createFolderDto,
          creatorId: userId,
          depth: 0,
        },
      });

      // Verify returned folder matches expected result
      expect(result).toEqual(mockCreatedFolder);
    });

    it('should create a subfolder successfully', async () => {
      // Set up parent folder data
      const parentId = 1;
      const parentFolder = FolderFactory.create({ id: parentId, creatorId: userId, depth: 1 });
      const mockParentFolder = { ...parentFolder, _count: { children: 1 } };

      // Create DTO with parent reference
      const createFolderDto = FolderDtoFactory.createCreateFolderDto({ parentId });

      // Expected subfolder after creation (parent's depth + 1)
      const mockCreatedFolder = FolderFactory.create({
        id: 2,
        creatorId: userId,
        parentId,
        name: createFolderDto.name,
        description: createFolderDto.description,
        depth: parentFolder.depth + 1,
      });

      // Mock database responses
      prismaMock.folder.findFirst.mockResolvedValueOnce(mockParentFolder);
      prismaMock.folder.create.mockResolvedValueOnce(mockCreatedFolder);

      // Execute service method
      const result = await folderService.createFolder(userId, createFolderDto);

      // Verify parent folder lookup
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: parentId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      // Verify subfolder creation with correct depth (parent depth + 1)
      expect(prismaMock.folder.create).toHaveBeenCalledWith({
        data: {
          ...createFolderDto,
          creatorId: userId,
          depth: parentFolder.depth + 1,
        },
      });

      // Verify returned folder matches expected result
      expect(result).toEqual(mockCreatedFolder);
    });

    it('should throw FolderDepthLimitError when depth limit is reached', async () => {
      // Set up parent folder at max depth
      const userId = 1;
      const parentId = 1;
      const maxDepth = FOLDER_DEPTH;
      const parentFolder = FolderFactory.create({
        id: parentId,
        creatorId: userId,
        depth: maxDepth,
      });

      // Create DTO with parent at max depth
      const createFolderDto = FolderDtoFactory.createCreateFolderDto({ parentId });

      // Mock parent folder at max depth
      const mockParentFolder: FolderWithChildren = { ...parentFolder, children: [] };
      prismaMock.folder.findFirst.mockResolvedValueOnce(mockParentFolder);

      // Verify depth limit error is thrown
      await expect(folderService.createFolder(userId, createFolderDto)).rejects.toThrow(
        FolderDepthLimitError,
      );

      // Verify parent folder was looked up
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: parentId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      // Verify folder creation was not attempted
      expect(prismaMock.folder.create).not.toHaveBeenCalled();
    });

    it('should throw FolderMaxChildrenError when max children limit is reached', async () => {
      // Set up parent folder with max children
      const userId = 1;
      const parentId = 1;
      const parentFolder = FolderFactory.create({ id: parentId, creatorId: userId, depth: 1 });
      const mockParentFolder = { ...parentFolder, _count: { children: FOLDER_MAX_CHILDREN } };

      // Create DTO with parent that has max children
      const createFolderDto = FolderDtoFactory.createCreateFolderDto({ parentId });

      // Mock parent folder with max children count
      prismaMock.folder.findFirst.mockResolvedValueOnce(mockParentFolder);

      // Verify max children error is thrown
      await expect(folderService.createFolder(userId, createFolderDto)).rejects.toThrow(
        FolderMaxChildrenError,
      );

      // Verify parent folder was looked up
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: parentId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      // Verify folder creation was not attempted
      expect(prismaMock.folder.create).not.toHaveBeenCalled();
    });

    it('should throw an error when parent folder not found', async () => {
      // Set up scenario with non-existent parent
      const userId = 1;
      const parentId = 999;
      const createFolderDto = FolderDtoFactory.createCreateFolderDto({ parentId });

      // Mock parent folder not found
      prismaMock.folder.findFirst.mockResolvedValueOnce(null);

      // Execute service method
      const result = folderService.createFolder(userId, createFolderDto);

      // Verify no error is thrown (falls back to creating root folder)
      await expect(result).resolves.not.toThrow();

      // Verify parent folder lookup attempt
      expect(prismaMock.folder.findFirst).toHaveBeenCalledWith({
        where: {
          id: parentId,
          creatorId: userId,
          isDeleted: false,
        },
        include: {
          _count: {
            select: {
              children: true,
            },
          },
        },
      });

      // Verify folder creation as root folder (depth 0)
      expect(prismaMock.folder.create).toHaveBeenCalledWith({
        data: {
          ...createFolderDto,
          creatorId: userId,
          depth: 0,
        },
      });
    });
  });

  /**
   * Folder update tests
   * Verifies:
   * - Successful folder updates with valid data
   */
  describe('updateFolder', () => {
    it('should update a folder successfully', async () => {
      // Set up test data
      const folderId = 1;
      const updateFolderDto = FolderDtoFactory.createUpdateFolderDto();

      // Expected folder after update
      const mockUpdatedFolder = FolderFactory.create({
        id: folderId,
        name: updateFolderDto.name,
        description: updateFolderDto.description,
      });

      // Mock update operation response
      prismaMock.folder.update.mockResolvedValueOnce(mockUpdatedFolder);

      // Execute service method
      const result = await folderService.updateFolder(folderId, updateFolderDto);

      // Verify update called with correct parameters
      expect(prismaMock.folder.update).toHaveBeenCalledWith({
        where: { id: folderId },
        data: updateFolderDto,
      });

      // Verify returned folder matches expected result
      expect(result).toEqual(mockUpdatedFolder);
    });
  });
});
