import { FSEntry } from '@/models/fsentry';
import { create } from 'zustand';

interface FormActions {
  setSelectedFSEntry: (_entry: FSEntry | null) => void;
  setIsCreateFolderDialogOpen: (_isOpen: boolean) => void;
  setIsUploadFileDialogOpen: (_isOpen: boolean) => void;
  openEditFolderDialog: (_entry: FSEntry) => void;
  openEditDocumentDialog: (_entry: FSEntry) => void;
  openDeleteDocumentDialog: (_entry: FSEntry) => void;
  closeEditFolderDialog: () => void;
  closeEditDocumentDialog: () => void;
  closeDeleteDocumentDialog: () => void;
}

interface FormState {
  selectedFSEntry: FSEntry | null;
  isCreateFolderDialogOpen: boolean;
  isUploadFileDialogOpen: boolean;
  isEditFolderDialogOpen: boolean;
  isEditDocumentDialogOpen: boolean;
  isDeleteDocumentDialogOpen: boolean;
  actions: FormActions;
}

const useFormState = create<FormState>(set => ({
  selectedFSEntry: null,
  isCreateFolderDialogOpen: false,
  isUploadFileDialogOpen: false,
  isEditFolderDialogOpen: false,
  isEditDocumentDialogOpen: false,
  isDeleteDocumentDialogOpen: false,

  actions: {
    setSelectedFSEntry: (entry: FSEntry | null) => set({ selectedFSEntry: entry }),
    setIsCreateFolderDialogOpen: (isOpen: boolean) => set({ isCreateFolderDialogOpen: isOpen }),
    setIsUploadFileDialogOpen: (isOpen: boolean) => set({ isUploadFileDialogOpen: isOpen }),
    openEditFolderDialog: (entry: FSEntry) =>
      set({ isEditFolderDialogOpen: true, selectedFSEntry: entry }),
    openEditDocumentDialog: (entry: FSEntry) =>
      set({ isEditDocumentDialogOpen: true, selectedFSEntry: entry }),
    openDeleteDocumentDialog: (entry: FSEntry) =>
      set({ isDeleteDocumentDialogOpen: true, selectedFSEntry: entry }),
    closeEditFolderDialog: () => set({ isEditFolderDialogOpen: false }),
    closeEditDocumentDialog: () => set({ isEditDocumentDialogOpen: false }),
    closeDeleteDocumentDialog: () => set({ isDeleteDocumentDialogOpen: false }),
  },
}));

const useSelectedFSEntry = () => useFormState(state => state.selectedFSEntry);
const useFormActions = () => useFormState(state => state.actions);
const useDialogStates = () => {
  const isCreateFolderDialogOpen = useFormState(state => state.isCreateFolderDialogOpen);
  const isUploadFileDialogOpen = useFormState(state => state.isUploadFileDialogOpen);
  const isEditFolderDialogOpen = useFormState(state => state.isEditFolderDialogOpen);
  const isEditDocumentDialogOpen = useFormState(state => state.isEditDocumentDialogOpen);
  const isDeleteDocumentDialogOpen = useFormState(state => state.isDeleteDocumentDialogOpen);

  return {
    isCreateFolderDialogOpen,
    isUploadFileDialogOpen,
    isEditFolderDialogOpen,
    isEditDocumentDialogOpen,
    isDeleteDocumentDialogOpen,
  };
};

export { useSelectedFSEntry, useFormActions, useDialogStates };
