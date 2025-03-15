/**
 * Server Initialization Script
 *
 * This is the entry point for the application that:
 * - Sets up Elasticsearch indices
 * - Initializes the Express application
 * - Configures graceful shutdown procedures
 * - Handles process signals and uncaught exceptions
 */
import prisma from '@/shared/db/prisma';
import {
  client,
  indexAllDocuments,
  indexAllFolders,
  setupElasticsearch,
} from '@/shared/plugins/elastic-search';
import logger from '@/shared/utils/logger';
import 'dotenv/config';

import app from './app';

// Initialize Elasticsearch indices and populate with existing data
(async () => {
  try {
    await setupElasticsearch();
    await indexAllDocuments();
    await indexAllFolders();
    logger.info('Elasticsearch setup complete');
  } catch (error) {
    logger.error('Failed to setup Elasticsearch:', error);
    process.exit(1); // Exit if Elasticsearch setup fails as it's critical
  }
})();

// Server configuration and startup
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  logger.info(`Document Management API running on http://localhost:${PORT}`);
});

/**
 * Graceful shutdown function
 *
 * Handles the orderly shutdown of server components:
 * 1. Empties Elasticsearch connection pool
 * 2. Closes HTTP server
 * 3. Disconnects from database
 * 4. Exits process
 *
 * Includes a 5-second timeout for force exit if connections cannot be closed
 */
const shutdown = async () => {
  logger.info('Shutting down server...');
  try {
    // Close Elasticsearch connections
    if (client && client.transport && client.transport.connectionPool) {
      try {
        // Close all open connections in the pool
        client.transport.connectionPool.empty();
        logger.info('Elasticsearch connection pool emptied');
      } catch (error) {
        logger.error('Error emptying Elasticsearch connection pool:', error);
      }
    }
    logger.info('Elasticsearch connection closed');

    // Close HTTP server and database connections
    server.close(async () => {
      logger.info('HTTP server closed');
      await prisma.$disconnect();
      logger.info('Database connections closed');
      process.exit(0); // Exit with success code
    });
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1); // Exit with error code
  }

  // Safety timeout - force exit if connections take too long to close
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000); // 5-second timeout for graceful shutdown
};

// Signal handling for graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', () => {
  logger.info('Received SIGINT, terminating immediately');
  shutdown();
  process.exit(0);
});

// Global exception handling to prevent crashes
process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  shutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown();
});

export default server;
