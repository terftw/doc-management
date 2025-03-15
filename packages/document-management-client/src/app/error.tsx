'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const ErrorPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      sx={{ backgroundColor: 'background.default', px: 2 }}
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 4 }} />

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 2,
        }}
      >
        Error
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
        An error occurred while loading this page
      </Typography>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{
          minWidth: 200,
          backgroundColor: 'background.paper',
        }}
      >
        Go Back To Main Page
      </Button>
    </Box>
  );
};

export default ErrorPage;
