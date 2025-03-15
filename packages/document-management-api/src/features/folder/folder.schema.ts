import { z } from 'zod';

/**
 * Schema for creating a new folder
 */
export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  parentId: z.coerce.number().int().positive().optional(),
});

/**
 * Schema for updating a folder
 */
export const updateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
});

export type CreateFolderDto = z.infer<typeof createFolderSchema>;
export type UpdateFolderDto = z.infer<typeof updateFolderSchema>;
