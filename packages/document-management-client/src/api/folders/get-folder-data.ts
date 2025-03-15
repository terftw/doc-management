import { QueryConfig } from '@/config/react-query-config';
import { apiGet } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { GetFolderDataSchema } from '@/models/folder';
import { FSEntriesResponse } from '@/models/fsentry';
import { queryOptions, useQuery } from '@tanstack/react-query';

/**
 * Retrieves folder data from the API
 *
 * @param input - Folder data retrieval payload that conforms to GetFolderDataSchema
 * @returns Promise containing the folder data response
 */
export const getFolderData = async (input: GetFolderDataSchema): Promise<FSEntriesResponse> => {
  return apiGet(`fsentries/${input.folderId}`, {
    searchParams: {
      page: input.page,
      pageSize: input.pageSize,
      searchQuery: input.searchQuery ?? '',
    },
  });
};

/**
 * Options for the getFolderData query
 *
 * @param input - Folder data retrieval payload that conforms to GetFolderDataSchema
 * @returns Query options for the getFolderData query
 */
export const getFolderDataQueryOptions = (input: GetFolderDataSchema) => {
  return queryOptions({
    queryKey: [cacheKeys.folders, input],
    queryFn: () => getFolderData(input),
  });
};

/**
 * Options for the useGetFolderData hook
 *
 * @param input - Folder data retrieval payload that conforms to GetFolderDataSchema
 * @returns Query options for the getFolderData query
 */
type UseGetFolderDataOptions = {
  input: GetFolderDataSchema;
  queryConfig?: QueryConfig<typeof getFolderDataQueryOptions>;
};

/**
 * Custom hook for folder data retrieval with automatic cache invalidation
 *
 * This hook wraps the folder data retrieval API call with React Query's useQuery,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useGetFolderData({ input: { folderId: 1 } });
 * ```
 *
 * @param options - Configuration options for the query
 * @returns React Query query object with getFolderData function
 */
export const useGetFolderData = ({ input, queryConfig }: UseGetFolderDataOptions) => {
  return useQuery({
    ...getFolderDataQueryOptions(input),
    ...queryConfig,
  });
};
