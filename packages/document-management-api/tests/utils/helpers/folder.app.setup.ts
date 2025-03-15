import { FolderController } from '@/features/folder/folder.controller';
import express, { RequestHandler } from 'express';
import { UserFactory } from 'tests/utils/factories/user';

/**
 * Setup function for creating a test app with FolderController routes
 *
 * This function configures an Express app with the FolderController routes
 * and sets up the routes without authentication middleware.
 */
export const setupFolderTestApp = () => {
  const app = express();
  app.use(express.json());

  const folderController = new FolderController();

  app.post('/api/folders', (async (req, res) => {
    req.user = UserFactory.create();
    await folderController.createFolder(req, res);
  }) as RequestHandler);

  app.patch('/api/folders/:id', (async (req, res) => {
    req.user = UserFactory.create();
    await folderController.updateFolder(req, res);
  }) as RequestHandler);

  return app;
};
