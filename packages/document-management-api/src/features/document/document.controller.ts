import { FileTypeInvalidError, NotFoundError } from '@/shared/errors';
import { HttpStatus } from '@/shared/types/http-status';
import logger from '@/shared/utils/logger';
import { Request, Response } from 'express';

import { createDocumentSchema, updateDocumentSchema } from './document.schema';
import { DocumentService } from './document.service';

/**
 * Document controller responsible for document-related operations
 *
 * This controller handles the document-related operations:
 * - Create a new document
 * - Update a document
 * - Delete a document
 */
export class DocumentController {
  /**
   * Creates a new instance of the DocumentController
   * @param {DocumentService} _documentService - Service to handle document-related operations
   */
  constructor(private _documentService = new DocumentService()) {}

  /**
   * Creates a new document
   *
   * @param {Request} req - Express request object containing create document data
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with created document or error message
   *
   * @throws Will return 201 if document is created successfully
   * @throws Will return 400 if document data is invalid
   * @throws Will return 401 if user is not authenticated
   * @throws Will return 500 if failed to create document
   */
  async createDocument(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedBody = createDocumentSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid document data',
          errors: parsedBody.error.format(),
        });
      }

      const document = await this._documentService.createDocument(Number(userId), parsedBody.data);

      return res.status(HttpStatus.CREATED).json(document);
    } catch (error) {
      if (error instanceof FileTypeInvalidError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      logger.error('Error creating document:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to create document' });
    }
  }

  /**
   * Updates a document
   *
   * @param {Request} req - Express request object containing update document data
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with updated document or error message
   *
   * @throws Will return 200 if document is updated successfully
   * @throws Will return 400 if document data is invalid
   * @throws Will return 401 if user is not authenticated
   * @throws Will return 500 if failed to update document
   */
  async updateDocument(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      const parsedBody = updateDocumentSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid document data',
          errors: parsedBody.error.format(),
        });
      }

      const updatedDocument = await this._documentService.updateDocument(
        Number(id),
        parsedBody.data,
      );

      return res.status(HttpStatus.OK).json(updatedDocument);
    } catch (error) {
      logger.error('Error updating document:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to update document' });
    }
  }

  /**
   * Deletes a document
   *
   * @param {Request} req - Express request object containing document ID
   * @param {Response} res - Express response object
   *
   * @returns {Promise<Response>} JSON response with deleted document or error message
   *
   * @throws Will return 204 if document is deleted successfully
   * @throws Will return 401 if user is not authenticated
   * @throws Will return 500 if failed to delete document
   */
  async deleteDocument(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
      }

      await this._documentService.deleteDocument(Number(id), Number(userId));

      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      logger.error('Error deleting document:', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to delete document' });
    }
  }
}
