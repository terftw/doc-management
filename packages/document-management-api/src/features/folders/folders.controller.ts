// src/features/folders/folder.controller.ts
import { Request, Response } from 'express';

import prisma from '../../shared/db/prisma';
import { createFolderSchema, folderQuerySchema, updateFolderSchema } from './folders.schema';
import { FolderService } from './folders.service';

// Initialize services
const folderService = new FolderService(prisma);

export class FolderController {
  // Get all folders
  async getFolders(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Parse and validate query parameters
      const parsedQuery = folderQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: parsedQuery.error.format(),
        });
      }

      const result = await folderService.getFolders(Number(userId), parsedQuery.data);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error getting folders:', error);
      return res.status(500).json({ message: 'Failed to fetch folders' });
    }
  }

  // Get folder by ID
  async getFolderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const folder = await folderService.getFolderById(Number(id), Number(userId));

      return res.status(200).json(folder);
    } catch (error) {
      if (error instanceof Error && error.message === 'Folder not found') {
        return res.status(404).json({ message: 'Folder not found' });
      }

      console.error('Error getting folder:', error);
      return res.status(500).json({ message: 'Failed to fetch folder' });
    }
  }

  // Create folder
  async createFolder(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Parse and validate request body
      const parsedBody = createFolderSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          message: 'Invalid folder data',
          errors: parsedBody.error.format(),
        });
      }

      const folder = await folderService.createFolder(Number(userId), parsedBody.data);

      return res.status(201).json(folder);
    } catch (error) {
      if (error instanceof Error && error.message === 'Parent folder not found') {
        return res.status(404).json({ message: 'Parent folder not found' });
      }

      console.error('Error creating folder:', error);
      return res.status(500).json({ message: 'Failed to create folder' });
    }
  }

  // Update folder
  async updateFolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Parse and validate request body
      const parsedBody = updateFolderSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          message: 'Invalid folder data',
          errors: parsedBody.error.format(),
        });
      }

      const folder = await folderService.updateFolder(Number(id), Number(userId), parsedBody.data);

      return res.status(200).json(folder);
    } catch (error) {
      if (error instanceof Error && error.message === 'Folder not found') {
        return res.status(404).json({ message: 'Folder not found' });
      } else if (error instanceof Error && error.message === 'Parent folder not found') {
        return res.status(404).json({ message: 'Parent folder not found' });
      } else if (error instanceof Error && error.message === 'A folder cannot be its own parent') {
        return res.status(400).json({ message: 'A folder cannot be its own parent' });
      }

      console.error('Error updating folder:', error);
      return res.status(500).json({ message: 'Failed to update folder' });
    }
  }

  // Delete folder
  async deleteFolder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await folderService.deleteFolder(Number(id), Number(userId));

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Folder not found') {
        return res.status(404).json({ message: 'Folder not found' });
      }

      console.error('Error deleting folder:', error);
      return res.status(500).json({ message: 'Failed to delete folder' });
    }
  }
}
