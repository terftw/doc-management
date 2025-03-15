import { DocumentEntry, FSEntry, FolderEntry } from '@/shared/types/fsentry';
import { DocumentFactory } from 'tests/utils/factories/document';
import { FolderFactory } from 'tests/utils/factories/folder';

type PartialFolderEntry = Partial<FolderEntry>;
type PartialDocumentEntry = Partial<DocumentEntry>;

/**
 * Factory for creating FSEntry test data (union of Document and Folder)
 */
export class FSEntryFactory {
  /**
   * Create a folder-type FS entry
   * @param overrides - Properties to override default values
   */
  static folder(overrides: PartialFolderEntry = {}): FolderEntry {
    const creatorName = overrides.creator?.name ?? 'Test User';

    const folder = FolderFactory.create({
      ...overrides,
    });

    return {
      ...folder,
      entryType: 'folder',
      creator: {
        name: creatorName,
      },
      parentId: overrides.parentId ?? null,
    };
  }

  /**
   * Create a document-type FS entry
   * @param overrides - Properties to override default values
   */
  static document(overrides: PartialDocumentEntry = {}): DocumentEntry {
    const creatorName = overrides.creator?.name ?? 'Test User';

    const document = DocumentFactory.create({
      ...overrides,
    });

    return {
      ...document,
      entryType: 'document',
      creator: {
        name: creatorName,
      },
      folderId: overrides.folderId ?? null,
    };
  }

  /**
   * Create multiple FS entries of mixed types
   * @param options - Configuration for the mix of entries to create
   */
  static createMixed({
    folderCount = 3,
    documentCount = 5,
    folderBaseOverrides = {},
    documentBaseOverrides = {},
    folderId = null,
  } = {}): FSEntry[] {
    const folders = Array.from({ length: folderCount }, (_, index) => {
      return FSEntryFactory.folder({
        id: index + 1,
        ...folderBaseOverrides,
        parentId: folderId,
      });
    });

    const documents = Array.from({ length: documentCount }, (_, index) => {
      return FSEntryFactory.document({
        id: folderCount + index + 1,
        ...documentBaseOverrides,
        folderId,
      });
    });

    return [...folders, ...documents];
  }

  /**
   * Create a paginated result of FS entries
   * @param entries - The entries to paginate
   * @param page - Current page number
   * @param pageSize - Number of items per page
   */
  static createPaginatedResult(entries: FSEntry[], page: number = 1, pageSize: number = 10) {
    const totalCount = entries.length;
    const totalPages = Math.ceil(totalCount / pageSize);

    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, totalCount);
    const paginatedEntries = entries.slice(start, end);

    return {
      data: paginatedEntries,
      metadata: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * Create a complete paginated FS entries response
   * @param options - Configuration for the entries and pagination
   */
  static createFSEntriesResponse({
    folderCount = 3,
    documentCount = 5,
    page = 1,
    pageSize = 10,
    parentFolderId = null,
    creatorId = 1,
  } = {}) {
    // Create entries
    const entries = FSEntryFactory.createMixed({
      folderCount,
      documentCount,
      folderBaseOverrides: {
        parentId: parentFolderId,
        creatorId,
      },
      documentBaseOverrides: {
        folderId: parentFolderId,
        creatorId,
      },
    });

    // Sort entries based on sortBy and sortOrder
    const sortedEntries = [...entries].sort((a, b) => {
      const valueA = a.createdAt;
      const valueB = b.createdAt;
      return valueB.getTime() - valueA.getTime();
    });

    return FSEntryFactory.createPaginatedResult(sortedEntries, page, pageSize);
  }
}
