import { indexDocument, indexFolder } from '@/shared/plugins/elastic-search';
import { SyncContext, SyncableModel } from '@/shared/types/elastic-search';
import logger from '@/shared/utils/logger';
import { Prisma } from '@prisma/client';

/**
 * Prisma args
 *
 * This is the type of the args object for the Prisma client.
 */
interface PrismaArgs {
  where?: { id?: number | Prisma.IntFilter };
  data?: { isDeleted?: boolean };
}

/**
 * Synchronizes data between Prisma and ElasticSearch
 *
 * This function synchronizes data between Prisma and ElasticSearch.
 * It handles the creation, update, and deletion of documents and folders.
 */
export const syncWithElasticSearch = async <T extends SyncableModel>({
  model,
  operation,
  args,
  result,
}: SyncContext<T>): Promise<void> => {
  try {
    const prismaArgs = args as PrismaArgs;

    // Handle create operations
    if (
      operation === 'create' &&
      result &&
      typeof result === 'object' &&
      'id' in result &&
      typeof result.id === 'number'
    ) {
      if (model === 'Document') {
        await indexDocument(result.id);
      } else if (model === 'Folder') {
        await indexFolder(result.id);
      }
    }

    // Handle update operations
    if ((operation === 'update' || operation === 'updateMany') && prismaArgs?.where?.id) {
      const whereId = prismaArgs.where.id as number | Prisma.IntFilter;

      const id = typeof whereId === 'number' ? whereId : whereId.equals;
      if (model === 'Document' && typeof id === 'number') {
        await indexDocument(id);
      } else if (model === 'Folder' && typeof id === 'number') {
        await indexFolder(id);
      }
    }

    // Handle soft delete (setting isDeleted to true)
    if (
      (operation === 'delete' ||
        (operation === 'update' && prismaArgs?.data?.isDeleted === true)) &&
      prismaArgs?.where?.id
    ) {
      const whereId = prismaArgs.where.id as number | Prisma.IntFilter;
      const id = typeof whereId === 'number' ? whereId : whereId.equals;
      if (model === 'Document' && typeof id === 'number') {
        await indexDocument(id);
      } else if (model === 'Folder' && typeof id === 'number') {
        await indexFolder(id);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Elasticsearch sync error: ${errorMessage}`, {
      error: errorMessage,
      model,
      operation,
      args,
    });
  }
};
