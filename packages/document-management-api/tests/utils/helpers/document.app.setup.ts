import { DocumentController } from '@/features/document/document.controller';
import express, { RequestHandler } from 'express';
import { UserFactory } from 'tests/utils/factories/user';

/**
 * Setup function for creating a test app with DocumentController routes
 *
 * This function configures an Express app with the DocumentController routes
 * and sets up the routes without authentication middleware.
 */
export const setupDocumentTestApp = () => {
  const app = express();
  app.use(express.json());

  const documentController = new DocumentController();

  // Set up the routes directly without auth middleware
  app.post('/api/documents', (async (req, res) => {
    req.user = UserFactory.create();
    await documentController.createDocument(req, res);
  }) as RequestHandler);

  app.patch('/api/documents/:id', (async (req, res) => {
    req.user = UserFactory.create();
    await documentController.updateDocument(req, res);
  }) as RequestHandler);

  app.delete('/api/documents/:id', (async (req, res) => {
    req.user = UserFactory.create();
    await documentController.deleteDocument(req, res);
  }) as RequestHandler);

  return app;
};
