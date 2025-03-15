import { MutationConfig } from '@/config/react-query-config';
import { apiPost } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { CreateFolderSchema, FolderResponse } from '@/models/folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Creates a new folder via API call
 *
 * @param input - Folder creation payload that conforms to CreateFolderSchema
 * @returns Promise containing the folder response data
 */
export const createFolder = (input: CreateFolderSchema): Promise<FolderResponse> => {
  return apiPost(`folders`, {
    json: input,
  });
};

/**
 * Options for the useCreateFolder hook
 *
 * @property mutationConfig - Configuration for the mutation hook
 */
type UseCreateFolderOptions = {
  mutationConfig?: MutationConfig<typeof createFolder>;
};

/**
 * Custom hook for folder creation operations with automatic cache invalidation
 *
 * This hook wraps the folder creation API call with React Query's useMutation,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useCreateFolder();
 *
 * const handleCreateFolder = () => {
 *   mutate({ name: 'New Folder' });
 * };
 * ```
 *
 * @param options - Configuration options for the mutation
 * @returns React Query mutation object with createFolder function
 */
export const useCreateFolder = ({ mutationConfig }: UseCreateFolderOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (response, variables, context) => {
      const { parentId } = variables;
      queryClient.invalidateQueries({
        queryKey: [cacheKeys.fsentries],
      });

      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.folders, { folderId: parentId }],
          exact: false,
        });
      }

      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: createFolder,
  });
};
