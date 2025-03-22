import { Close } from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        padding: isMobile ? theme.spacing(2) : theme.spacing(3),
        minWidth: isMobile ? '100%' : 500,
        maxWidth: isMobile ? '100vw' : 'auto',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 1,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              flexGrow: 1,
              minWidth: isMobile ? '80%' : 'auto',
            }}
          >
            {headerIcon}
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              fontWeight="600"
              sx={{
                wordBreak: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {headerTitle}
            </Typography>
          </Stack>
          <IconButton
            onClick={closeDialog}
            sx={{
              '&:hover': {
                background: 'none',
              },
              ml: 'auto',
            }}
            size={isMobile ? 'small' : 'medium'}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: isMobile ? 2 : 3 }} />
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: isMobile ? 'calc(100vh - 150px)' : 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default FormLayout;
