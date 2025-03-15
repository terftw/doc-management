// src/features/documents/document.service.ts
import { PrismaClient } from '@prisma/client';

import { CreateDocumentDto, DocumentQueryDto } from './documents.schema';

export class DocumentService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Get all documents with pagination and filtering
  async getDocuments(userId: number, query: DocumentQueryDto) {
    const { folderId, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {
      creatorId: userId,
      isDeleted: false,
      ...(folderId && { folderId }),
    };

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          folder: {
            select: { id: true, name: true },
          },
          fileType: true,
        },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a document by ID
  async getDocumentById(id: number, userId: number) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        creatorId: userId,
        isDeleted: false,
      },
      include: {
        folder: {
          select: { id: true, name: true },
        },
        fileType: true,
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    return document;
  }

  async createDocument(userId: number, data: CreateDocumentDto) {
    return await this.prisma.document.create({
      data: {
        ...data,
        creatorId: userId,
      },
    });
  }

  // Delete a document (soft delete)
  async deleteDocument(id: number, userId: number) {
    // Check if document exists and belongs to user
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        creatorId: userId,
        isDeleted: false,
      },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Use soft delete
    return await this.prisma.document.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
