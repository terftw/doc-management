'use client';

import { useDeleteDocument } from '@/api/documents/delete-document';
import FormLayout from '@/components/shared/form-layout';
import { useNotifications } from '@/components/ui/notifications';
import { Document } from '@/models/document';
import { useFormActions, useSelectedFSEntry } from '@/store/form-store';
import { Delete } from '@mui/icons-material';
import { Button, Divider, Stack, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

import WarningMessage from './warning-message';

const DeleteDocumentForm = () => {
  const theme = useTheme();
  const { addNotification } = useNotifications();
  const { closeDeleteDocumentDialog, setSelectedFSEntry } = useFormActions();
  const selectedFSEntry = useSelectedFSEntry();

  const deleteDocumentMutation = useDeleteDocument({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Document Deleted',
        });
        setSelectedFSEntry(null);
        closeDeleteDocumentDialog();
      },
    },
  });

  const {
    id: selectedDocumentId,
    name: documentName,
    folderId,
  } = (selectedFSEntry ?? {}) as Document;

  const onSubmit = () => {
    if (!selectedDocumentId) {
      addNotification({
        type: 'error',
        title: 'No document selected for deletion',
      });
      return;
    }

    deleteDocumentMutation.mutate({
      id: selectedDocumentId,
      folderId,
    });
  };

  return (
    <FormLayout
      closeDialog={closeDeleteDocumentDialog}
      headerIcon={<Delete color="error" fontSize="medium" />}
      headerTitle="Delete Document"
    >
      <Box
        sx={{
          width: '100%',
          padding: theme.spacing(3),
          paddingBottom: 0,
          minWidth: 500,
        }}
      >
        <WarningMessage documentName={documentName} />

        <Divider sx={{ mb: theme.spacing(3) }} />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={closeDeleteDocumentDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onSubmit}
            disabled={deleteDocumentMutation.isPending}
            startIcon={<Delete />}
          >
            {deleteDocumentMutation.isPending ? 'Deleting...' : 'Delete Document'}
          </Button>
        </Stack>
      </Box>
    </FormLayout>
  );
};

export default DeleteDocumentForm;
