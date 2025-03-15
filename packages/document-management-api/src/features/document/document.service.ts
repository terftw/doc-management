import extendedPrisma from '@/shared/db/prisma';
import { FileTypeInvalidError, NotFoundError } from '@/shared/errors';
import { Document } from '@prisma/client';

import { CreateDocumentDto, UpdateDocumentDto } from './document.schema';

/**
 * Document service responsible for document-related operations
 *
 * This service handles the document-related operations:
 * - Create a new document
 * - Update a document
 * - Delete a document
 */
export class DocumentService {
  private prisma = extendedPrisma;

  /**
   * Create a document
   *
   * @param {number} userId - The ID of the user creating the document
   * @param {CreateDocumentDto} data - The data for the document to be created
   * @returns {Promise<Document>} The created document
   *
   * @throws Will return 400 if file type is invalid
   */
  async createDocument(userId: number, data: CreateDocumentDto): Promise<Document> {
    // This is a safeguard against cases where the extension is not normalized
    const { fileExtension, ...rest } = data;
    const normalizedExtension = fileExtension.toLowerCase();

    const fileType = await this.prisma.fileType.findUnique({
      where: { extension: normalizedExtension },
    });

    if (!fileType) {
      throw new FileTypeInvalidError('Invalid file type');
    }

    return await this.prisma.document.create({
      data: {
        ...rest,
        fileTypeId: fileType.id,
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            name: true, // We only need the name of the user
          },
        },
      },
    });
  }

  /**
   * Update a document
   *
   * @param {number} id - The ID of the document to be updated
   * @param {UpdateDocumentDto} data - The data for the document to be updated
   * @returns {Promise<Document>} The updated document
   */
  async updateDocument(id: number, data: UpdateDocumentDto): Promise<Document> {
    return await this.prisma.document.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a document (soft delete)
   *
   * @param {number} id - The ID of the document to be deleted
   * @param {number} userId - The ID of the user deleting the document
   * @returns {Promise<Document>} The deleted document
   *
   * @throws Will return 404 if document is not found
   */
  async deleteDocument(id: number, userId: number): Promise<Document> {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        creatorId: userId,
        isDeleted: false,
      },
    });

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Use soft delete
    return await this.prisma.document.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
