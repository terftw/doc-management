import { Close } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';

const FormLayout = ({
  children,
  closeDialog,
  headerIcon,
  headerTitle,
}: {
  children: React.ReactNode;
  closeDialog: () => void;
  headerIcon: React.ReactNode;
  headerTitle: string;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', padding: theme.spacing(3), minWidth: 500 }}>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 1,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            {headerIcon}
            <Typography variant="h5" fontWeight="600">
              {headerTitle}
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDialog}
            sx={{
              '&:hover': {
                background: 'none',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {children}
      </Box>
    </Box>
  );
};

export default FormLayout;
