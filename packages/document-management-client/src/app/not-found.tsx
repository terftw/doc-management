'use client';

import { useUser } from '@/contexts/user-context';
import { Box, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import React from 'react';

const NotFoundPage = () => {
  const { user } = useUser();

  const redirectLink = user ? '/home' : '/';

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404 - Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        Sorry, the page you are looking for does not exist.
      </Typography>
      <Link href={redirectLink} variant="body1">
        Go to Home
      </Link>
    </Box>
  );
};

export default NotFoundPage;
