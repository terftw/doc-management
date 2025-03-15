import extendedPrisma from '@/shared/db/prisma';
import { search } from '@/shared/plugins/elastic-search';
import { SearchHit, SearchResponse } from '@/shared/types/elastic-search';
import {
  FSEntry,
  PaginatedFSEntriesResult,
  documentToFSEntry,
  folderToFSEntry,
} from '@/shared/types/fsentry';
import { folderFirstPagination } from '@/shared/utils/folder-first-pagination';
import { Prisma } from '@prisma/client';

import { FSEntryQueryDTO } from './fsentry.schema';

/**
 * FSEntryService
 *
 * This service is responsible for fetching file system entries from the database
 * and searching for them using Elasticsearch.
 *
 * This service handles the file system entry-related operations:
 * - Get all file system entries
 * - Search for file system entries
 */
export class FSEntryService {
  private prisma = extendedPrisma;

  /**
   * Get all file system entries
   *
   * When a search query is provided, the function will use Elasticsearch to search for the file system entries.
   * Otherwise, the function will fetch the file system entries from the database.
   *
   * @param userId - The user ID
   * @param query - The query parameters
   * @param folderId - The folder ID
   * @returns {Promise<PaginatedFSEntriesResult>} The file system entries
   */
  async getFSEntries(
    userId: number,
    query: FSEntryQueryDTO,
    folderId: number | null = null,
  ): Promise<PaginatedFSEntriesResult> {
    const { page = 1, pageSize = 10, searchQuery } = query;

    // If search query exists, use Elasticsearch
    if (searchQuery && searchQuery.trim()) {
      return this.searchFSEntries(userId, searchQuery, page, pageSize, folderId);
    }

    const skip = (page - 1) * pageSize;
    // This is the default order by clause for the file system entries
    // @TODO: Make this configurable
    const orderBy = { ['createdAt']: 'desc' as Prisma.SortOrder };

    const folderWhereClause: Prisma.FolderWhereInput = {
      creatorId: userId,
      isDeleted: false,
      parentId: folderId,
    };

    const documentWhereClause: Prisma.DocumentWhereInput = {
      creatorId: userId,
      isDeleted: false,
      folderId,
    };

    const [folderCount, documentCount] = await Promise.all([
      this.prisma.folder.count({ where: folderWhereClause }),
      this.prisma.document.count({ where: documentWhereClause }),
    ]);

    const totalCount = folderCount + documentCount;
    const totalPages = Math.ceil(totalCount / pageSize);

    // This is the pagination for the file system entries
    const { folderSkip, folderLimit, documentSkip, documentLimit } = folderFirstPagination(
      skip,
      folderCount,
      documentCount,
      pageSize,
    );

    const [folders, documents] = await Promise.all([
      folderLimit > 0
        ? this.prisma.folder.findMany({
            where: folderWhereClause,
            orderBy,
            skip: folderSkip,
            take: folderLimit,
            include: {
              creator: {
                select: {
                  name: true,
                },
              },
            },
          })
        : Promise.resolve([]),

      documentLimit > 0
        ? this.prisma.document.findMany({
            where: documentWhereClause,
            orderBy,
            skip: documentSkip,
            take: documentLimit,
            include: {
              creator: {
                select: {
                  name: true,
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    // This is the transformation of the file system entries to the FSEntry type
    const foldersWithType = folders.map(folder => folderToFSEntry(folder));
    const documentsWithType = documents.map(document => documentToFSEntry(document));

    const fsentries = [...foldersWithType, ...documentsWithType] as FSEntry[];

    return {
      data: fsentries,
      metadata: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * Search for file system entries using Elasticsearch
   *
   * @param userId - The user ID
   * @param searchQuery - The search query
   * @param page - The page number
   * @param pageSize - The page size
   * @param folderId - The folder ID
   * @returns {Promise<PaginatedFSEntriesResult>} The file system entries from Elasticsearch
   */
  private async searchFSEntries(
    userId: number,
    searchQuery: string,
    page: number = 1,
    pageSize: number = 10,
    folderId: number | null = null,
  ): Promise<PaginatedFSEntriesResult> {
    const from = (page - 1) * pageSize;

    // This is the search for the file system entries using Elasticsearch
    const searchResults = (await search(searchQuery, {
      indices: ['documents', 'folders'],
      from,
      size: pageSize,
      includeDeleted: false,
    })) as SearchResponse;

    const totalCount =
      typeof searchResults.total === 'number'
        ? searchResults.total
        : searchResults.total?.value || 0;

    const totalPages = Math.ceil(totalCount / pageSize);

    const fsEntries = await Promise.all(
      searchResults.hits.map(async (hit: SearchHit) => {
        const source = hit._source;
        const id = source.id;

        // We only want to return the file system entries that belong to the user
        if (source.creatorId !== userId) {
          return null;
        }

        if (
          folderId !== null &&
          ((hit._index === 'documents' && source.folderId !== folderId) ||
            (hit._index === 'folders' && source.parentId !== folderId))
        ) {
          return null;
        }

        if (hit._index === 'documents') {
          const document = await this.prisma.document.findUnique({
            where: { id },
            include: {
              creator: {
                select: {
                  name: true,
                },
              },
            },
          });

          if (!document) return null;

          return documentToFSEntry(document);
        } else {
          const folder = await this.prisma.folder.findUnique({
            where: { id },
            include: {
              creator: {
                select: {
                  name: true,
                },
              },
            },
          });

          if (!folder) return null;

          return folderToFSEntry(folder);
        }
      }),
    );

    const filteredEntries = fsEntries.filter(Boolean) as FSEntry[];

    return {
      data: filteredEntries,
      metadata: {
        currentPage: page,
        pageSize,
        totalCount, // Using the total from Elasticsearch
        totalPages,
      },
    };
  }
}
