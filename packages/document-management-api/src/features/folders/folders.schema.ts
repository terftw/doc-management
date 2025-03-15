// src/features/folders/folder.schemas.ts
import { z } from 'zod';

// Create folder schema
export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

// Query params schema
export const folderQuerySchema = z.object({
  includeDocuments: z.boolean().default(false),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// DTOs
export type CreateFolderDto = z.infer<typeof createFolderSchema>;
export type UpdateFolderDto = z.infer<typeof updateFolderSchema>;
export type FolderQueryDto = z.infer<typeof folderQuerySchema>;
