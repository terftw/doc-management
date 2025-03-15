import { Folder } from '@/models/folder';
import { FSEntry } from '@/models/fsentry';
import { useFormActions, useSelectedFSEntry } from '@/store/form-store';
import { Add, CloudUpload, Edit } from '@mui/icons-material';
import { Box, Button, ButtonProps, Toolbar, Typography } from '@mui/material';
import React, { useCallback } from 'react';

import { useNotifications } from '../ui/notifications';

type ButtonConfig = {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'outlined' | 'contained' | 'text';
  color: 'primary' | 'inherit' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  caption?: string;
  show: boolean;
  sx?: ButtonProps['sx'];
};

const UploadToolbar = ({
  title = 'Documents',
  disableFolderCreation = false,
  folder,
}: {
  title?: string;
  disableFolderCreation?: boolean;
  folder?: Folder;
}) => {
  const { setIsCreateFolderDialogOpen, openEditFolderDialog, setIsUploadFileDialogOpen } =
    useFormActions();
  const selectedFSEntry = useSelectedFSEntry();
  const { addNotification } = useNotifications();

  const handleCreateFolder = useCallback(() => {
    setIsCreateFolderDialogOpen(true);
  }, [setIsCreateFolderDialogOpen]);

  const handleEditFolder = useCallback(() => {
    const fsEntry = (folder as FSEntry) ?? selectedFSEntry;

    if (fsEntry) {
      openEditFolderDialog(fsEntry);
    } else {
      addNotification({
        type: 'error',
        title: 'No folder selected for folder edit',
      });
    }
  }, [openEditFolderDialog, selectedFSEntry, folder, addNotification]);

  const handleUploadFiles = useCallback(() => {
    setIsUploadFileDialogOpen(true);
  }, [setIsUploadFileDialogOpen]);

  const buttonConfigs: ButtonConfig[] = [
    {
      text: 'Upload files',
      icon: <CloudUpload />,
      onClick: handleUploadFiles,
      variant: 'outlined',
      color: 'primary',
      caption: folder ? 'Add files to current folder' : '',
      show: true,
      sx: { borderRadius: '4px', backgroundColor: 'white' },
    },
    {
      text: 'Add new folder',
      icon: <Add />,
      onClick: handleCreateFolder,
      variant: 'contained',
      color: 'primary',
      caption: folder ? 'Create subfolder in current folder' : '',
      show: !disableFolderCreation,
      sx: { borderRadius: '4px' },
    },
    {
      text: 'Edit folder',
      icon: <Edit />,
      onClick: handleEditFolder,
      variant: 'contained',
      color: 'primary',
      caption: folder ? 'Edit current folder' : '',
      show: !!folder,
      sx: { borderRadius: '4px' },
    },
  ];

  return (
    <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, justifyContent: 'space-between' }}>
      <Typography variant="h4" component="div">
        {title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {buttonConfigs
          .filter(config => config.show)
          .map((config, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
              <Button
                variant={config.variant as 'outlined' | 'contained' | 'text'}
                color={
                  config.color as
                    | 'primary'
                    | 'inherit'
                    | 'secondary'
                    | 'success'
                    | 'error'
                    | 'info'
                    | 'warning'
                }
                startIcon={config.icon}
                sx={config.sx}
                onClick={config.onClick}
              >
                {config.text}
              </Button>
              {config.caption && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {config.caption}
                </Typography>
              )}
            </Box>
          ))}
      </Box>
    </Toolbar>
  );
};

export default UploadToolbar;
