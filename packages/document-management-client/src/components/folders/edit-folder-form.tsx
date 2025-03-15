'use client';

import { useUpdateFolder } from '@/api/folders/update-folder';
import FormLayout from '@/components/shared/form-layout';
import { Form } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { getFolderIdFromPath } from '@/lib/url-validation';
import { useFormActions, useSelectedFSEntry } from '@/store/form-store';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { usePathname } from 'next/navigation';
import React from 'react';

export type FolderFormInputs = {
  name: string;
  description: string;
};

const EditFolderForm = () => {
  const pathname = usePathname();

  const { closeEditFolderDialog } = useFormActions();
  const selectedFSEntry = useSelectedFSEntry();
  const { addNotification } = useNotifications();

  const updateFolderMutation = useUpdateFolder({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Folder Updated',
        });
        closeEditFolderDialog();
      },
    },
  });

  const { id: selectedFolderId, name, description } = selectedFSEntry ?? {};

  const onSubmit = (data: FolderFormInputs) => {
    const folderIdFromPath = getFolderIdFromPath(pathname);
    const folderId = selectedFolderId ?? folderIdFromPath ?? null;
    const parentFolderId = folderIdFromPath !== folderId ? folderIdFromPath : null;

    if (!folderId) {
      return;
    }

    updateFolderMutation.mutate({
      id: folderId,
      name: data.name,
      description: data.description,
      parentId: parentFolderId,
    });
  };

  return (
    <FormLayout
      closeDialog={closeEditFolderDialog}
      headerIcon={<CreateNewFolderIcon color="primary" />}
      headerTitle="Edit Folder"
    >
      <Form<FolderFormInputs>
        defaultValues={{
          name: name ?? '',
          description: description ?? '',
        }}
        fields={[
          {
            name: 'name',
            label: 'Name',
            placeholder: 'Folder name',
            required: true,
            validation: {
              required: 'Name is required',
            },
          },
          {
            name: 'description',
            label: 'Description',
            placeholder: 'Folder description',
          },
        ]}
        onSubmit={onSubmit}
        submitButtonText="Edit Folder"
        isLoading={updateFolderMutation.isPending}
      />
    </FormLayout>
  );
};

export default EditFolderForm;
