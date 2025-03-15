// src/features/documents/document.schemas.ts
import { z } from 'zod';

// Create document schema
export const createDocumentSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  fileTypeId: z.number().int().positive('Valid file type is required'),
  fileSize: z.number().int().positive('File size is required'),
  storagePath: z.string().min(1, 'Storage path is required'),
  folderId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

// Query params schema
export const documentQuerySchema = z.object({
  folderId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// DTOs
export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type DocumentQueryDto = z.infer<typeof documentQuerySchema>;
