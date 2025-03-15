import { WarningAmber } from '@mui/icons-material';
import { Paper } from '@mui/material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material';
import React from 'react';

const WarningMessage = ({ documentName }: { documentName: string }) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        p: theme.spacing(2),
        mb: theme.spacing(3),
        backgroundColor: alpha(theme.palette.error.light, 0.1),
        borderLeft: `4px solid ${theme.palette.error.main}`,
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <WarningAmber color="error" sx={{ mt: 0.5 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="500" color="text.primary" gutterBottom>
            Warning: This action cannot be undone
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You are about to delete {documentName ? `"${documentName}"` : 'this document'}{' '}
            permanently. Once deleted, you will not be able to recover this document or its
            contents.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default WarningMessage;
