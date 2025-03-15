// src/features/folders/folder.routes.ts
import express from 'express';

import { FolderController } from './folders.controller';

const router = express.Router();
const folderController = new FolderController();

// GET /api/folders
router.get('/', (req, res) => folderController.getFolders(req, res));

// GET /api/folders/:id
router.get('/:id', (req, res) => folderController.getFolderById(req, res));

// POST /api/folders
router.post('/', (req, res) => folderController.createFolder(req, res));

// PUT /api/folders/:id
router.put('/:id', (req, res) => folderController.updateFolder(req, res));

// DELETE /api/folders/:id
router.delete('/:id', (req, res) => folderController.deleteFolder(req, res));

export default router;
