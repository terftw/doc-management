import extendedPrisma from '@/shared/db/prisma';
import { FolderDepthLimitError, FolderMaxChildrenError } from '@/shared/errors';
import { FOLDER_DEPTH, FOLDER_MAX_CHILDREN } from '@/shared/types/folder-constraints';
import { Folder } from '@prisma/client';
import { FolderWithChildCount } from 'src/shared/types/folder-with-count';

import { CreateFolderDto, UpdateFolderDto } from './folder.schema';

/**
 * Folder service responsible for folder-related operations
 *
 * This service handles the folder-related operations:
 * - Get a folder by ID
 * - Create a new folder
 * - Update a folder
 */
export class FolderService {
  private prisma = extendedPrisma;

  /**
   * Get a folder by ID
   *
   * @param {number} id - The ID of the folder to get
   * @param {number} userId - The ID of the user requesting the folder
   * @returns {Promise<FolderWithChildCount>} The folder
   *
   * @throws Will return 404 if folder is not found
   */
  async getFolderById(id: number, userId: number): Promise<FolderWithChildCount> {
    const folder = await this.prisma.folder.findFirst({
      where: {
        id,
        creatorId: userId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    return folder;
  }

  /**
   * Create a new folder
   *
   * @param {number} userId - The ID of the user creating the folder
   * @param {CreateFolderDto} data - The data for the folder to be created
   * @returns {Promise<Folder>} The created folder
   *
   * @throws Will return 400 if folder depth limit is reached
   * @throws Will return 400 if folder max children limit is reached
   */
  async createFolder(userId: number, data: CreateFolderDto): Promise<Folder> {
    const parentFolder = await this.prisma.folder.findFirst({
      where: {
        id: data.parentId,
        creatorId: userId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            children: true,
          },
        },
      },
    });

    const depth = parentFolder ? parentFolder.depth + 1 : 0;
    if (depth > FOLDER_DEPTH) {
      throw new FolderDepthLimitError('Folder depth limit reached');
    }

    if (parentFolder?._count.children && parentFolder._count.children >= FOLDER_MAX_CHILDREN) {
      throw new FolderMaxChildrenError('Folder max children limit reached');
    }

    return await this.prisma.folder.create({
      data: {
        ...data,
        creatorId: userId,
        depth,
      },
    });
  }

  /**
   * Update a folder
   *
   * @param {number} id - The ID of the folder to update
   * @param {UpdateFolderDto} data - The data for the folder to be updated
   * @returns {Promise<Folder>} The updated folder
   */
  async updateFolder(id: number, data: UpdateFolderDto): Promise<Folder> {
    return await this.prisma.folder.update({
      where: { id },
      data,
    });
  }
}
