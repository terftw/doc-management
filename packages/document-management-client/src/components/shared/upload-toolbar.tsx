import { Folder } from '@/models/folder';
import { FSEntry } from '@/models/fsentry';
import { useFormActions, useSelectedFSEntry } from '@/store/form-store';
import { Add, CloudUpload, Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonProps,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { memo, useMemo } from 'react';

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

interface UploadToolbarProps {
  title?: string;
  disableFolderCreation?: boolean;
  folder?: Folder;
}

const MobileButtons = ({ configs }: { configs: ButtonConfig[] }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 1 }}>
    {configs.map((config, index) => (
      <Button
        key={index}
        fullWidth
        variant={config.variant}
        color={config.color}
        startIcon={config.icon}
        sx={{ ...config.sx, justifyContent: 'flex-start' }}
        onClick={config.onClick}
      >
        {config.text}
      </Button>
    ))}
  </Box>
);

const DesktopButtons = ({ configs }: { configs: ButtonConfig[] }) => (
  <Box sx={{ display: 'flex', gap: 2 }}>
    {configs.map((config, index) => (
      <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
        <Button
          variant={config.variant}
          color={config.color}
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
);

const UploadToolbar = memo(
  ({ title = 'Documents', disableFolderCreation = false, folder }: UploadToolbarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { setIsCreateFolderDialogOpen, openEditFolderDialog, setIsUploadFileDialogOpen } =
      useFormActions();
    const selectedFSEntry = useSelectedFSEntry();
    const { addNotification } = useNotifications();

    const handleCreateFolder = () => setIsCreateFolderDialogOpen(true);

    const handleEditFolder = () => {
      const fsEntry = (folder as FSEntry) ?? selectedFSEntry;
      if (fsEntry) {
        openEditFolderDialog(fsEntry);
      } else {
        addNotification({
          type: 'error',
          title: 'No folder selected for folder edit',
        });
      }
    };

    const handleUploadFiles = () => setIsUploadFileDialogOpen(true);

    const buttonConfigs = useMemo<ButtonConfig[]>(
      () => [
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
      ],
      [folder, disableFolderCreation, handleUploadFiles, handleCreateFolder, handleEditFolder],
    );

    const visibleConfigs = useMemo(
      () => buttonConfigs.filter(config => config.show),
      [buttonConfigs],
    );

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 1 : 0,
          paddingTop: isMobile ? 2 : 4,
        }}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} component="div" sx={{ mb: isMobile ? 2 : 0 }}>
          {title}
        </Typography>

        {isMobile ? (
          <MobileButtons configs={visibleConfigs} />
        ) : (
          <DesktopButtons configs={visibleConfigs} />
        )}
      </Toolbar>
    );
  },
);

export default UploadToolbar;
