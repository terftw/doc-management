import { z } from 'zod';

import { Document } from './document';

export const getFolderDataSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  folderId: z.number(),
  searchQuery: z.string().optional(),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  parentId: z.number().optional(),
});

export const updateFolderSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Folder name is required'),
  description: z.string().optional(),
  parentId: z.number().optional().nullable(),
});

export type GetFolderDataSchema = z.infer<typeof getFolderDataSchema>;
export type CreateFolderSchema = z.infer<typeof createFolderSchema>;
export type UpdateFolderSchema = z.infer<typeof updateFolderSchema>;

export const folderDepth = 3 as const;
export const folderMaxChildren = 10 as const;

export type FolderResponse = Folder & { documents: Document[] };

export type Folder = {
  id: number;
  name: string;
  description: string;
  depth: number;
  searchableContent: string;
  creatorId: number;
  createdAt: string;
  isDeleted: boolean;
  creator: {
    name: string;
  };
};
