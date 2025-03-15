import { queryConfig } from '@/config/react-query-config';
import { QueryClient } from '@tanstack/react-query';

let queryClientInstance: QueryClient | null = null;

export const getQueryClient = (): QueryClient => {
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient({
      defaultOptions: queryConfig,
    });
  }
  return queryClientInstance;
};

export const clearQueryClient = (): void => {
  if (queryClientInstance) {
    queryClientInstance.clear();
  }
};

export const cacheKeys = {
  folders: 'folders',
  documents: 'documents',
  fsentries: 'fsentries',
};
