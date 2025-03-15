import { QueryConfig } from '@/config/react-query-config';
import { apiGet } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { FSEntriesResponse, GetFSEntriesSchema } from '@/models/fsentry';
import { queryOptions, useQuery } from '@tanstack/react-query';

/**
 * Retrieves file system entries from the API
 *
 * @param input - File system entries retrieval payload that conforms to GetFSEntriesSchema
 * @returns Promise containing the file system entries response
 */
export const getFSEntries = async (input: GetFSEntriesSchema): Promise<FSEntriesResponse> => {
  return apiGet('fsentries', {
    searchParams: {
      page: input.page,
      pageSize: input.pageSize,
      searchQuery: input.searchQuery ?? '',
    },
  });
};

/**
 * Options for the getFSEntries query
 *
 * @param input - File system entries retrieval payload that conforms to GetFSEntriesSchema
 * @returns Query options for the getFSEntries query
 */
export const getFSEntriesQueryOptions = (input: GetFSEntriesSchema) => {
  return queryOptions({
    queryKey: [cacheKeys.fsentries, input],
    queryFn: () => getFSEntries(input),
  });
};

/**
 * Options for the useFSEntries hook
 *
 * @param input - File system entries retrieval payload that conforms to GetFSEntriesSchema
 * @returns Query options for the getFSEntries query
 */
type UseFSEntriesOptions = {
  input: GetFSEntriesSchema;
  queryConfig?: QueryConfig<typeof getFSEntriesQueryOptions>;
};

/**
 * Custom hook for file system entries retrieval with automatic cache invalidation
 *
 * This hook wraps the file system entries retrieval API call with React Query's useQuery,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useFSEntries({ input: { folderId: 1 } });
 * ```
 *
 * @param options - Configuration options for the query
 * @returns React Query query object with getFSEntries function
 */
export const useFSEntries = ({ input, queryConfig }: UseFSEntriesOptions) => {
  return useQuery({
    ...getFSEntriesQueryOptions(input),
    placeholderData: previousData => previousData,
    ...queryConfig,
  });
};
