'use client';

import { useUpdateDocument } from '@/api/documents/update-document';
import FormLayout from '@/components/shared/form-layout';
import { Form } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { getFolderIdFromPath } from '@/lib/url-validation';
import { useFormActions, useSelectedFSEntry } from '@/store/form-store';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { usePathname } from 'next/navigation';
import React from 'react';

export type DocumentFormInputs = {
  description: string;
};

const EditDocumentForm = () => {
  const pathname = usePathname();
  const { addNotification } = useNotifications();
  const { closeEditDocumentDialog, setSelectedFSEntry } = useFormActions();

  const selectedFSEntry = useSelectedFSEntry();
  const { id: selectedDocumentId, description } = selectedFSEntry ?? {};

  const updateDocumentMutation = useUpdateDocument({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Document Updated',
        });
        setSelectedFSEntry(null);
        closeEditDocumentDialog();
      },
    },
  });

  const onSubmit = (data: DocumentFormInputs) => {
    const folderIdFromPath = getFolderIdFromPath(pathname);

    if (!selectedDocumentId) {
      addNotification({
        type: 'error',
        title: 'No document selected for editing',
      });
      return;
    }

    updateDocumentMutation.mutate({
      id: selectedDocumentId,
      description: data.description,
      parentFolderId: folderIdFromPath,
    });
  };

  return (
    <FormLayout
      closeDialog={closeEditDocumentDialog}
      headerIcon={<CreateNewFolderIcon color="primary" />}
      headerTitle="Edit Document"
    >
      <Form<DocumentFormInputs>
        defaultValues={{
          description: description ?? '',
        }}
        fields={[
          {
            name: 'description',
            label: 'Description',
            placeholder: 'Folder description',
          },
        ]}
        onSubmit={onSubmit}
        submitButtonText="Edit Document"
        isLoading={updateDocumentMutation.isPending}
      />
    </FormLayout>
  );
};

export default EditDocumentForm;
