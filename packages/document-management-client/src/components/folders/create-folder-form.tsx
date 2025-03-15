'use client';

import { useCreateFolder } from '@/api/folders/create-folder';
import FormLayout from '@/components/shared/form-layout';
import { Form } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { useFormActions } from '@/store/form-store';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { usePathname } from 'next/navigation';
import React from 'react';

export type FolderFormInputs = {
  name: string;
  description: string;
};

const CreateFolderForm = () => {
  const pathname = usePathname();

  const { setIsCreateFolderDialogOpen } = useFormActions();
  const { addNotification } = useNotifications();

  const createFolderMutation = useCreateFolder({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Folder Created',
        });
        setIsCreateFolderDialogOpen(false);
      },
    },
  });

  const onSubmit = (data: FolderFormInputs) => {
    // Get the parent folder id from the pathname
    const isFoldersRoute = pathname?.startsWith('/folders/');
    const parentId = isFoldersRoute ? Number(pathname.split('/')[2]) : undefined;

    createFolderMutation.mutate({
      name: data.name,
      description: data.description,
      parentId,
    });
  };

  return (
    <FormLayout
      closeDialog={() => setIsCreateFolderDialogOpen(false)}
      headerIcon={<CreateNewFolderIcon color="primary" />}
      headerTitle="Create New Folder"
    >
      <Form<FolderFormInputs>
        defaultValues={{
          name: '',
          description: '',
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
        submitButtonText="Create Folder"
        isLoading={createFolderMutation.isPending}
      />
    </FormLayout>
  );
};

export default CreateFolderForm;
