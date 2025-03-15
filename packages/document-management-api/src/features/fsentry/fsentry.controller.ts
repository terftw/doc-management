import { FolderService } from '@/features/folder/folder.service';
import { HttpStatus } from '@/shared/types/http-status';
import logger from '@/shared/utils/logger';
import { Request, Response } from 'express';

import { fsEntryQuerySchema } from './fsentry.schema';
import { FSEntryService } from './fsentry.service';

/**
 * FSEntryController
 *
 * This controller handles the file system entry-related operations:
 * - Get all file system entries
 * - Get a file system entry by folder ID
 */
export class FSEntryController {
  /**
   * Constructor for the FSEntryController
   * @param {FSEntryService} _fsEntryService - The service for file system entry operations
   * @param {FolderService} _folderService - The service for folder operations
   */
  constructor(
    private _fsEntryService = new FSEntryService(),
    private _folderService = new FolderService(),
  ) {}

  /**
   * Get all file system entries
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @returns {Promise<Response>} The response object
   *
   * @throws Will return 401 if the user is not authenticated
   * @throws Will return 400 if the query parameters are invalid
   * @throws Will return 500 if the file system entries cannot be fetched
   */
  async getFSEntries(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedQuery = fsEntryQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid query parameters',
          errors: parsedQuery.error.format(),
        });
      }

      const result = await this._fsEntryService.getFSEntries(Number(userId), parsedQuery.data);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      logger.error('Error getting fsentries:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to fetch fsentries' });
    }
  }

  /**
   * Get a file system entry by folder ID
   * @param {Request} req - The request object
   * @param {Response} res - The response object
   * @returns {Promise<Response>} The response object
   *
   * @throws Will return 401 if the user is not authenticated
   * @throws Will return 400 if the query parameters are invalid
   * @throws Will return 404 if the folder is not found
   * @throws Will return 500 if the file system entry cannot be fetched
   */
  async getFSEntryByFolderId(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      const folderId = req.params.folderId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedQuery = fsEntryQuerySchema.safeParse(req.query);
      if (!parsedQuery.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid query parameters',
          errors: parsedQuery.error.format(),
        });
      }

      const folder = await this._folderService.getFolderById(Number(folderId), Number(userId));
      if (!folder) {
        return res.status(HttpStatus.NOT_FOUND).json({ message: 'Folder not found' });
      }

      const result = await this._fsEntryService.getFSEntries(
        Number(userId),
        parsedQuery.data,
        Number(folderId),
      );

      const { _count, ...restOfFolder } = folder;
      const childrenCount = _count.children;

      return res.status(HttpStatus.OK).json({
        data: result.data,
        metadata: {
          ...result.metadata,
          folder: restOfFolder,
          childrenCount,
        },
      });
    } catch (error) {
      logger.error('Error getting fsentries by folder:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to fetch fsentries' });
    }
  }
}
