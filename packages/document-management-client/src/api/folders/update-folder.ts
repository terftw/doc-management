import { MutationConfig } from '@/config/react-query-config';
import { apiPatch } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { FolderResponse, UpdateFolderSchema } from '@/models/folder';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Updates a folder via API call
 *
 * @param input - Folder update payload that conforms to UpdateFolderSchema
 * @returns Promise containing the folder response data
 */
export const updateFolder = (input: UpdateFolderSchema): Promise<FolderResponse> => {
  // We only included parentId for cache invalidation purposes so it is excluded from the request

  return apiPatch(`folders/${input.id}`, {
    json: { name: input.name, description: input.description },
  });
};

/**
 * Options for the useUpdateFolder hook
 *
 * @property mutationConfig - Configuration for the mutation hook
 */
type UseUpdateFolderOptions = {
  mutationConfig?: MutationConfig<typeof updateFolder>;
};

/**
 * Custom hook for folder update operations with automatic cache invalidation
 *
 * This hook wraps the folder update API call with React Query's useMutation,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useUpdateFolder();
 *
 * const handleUpdateFolder = () => {
 *   mutate({ id: 'folder-123', name: 'Updated Folder' });
 * };
 * ```
 *
 * @param options - Configuration options for the mutation
 * @returns React Query mutation object with updateFolder function
 */
export const useUpdateFolder = ({ mutationConfig }: UseUpdateFolderOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (response, variables, context) => {
      const { id, parentId } = variables;
      queryClient.invalidateQueries({
        queryKey: [cacheKeys.fsentries],
      });

      if (id) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.folders, { folderId: id }],
          exact: false,
        });
      }

      if (parentId) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.folders, { folderId: parentId }],
          exact: false,
        });
      }

      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: updateFolder,
  });
};
