import { z } from 'zod';

import { Document } from './document';
import { Folder } from './folder';

export const getFSEntriesSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  searchQuery: z.string().optional(),
});

export type GetFSEntriesSchema = z.infer<typeof getFSEntriesSchema>;
export type FSEntriesResponse = {
  data: ((Document | Folder) & { entryType: 'folder' | 'document' })[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    folder?: Folder;
    childrenCount?: number;
  };
};

export type FSEntry = (Folder | Document) & { entryType: 'folder' | 'document' };
