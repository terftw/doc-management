import { z } from 'zod';

export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Filename is required'),
  fileExtension: z.string().min(1, 'File extension is required'),
  fileSize: z.number().positive('File size is required'),
  folderId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

export const updateDocumentSchema = z.object({
  id: z.number().int().positive(),
  description: z.string().optional(),
  folderId: z.number().int().positive().optional(),
  parentFolderId: z.number().int().positive().optional(),
});

export const deleteDocumentSchema = z.object({
  id: z.number().int().positive(),
  folderId: z.number().int().positive().optional(),
});

export type CreateDocumentSchema = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentSchema = z.infer<typeof updateDocumentSchema>;
export type DeleteDocumentSchema = z.infer<typeof deleteDocumentSchema>;

export type DocumentResponse = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  folderId: number | null;
  fileTypeId: number;
  fileSize: number;
  fileHash: string | null;
  storagePath: string;
  creatorId: number;
  isDeleted: boolean;
  description: string | null;
  searchableContent: string | null;
};

export type Document = {
  id: number;
  name: string;
  folderId?: number;
  fileSize: number;
  fileTypeId: number;
  storagePath: string;
  creatorId: number;
  createdBy: string;
  updatedAt: string;
  isDeleted: boolean;
  description?: string;
  searchableContent?: string;
  creator: {
    name: string;
  };
};
