import { MutationConfig } from '@/config/react-query-config';
import { apiPost } from '@/lib/api-client';
import { cacheKeys } from '@/lib/react-query';
import { CreateDocumentSchema, DocumentResponse } from '@/models/document';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Creates a new document via API call
 *
 * @param input - Document creation payload that conforms to CreateDocumentSchema
 * @returns Promise containing the document response data
 */
export const createDocument = (input: CreateDocumentSchema): Promise<DocumentResponse> => {
  return apiPost(`documents`, {
    json: input,
  });
};

/**
 * Options for the useCreateDocument hook
 *
 * @property mutationConfig - Configuration for the mutation hook
 */
type UseCreateDocumentOptions = {
  mutationConfig?: MutationConfig<typeof createDocument>;
};

/**
 * Custom hook for document creation operations with automatic cache invalidation
 *
 * This hook wraps the document creation API call with React Query's useMutation,
 * handling cache invalidation for the related folder and file system entries.
 *
 * @example
 * ```tsx
 * const { mutate, isLoading } = useCreateDocument();
 *
 * const handleCreateDocument = () => {
 *   mutate({
 *     folderId: 'folder-123',
 *     title: 'New Document'
 *   });
 * };
 * ```
 *
 * @param options - Configuration options for the mutation
 * @returns React Query mutation object with createDocument function
 */
export const useCreateDocument = ({ mutationConfig }: UseCreateDocumentOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (response, variables, context) => {
      // folderId represents the folder that the document was created in aka parent folder
      const folderId = variables.folderId;

      if (folderId) {
        // Invalidate queries related to the specific folder
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
    mutationFn: createDocument,
  });
};
