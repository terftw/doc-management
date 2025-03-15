import prisma from '@/shared/db/prisma';
import ecsFormat from '@elastic/ecs-winston-format';
import { Client } from '@elastic/elasticsearch';
import 'dotenv/config';
import winston from 'winston';

//Singleton client instance
const client = new Client({
  node: process.env.ELASTICSEARCH_HOST,
});

//Elasticsearch logger using ECS format
const elasticSearchLogger = winston.createLogger({
  level: 'info',
  format: ecsFormat({
    convertReqRes: true,
    apmIntegration: false,
    serviceName: 'document-management-api',
  }),
  defaultMeta: { service: 'elasticsearch-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'service'] }),
        winston.format.printf(info => {
          const metadata =
            info.metadata && Object.keys(info.metadata).length > 0
              ? JSON.stringify(info.metadata)
              : '';
          return `${info.timestamp} ['${info.service}'] ${info.level}: ${info.message} ${metadata}`;
        }),
      ),
    }),
  ],
});

/**
 * Setup Elasticsearch
 *
 * This function sets up the Elasticsearch connection and creates the indices if they don't exist.
 *
 * It also creates the ngram analyzer for name and description fields for better search results.
 * Our search queries will use the ngram analyzer for name and description fields.
 */
const setupElasticsearch = async () => {
  elasticSearchLogger.info('Initializing Elasticsearch connection', {
    host: process.env.ELASTICSEARCH_HOST,
  });
  try {
    await client.ping();
    elasticSearchLogger.info('Connected to Elasticsearch successfully');

    // Check if indices exist
    const documentExists = await client.indices.exists({ index: 'documents' });
    const folderExists = await client.indices.exists({ index: 'folders' });

    // Create documents index if it doesn't exist
    if (!documentExists) {
      elasticSearchLogger.info('Creating documents index');
      await client.indices.create({
        index: 'documents',
        body: {
          settings: {
            index: {
              max_ngram_diff: 5,
            },
            analysis: {
              analyzer: {
                ngram_analyzer: {
                  type: 'custom',
                  tokenizer: 'ngram_tokenizer',
                  filter: ['lowercase'],
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 2,
                  max_gram: 7,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: {
                type: 'text',
                analyzer: 'ngram_analyzer',
                search_analyzer: 'standard',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              description: {
                type: 'text',
                analyzer: 'ngram_analyzer',
                search_analyzer: 'standard',
              },
              fileType: { type: 'keyword' },
              fileSize: { type: 'float' },
              creatorId: { type: 'integer' },
              folderId: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
              isDeleted: { type: 'boolean' },
            },
          },
        },
      });

      elasticSearchLogger.info('Documents index created successfully');
    } else {
      elasticSearchLogger.info('Documents index already exists');
    }

    // Create folders index if it doesn't exist
    if (!folderExists) {
      elasticSearchLogger.info('Creating folders index');
      await client.indices.create({
        index: 'folders',
        body: {
          settings: {
            index: {
              max_ngram_diff: 5,
            },
            analysis: {
              analyzer: {
                ngram_analyzer: {
                  type: 'custom',
                  tokenizer: 'ngram_tokenizer',
                  filter: ['lowercase'],
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 2,
                  max_gram: 7,
                  token_chars: ['letter', 'digit'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: {
                type: 'text',
                analyzer: 'ngram_analyzer',
                search_analyzer: 'standard',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              description: {
                type: 'text',
                analyzer: 'ngram_analyzer',
                search_analyzer: 'standard',
              },
              depth: { type: 'integer' },
              parentId: { type: 'integer' },
              creatorId: { type: 'integer' },
              createdAt: { type: 'date' },
              isDeleted: { type: 'boolean' },
            },
          },
        },
      });

      elasticSearchLogger.info('Folders index created successfully');
    } else {
      elasticSearchLogger.info('Folders index already exists');
    }

    elasticSearchLogger.info('Elasticsearch setup completed');
  } catch (error) {
    elasticSearchLogger.error('Error setting up Elasticsearch', { error });
    throw error;
  }
};

/**
 * Index all documents
 *
 * This function indexes all documents in the database.
 */
const indexAllDocuments = async () => {
  try {
    elasticSearchLogger.info('Starting batch indexing of all documents');

    const documents = await prisma.document.findMany({
      include: {
        fileType: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    elasticSearchLogger.info(`Found ${documents.length} documents to index`);

    const operations = documents.flatMap(doc => [
      { index: { _index: 'documents', _id: doc.id.toString() } },
      {
        id: doc.id,
        name: doc.name,
        description: doc.description,
        fileType: doc.fileType.extension,
        fileSize: doc.fileSize,
        folderId: doc.folderId,
        creatorId: doc.creatorId,
        creatorName: doc.creator.name,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        isDeleted: doc.isDeleted,
      },
    ]);

    if (operations.length > 0) {
      elasticSearchLogger.debug(`Sending bulk operation with ${operations.length / 2} documents`);

      const bulkResponse = await client.bulk({ refresh: true, operations });

      if (bulkResponse.errors) {
        const erroredDocuments: unknown[] = [];
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0] as keyof typeof action;
          if (action[operation]?.error) {
            erroredDocuments.push({
              status: action[operation]?.status,
              error: action[operation]?.error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });

        elasticSearchLogger.error(`Failed to index ${erroredDocuments.length} documents`, {
          count: erroredDocuments.length,
          firstError: erroredDocuments[0],
        });

        // Log detailed errors at debug level
        elasticSearchLogger.debug('Detailed indexing errors', {
          errors: erroredDocuments,
        });
      } else {
        elasticSearchLogger.info(`Successfully indexed ${documents.length} documents`);
      }
    } else {
      elasticSearchLogger.info('No documents to index');
    }

    return documents.length;
  } catch (error) {
    elasticSearchLogger.error('Error indexing documents', { error });
    throw error;
  }
};

/**
 * Index all folders
 *
 * This function indexes all folders in the database.
 */
const indexAllFolders = async () => {
  try {
    elasticSearchLogger.info('Starting batch indexing of all folders');

    const folders = await prisma.folder.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    elasticSearchLogger.info(`Found ${folders.length} folders to index`);

    const operations = folders.flatMap(folder => [
      { index: { _index: 'folders', _id: folder.id.toString() } },
      {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        depth: folder.depth,
        parentId: folder.parentId,
        creatorId: folder.creatorId,
        creatorName: folder.creator.name,
        createdAt: folder.createdAt,
        isDeleted: folder.isDeleted,
      },
    ]);

    if (operations.length > 0) {
      elasticSearchLogger.debug(`Sending bulk operation with ${operations.length / 2} folders`);

      const bulkResponse = await client.bulk({ refresh: true, operations });

      if (bulkResponse.errors) {
        const erroredDocuments: unknown[] = [];
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0] as keyof typeof action;
          if (action[operation]?.error) {
            erroredDocuments.push({
              status: action[operation]?.status,
              error: action[operation]?.error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });

        elasticSearchLogger.error(`Failed to index ${erroredDocuments.length} folders`, {
          count: erroredDocuments.length,
          firstError: erroredDocuments[0],
        });

        elasticSearchLogger.debug('Detailed indexing errors', {
          errors: erroredDocuments,
        });
      } else {
        elasticSearchLogger.info(`Successfully indexed ${folders.length} folders`);
      }
    } else {
      elasticSearchLogger.info('No folders to index');
    }

    return folders.length;
  } catch (error) {
    elasticSearchLogger.error('Error indexing folders', { error });
    throw error;
  }
};

/**
 * Index a single document
 *
 * This function indexes a single document in the database.
 */
const indexDocument = async (documentId: number) => {
  try {
    elasticSearchLogger.info(`Indexing document with ID ${documentId}`);

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        fileType: true,
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!document) {
      elasticSearchLogger.warn(`Document with ID ${documentId} not found`);
      throw new Error(`Document with ID ${documentId} not found`);
    }

    await client.index({
      index: 'documents',
      id: document.id.toString(),
      document: {
        id: document.id,
        name: document.name,
        description: document.description,
        fileType: document.fileType.extension,
        fileSize: document.fileSize,
        folderId: document.folderId,
        creatorId: document.creatorId,
        creatorName: document.creator.name,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        isDeleted: document.isDeleted,
      },
      refresh: true,
    });

    elasticSearchLogger.info(`Document ${documentId} indexed successfully`, {
      name: document.name,
      fileType: document.fileType.extension,
    });

    return true;
  } catch (error) {
    elasticSearchLogger.error(`Error indexing document ${documentId}`, { error, documentId });
    throw error;
  }
};

/**
 * Index a single folder
 *
 * This function indexes a single folder in the database.
 */
const indexFolder = async (folderId: number) => {
  try {
    elasticSearchLogger.info(`Indexing folder with ID ${folderId}`);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!folder) {
      elasticSearchLogger.warn(`Folder with ID ${folderId} not found`);
      throw new Error(`Folder with ID ${folderId} not found`);
    }

    await client.index({
      index: 'folders',
      id: folder.id.toString(),
      document: {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        depth: folder.depth,
        parentId: folder.parentId,
        creatorId: folder.creatorId,
        creatorName: folder.creator.name,
        createdAt: folder.createdAt,
        isDeleted: folder.isDeleted,
      },
      refresh: true,
    });

    elasticSearchLogger.info(`Folder ${folderId} indexed successfully`, {
      name: folder.name,
      depth: folder.depth,
    });

    return true;
  } catch (error) {
    elasticSearchLogger.error(`Error indexing folder ${folderId}`, { error, folderId });
    throw error;
  }
};

/**
 * Search functionality
 *
 * This function searches the database for documents and folders.
 */
const search = async (
  query: string,
  options: {
    indices?: string[];
    from?: number;
    size?: number;
    includeDeleted?: boolean;
  } = {},
) => {
  const {
    indices = ['documents', 'folders'],
    from = 0,
    size = 10,
    includeDeleted = false,
  } = options;
  elasticSearchLogger.info('Performing search', {
    query,
    indices,
    from,
    size,
    includeDeleted,
  });
  const filter = includeDeleted ? [] : [{ term: { isDeleted: false } }];
  try {
    const result = await client.search({
      index: indices,
      from,
      size,
      query: {
        bool: {
          must: {
            multi_match: {
              query,
              fields: ['name^2', 'description', 'fileType'],
              fuzziness: 'AUTO',
              prefix_length: 1,
            },
          },
          filter,
        },
      },
      sort: [{ _score: { order: 'desc' } }, { createdAt: { order: 'desc' } }],
    });
    elasticSearchLogger.info(`Search completed with ${result.hits.total} total hits`, {
      totalHits:
        typeof result.hits.total === 'number' ? result.hits.total : result.hits.total?.value,
      returnedHits: result.hits.hits.length,
    });
    elasticSearchLogger.debug('Search results details', {
      took: result.took,
      timedOut: result.timed_out,
    });
    return result.hits;
  } catch (error) {
    elasticSearchLogger.error('Error performing search', { error, query, indices });
    throw error;
  }
};

/**
 * Delete document or folder from index
 *
 * This function deletes a document or folder from the index.
 */
const deleteFromIndex = async (type: 'document' | 'folder', id: number) => {
  const index = type === 'document' ? 'documents' : 'folders';

  elasticSearchLogger.info(`Removing ${type} from index`, { id, index });

  try {
    await client.delete({
      index,
      id: id.toString(),
      refresh: true,
    });

    elasticSearchLogger.info(`${type} ${id} removed from index successfully`);
    return true;
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 404) {
      elasticSearchLogger.warn(`${type} ${id} not found in index`, { id, index });
      return false;
    }

    elasticSearchLogger.error(`Error removing ${type} ${id} from index`, { error, id, index });
    throw error;
  }
};

export {
  client,
  deleteFromIndex,
  indexAllDocuments,
  indexAllFolders,
  indexDocument,
  indexFolder,
  search,
  setupElasticsearch,
};
