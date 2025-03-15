'use client';

import { useCreateDocument } from '@/api/documents/create-document';
import DropzoneFormField from '@/components/shared/dropzone-form-field';
import FormLayout from '@/components/shared/form-layout';
import { Form } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { getFileExtension, getFileSizeInKB } from '@/lib/file-data-processing';
import { useFormActions } from '@/store/form-store';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { usePathname } from 'next/navigation';
import React from 'react';

export type DocumentFormInputs = {
  file: File | null;
  description: string;
};

const UploadDocForm = () => {
  const pathname = usePathname();

  const { setIsUploadFileDialogOpen } = useFormActions();
  const { addNotification } = useNotifications();

  const createDocumentMutation = useCreateDocument({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Document Uploaded',
        });
        setIsUploadFileDialogOpen(false);
      },
    },
  });

  const onSubmit = (data: DocumentFormInputs) => {
    const { file, description } = data;
    if (!file) {
      addNotification({
        type: 'error',
        title: 'No file selected for upload',
      });
      return;
    }

    const isFoldersRoute = pathname?.startsWith('/folders/');

    const folderId = isFoldersRoute ? Number(pathname.split('/')[2]) : undefined;

    createDocumentMutation.mutate({
      name: file.name,
      fileExtension: getFileExtension(file.name),
      fileSize: getFileSizeInKB(file.size),
      folderId,
      description,
    });
  };

  return (
    <FormLayout
      closeDialog={() => setIsUploadFileDialogOpen(false)}
      headerIcon={<UploadFileIcon color="primary" />}
      headerTitle="Upload Document"
    >
      <Form<DocumentFormInputs>
        defaultValues={{
          file: null,
          description: '',
        }}
        fields={[
          {
            name: 'file',
            label: 'Name',
            placeholder: 'Folder name',
            required: true,
            validation: {
              required: 'Please select a file',
            },
            renderField: (field, errors) => (
              <DropzoneFormField
                value={field.value instanceof File ? field.value : null}
                onChange={field.onChange}
                error={!!errors}
                helperText={errors}
              />
            ),
          },
          {
            name: 'description',
            label: 'Description',
            placeholder: 'Folder description',
          },
        ]}
        onSubmit={onSubmit}
        submitButtonText="Upload Document"
        isLoading={createDocumentMutation.isPending}
      />
    </FormLayout>
  );
};

export default UploadDocForm;
