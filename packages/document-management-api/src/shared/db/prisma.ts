import { syncWithElasticSearch } from '@/shared/middleware/es.middleware';
import { SyncableModel, SyncableOperation } from '@/shared/types/elastic-search';
import logger from '@/shared/utils/logger';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma client instance
 *
 * This is the Prisma client instance that is used to connect to the database.
 * It is extended with a custom query method that times the query execution.
 * It also handles Elasticsearch synchronization for the Document and Folder models.
 */
const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

/**
 * Extended Prisma client instance
 *
 * This is the extended Prisma client instance that is used to connect to the database.
 * It is extended with a custom query method that times the query execution.
 * It also handles Elasticsearch synchronization for the Document and Folder models.
 */
const extendedPrisma = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        // Time the query execution
        const before = Date.now();
        const result = await query(args);
        const after = Date.now();

        logger.debug(`Prisma Query: ${after - before}ms`);

        // Handle Elasticsearch synchronization
        if (['Document', 'Folder'].includes(model)) {
          await syncWithElasticSearch({
            model: model as SyncableModel,
            operation: operation as SyncableOperation,
            args,
            result,
          });
        }

        return result;
      },
    },
  },
});

export default extendedPrisma;
