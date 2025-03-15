// src/features/documents/document.controller.ts
import { Request, Response } from 'express';

import prisma from '../../shared/db/prisma';
import { createDocumentSchema, documentQuerySchema } from './documents.schema';
import { DocumentService } from './documents.service';

// Initialize services
const documentService = new DocumentService(prisma);

export class DocumentController {
  // Get all documents
  async getDocuments(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Parse and validate query parameters
      const parsedQuery = documentQuerySchema.safeParse(req.query);

      if (!parsedQuery.success) {
        return res.status(400).json({
          message: 'Invalid query parameters',
          errors: parsedQuery.error.format(),
        });
      }

      const result = await documentService.getDocuments(userId, parsedQuery.data);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error getting documents:', error);
      return res.status(500).json({ message: 'Failed to fetch documents' });
    }
  }

  // Get document by ID
  async getDocumentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const document = await documentService.getDocumentById(id, userId);

      return res.status(200).json(document);
    } catch (error) {
      if (error instanceof Error && error.message === 'Document not found') {
        return res.status(404).json({ message: 'Document not found' });
      }

      console.error('Error getting document:', error);
      return res.status(500).json({ message: 'Failed to fetch document' });
    }
  }

  // Create document
  async createDocument(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Parse and validate request body
      const parsedBody = createDocumentSchema.safeParse(req.body);

      if (!parsedBody.success) {
        return res.status(400).json({
          message: 'Invalid document data',
          errors: parsedBody.error.format(),
        });
      }

      const document = await documentService.createDocument(userId, parsedBody.data);

      return res.status(201).json(document);
    } catch (error) {
      console.error('Error creating document:', error);
      return res.status(500).json({ message: 'Failed to create document' });
    }
  }

  // Delete document
  async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await documentService.deleteDocument(id, userId);

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Document not found') {
        return res.status(404).json({ message: 'Document not found' });
      }

      console.error('Error deleting document:', error);
      return res.status(500).json({ message: 'Failed to delete document' });
    }
  }
}
