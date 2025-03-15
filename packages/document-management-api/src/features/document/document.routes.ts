import { authMiddleware } from '@/shared/middleware/auth.middleware';
import express from 'express';

import { DocumentController } from './document.controller';

const router = express.Router();
const documentController = new DocumentController();

router.use(authMiddleware);

/**
 * POST /api/documents
 * Create a new document
 * @param {Request} req - Express request object containing create document data
 * @param {Response} res - Express response object
 */
router.post('/', async (req, res) => {
  await documentController.createDocument(req, res);
});

/**
 * PATCH /api/documents/:id
 * Update a document
 * @param {Request} req - Express request object containing update document data
 * @param {Response} res - Express response object
 */
router.patch('/:id', async (req, res) => {
  await documentController.updateDocument(req, res);
});

/**
 * DELETE /api/documents/:id
 * Delete a document
 * @param {Request} req - Express request object containing document ID
 * @param {Response} res - Express response object
 */
router.delete('/:id', async (req, res) => {
  await documentController.deleteDocument(req, res);
});

export default router;
