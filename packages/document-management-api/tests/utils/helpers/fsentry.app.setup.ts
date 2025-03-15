import { FSEntryController } from '@/features/fsentry/fsentry.controller';
import express, { RequestHandler } from 'express';
import { UserFactory } from 'tests/utils/factories/user';

/**
 * Setup function for creating a test app with FSEntryController routes
 *
 * This function configures an Express app with the FSEntryController routes
 * and sets up the routes without authentication middleware.
 */
export const setupFSEntryTestApp = () => {
  const app = express();
  app.use(express.json());

  const fsEntryController = new FSEntryController();

  app.get('/api/fsentries', (async (req, res) => {
    req.user = UserFactory.create();
    await fsEntryController.getFSEntries(req, res);
  }) as RequestHandler);

  app.get('/api/fsentries/:id', (async (req, res) => {
    req.user = UserFactory.create();
    await fsEntryController.getFSEntryByFolderId(req, res);
  }) as RequestHandler);

  return app;
};
