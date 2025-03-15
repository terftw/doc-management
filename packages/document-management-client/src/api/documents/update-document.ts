import { MutationConfig } from '@/config/react-query-config';
import { apiPatch } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { DocumentResponse, UpdateDocumentSchema } from '@/models/document';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Updates a document via API call
 *
 * @param input - Document update payload that conforms to UpdateDocumentSchema
 * @returns Promise containing the updated document response data
 */
export const updateDocument = (input: UpdateDocumentSchema): Promise<DocumentResponse> => {
  // We only included parentId for cache invalidation purposes so it is excluded from the request

  return apiPatch(`documents/${input.id}`, {
    json: { description: input.description },
  });
};

/**
 * Options for the useUpdateDocument hook
 *
 * @property mutationConfig - Configuration for the mutation hook
 */
type UseUpdateDocumentOptions = {
  mutationConfig?: MutationConfig<typeof updateDocument>;
};

/**
 * Custom hook for document update operations with automatic cache invalidation
 *
 * This hook wraps the document update API call with React Query's useMutation,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useUpdateDocument();
 *
 * const handleUpdateDocument = () => {
 *   mutate({ id: 'document-123', description: 'Updated description' });
 * };
 * ```
 *
 * @param options - Configuration options for the mutation
 * @returns React Query mutation object with updateDocument function
 */
export const useUpdateDocument = ({ mutationConfig }: UseUpdateDocumentOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (response, variables, context) => {
      // parentFolderId represents the folder that the document was updated in aka parent folder
      const { parentFolderId } = variables;

      // Invalidate queries related to the specific folder
      if (parentFolderId) {
        queryClient.invalidateQueries({
          queryKey: [cacheKeys.folders, { folderId: parentFolderId }],
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
    mutationFn: updateDocument,
  });
};
