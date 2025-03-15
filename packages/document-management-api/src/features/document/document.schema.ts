import { z } from 'zod';

/**
 * Schema for validating document creation request data
 */
export const createDocumentSchema = z.object({
  name: z.string().min(1, 'Filename is required'),
  fileExtension: z.string().min(1, 'File extension is required'),
  fileSize: z.number().positive('File size is required'),
  folderId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

/**
 * Schema for validating document update request data
 */
export const updateDocumentSchema = z.object({
  description: z.string().optional(),
});

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
