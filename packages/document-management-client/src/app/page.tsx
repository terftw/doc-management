'use client';

import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import React from 'react';

const LandingPage = () => {
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  return (
    <Container
      sx={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography component="h1" variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Document Management
        </Typography>

        <Typography variant="h5" color="text.secondary" gutterBottom>
          Easy way to manage your documents
        </Typography>
      </Box>

      <Stack spacing={2} direction="column" sx={{ width: '100%', maxWidth: 400 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<HowToRegIcon />}
          fullWidth
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
        <Button variant="text" color="secondary" size="small" fullWidth onClick={handleLogin}>
          Already have an account? Login
        </Button>
      </Stack>
    </Container>
  );
};

export default LandingPage;
