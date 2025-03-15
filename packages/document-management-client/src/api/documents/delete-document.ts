// Soft Delete
import { MutationConfig } from '@/config/react-query-config';
import { apiDelete } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { DeleteDocumentSchema } from '@/models/document';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Deletes a document via API call (soft delete)
 *
 * @param input - Document deletion payload that conforms to DeleteDocumentSchema
 * @returns Promise containing nothing, except for a 204 No Content response
 */
export const deleteDocument = (input: DeleteDocumentSchema): Promise<void> => {
  // We only included folderId for cache invalidation purposes
  const { id } = input;
  return apiDelete(`documents/${id}`);
};

/**
 * Options for the useDeleteDocument hook
 *
 * @property mutationConfig - Configuration for the mutation hook
 */
type UseDeleteDocumentOptions = {
  mutationConfig?: MutationConfig<typeof deleteDocument>;
};

/**
 * Custom hook for document deletion operations with automatic cache invalidation
 *
 * This hook wraps the document deletion API call with React Query's useMutation,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useDeleteDocument();
 *
 * const handleDeleteDocument = () => {
 *   mutate({ id: 'document-123', folderId: 'folder-123' });
 * };
 * ```
 *
 * @param options - Configuration options for the mutation
 * @returns React Query mutation object with deleteDocument function
 */
export const useDeleteDocument = ({ mutationConfig }: UseDeleteDocumentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (response, variables, context) => {
      // folderId represents the folder that the document was deleted from aka parent folder
      const folderId = variables.folderId;

      // Invalidate queries related to the specific folder
      if (folderId) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.folders, { folderId: folderId }],
          exact: false,
        });
      }

      // Invalidate queries related to the file system entries
      queryClient.invalidateQueries({
        queryKey: [cacheKeys.fsentries],
      });

      onSuccess?.(response, variables, context);
    },
    ...restConfig,
    mutationFn: deleteDocument,
  });
};
