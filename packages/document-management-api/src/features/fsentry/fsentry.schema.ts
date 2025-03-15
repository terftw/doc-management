import { z } from 'zod';

/**
 * Schema for validating the query parameters for file system entry queries
 */
export const fsEntryQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
  searchQuery: z.string().optional(),
});

export type FSEntryQueryDTO = z.infer<typeof fsEntryQuerySchema>;
