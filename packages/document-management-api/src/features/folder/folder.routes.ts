import { authMiddleware } from '@/shared/middleware/auth.middleware';
import express from 'express';

import { FolderController } from './folder.controller';

const router = express.Router();
const folderController = new FolderController();

router.use(authMiddleware);

/**
 * POST /api/folders
 * Create a new folder
 * @param {Request} req - Express request object containing create folder data
 * @param {Response} res - Express response object
 */
router.post('/', async (req, res) => {
  await folderController.createFolder(req, res);
});

/**
 * PATCH /api/folders/:id
 * Update a folder
 * @param {Request} req - Express request object containing update folder data
 * @param {Response} res - Express response object
 */
router.patch('/:id', async (req, res) => {
  await folderController.updateFolder(req, res);
});

export default router;
