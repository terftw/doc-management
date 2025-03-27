import { useFormActions, useSelectedFSEntry } from '@/store/form-store';

export const useDocumentFormState = () => {
  const {
    setIsUploadFileDialogOpen,
    closeEditDocumentDialog,
    closeDeleteDocumentDialog,
    setSelectedFSEntry,
  } = useFormActions();

  const selectedFSEntry = useSelectedFSEntry();

  return {
    setIsUploadFileDialogOpen,
    closeDeleteDocumentDialog,
    closeEditDocumentDialog,
    selectedFSEntry,
    setSelectedFSEntry,
  };
};
