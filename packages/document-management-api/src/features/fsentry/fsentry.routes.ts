import { authMiddleware } from '@/shared/middleware/auth.middleware';
import express from 'express';

import { FSEntryController } from './fsentry.controller';

const router = express.Router();
const fsEntryController = new FSEntryController();

router.use(authMiddleware);

/**
 * GET /api/fsentries
 * Get all file system entries
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
router.get('/', async (req, res) => {
  await fsEntryController.getFSEntries(req, res);
});

/**
 * GET /api/fsentries/:folderId
 * Get all file system entries by folder ID
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 */
router.get('/:folderId', async (req, res) => {
  await fsEntryController.getFSEntryByFolderId(req, res);
});

export default router;
