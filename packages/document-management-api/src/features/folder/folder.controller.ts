import { FolderDepthLimitError, FolderMaxChildrenError } from '@/shared/errors';
import { HttpStatus } from '@/shared/types/http-status';
import logger from '@/shared/utils/logger';
import { Request, Response } from 'express';

import { createFolderSchema, updateFolderSchema } from './folder.schema';
import { FolderService } from './folder.service';

/**
 * Folder controller
 *
 * This controller handles the folder-related operations:
 * - Create a new folder
 * - Update a folder
 */
export class FolderController {
  constructor(private _folderService = new FolderService()) {}
  /**
   * Create a new folder
   *
   * @param {Request} req - Express request object containing create folder data
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with created folder or error message
   *
   * @throws Will return 201 if folder is created successfully
   * @throws Will return 400 if folder data is invalid
   * @throws Will return 401 if user is not authenticated
   * @throws Will return 500 if failed to create folder
   */
  async createFolder(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedBody = createFolderSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid folder data',
          errors: parsedBody.error.format(),
        });
      }

      const folder = await this._folderService.createFolder(Number(userId), parsedBody.data);

      return res.status(HttpStatus.CREATED).json(folder);
    } catch (error) {
      if (error instanceof FolderDepthLimitError) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }

      if (error instanceof FolderMaxChildrenError) {
        return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      }

      logger.error('Error creating folder:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to create folder' });
    }
  }

  /**
   * Update a folder
   *
   * @param {Request} req - Express request object containing update folder data
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with updated folder or error message
   *
   * @throws Will return 200 if folder is updated successfully
   * @throws Will return 400 if folder data is invalid
   * @throws Will return 401 if user is not authenticated
   * @throws Will return 500 if failed to update folder
   */
  async updateFolder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedBody = updateFolderSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid folder data',
          errors: parsedBody.error.format(),
        });
      }

      const updatedFolder = await this._folderService.updateFolder(Number(id), parsedBody.data);

      return res.status(HttpStatus.OK).json(updatedFolder);
    } catch (error) {
      logger.error('Error updating folder:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update folder' });
    }
  }
}
