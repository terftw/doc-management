import DeleteDocumentForm from '@/components/documents/delete-document-form';
import EditDocumentForm from '@/components/documents/edit-document-form';
import UploadDocForm from '@/components/documents/upload-doc-form';
import CreateFolderForm from '@/components/folders/create-folder-form';
import EditFolderForm from '@/components/folders/edit-folder-form';
import { useDialogStates } from '@/store/form-store';
import { Dialog } from '@mui/material';
import React from 'react';

const FSEntryActionModals = () => {
  const {
    isCreateFolderDialogOpen,
    isEditFolderDialogOpen,
    isUploadFileDialogOpen,
    isEditDocumentDialogOpen,
    isDeleteDocumentDialogOpen,
  } = useDialogStates();

  return (
    <>
      <Dialog open={isUploadFileDialogOpen}>
        <UploadDocForm />
      </Dialog>
      <Dialog open={isCreateFolderDialogOpen}>
        <CreateFolderForm />
      </Dialog>
      <Dialog open={isEditFolderDialogOpen}>
        <EditFolderForm />
      </Dialog>
      <Dialog open={isEditDocumentDialogOpen}>
        <EditDocumentForm />
      </Dialog>
      <Dialog open={isDeleteDocumentDialogOpen}>
        <DeleteDocumentForm />
      </Dialog>
    </>
  );
};

export default FSEntryActionModals;
