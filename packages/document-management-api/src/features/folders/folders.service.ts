import { PrismaClient } from '@prisma/client';

import { CreateFolderDto, FolderQueryDto, UpdateFolderDto } from './folders.schema';

export class FolderService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Get all folders with pagination and filtering
  async getFolders(userId: number, query: FolderQueryDto) {
    const {
      includeDocuments,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    // Build where conditions
    const where: any = {
      creatorId: userId,
      isDeleted: false,
    };

    // Get total count for pagination
    const total = await this.prisma.folder.count({ where });

    // Build query with pagination and sorting
    const folders = await this.prisma.folder.findMany({
      where,
      include: {
        documents: includeDocuments
          ? {
              where: { isDeleted: false },
              select: {
                id: true,
                filename: true,
                createdAt: true,
                updatedAt: true,
                fileSize: true,
                fileType: true,
              },
            }
          : false,
        _count: {
          select: { documents: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    });

    return {
      data: folders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a folder by ID
  async getFolderById(id: number, userId: number) {
    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        creatorId: userId,
        isDeleted: false,
      },
      include: {
        documents: {
          where: { isDeleted: false },
          include: {
            fileType: true,
          },
        },
      },
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    return folder;
  }

  // Create a new folder
  async createFolder(userId: number, data: CreateFolderDto) {
    return await this.prisma.folder.create({
      data: {
        ...data,
        creatorId: userId,
      },
    });
  }

  // Update a folder
  async updateFolder(id: number, userId: number, data: UpdateFolderDto) {
    // Check if folder exists and belongs to user
    const folder = await this.prisma.folder.findFirst({
      where: { id, creatorId: userId, isDeleted: false },
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    return await this.prisma.folder.update({
      where: { id },
      data,
    });
  }

  async deleteFolder(id: number, userId: number) {
    const folder = await this.prisma.folder.findFirst({
      where: { id, creatorId: userId, isDeleted: false },
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    return await this.prisma.folder.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
