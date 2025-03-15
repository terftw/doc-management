'use client';

import { useUser } from '@/contexts/user-context';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: LayoutProps) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/home');
    }
  }, [user, loading, router]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f9',
      }}
    >
      <Stack
        direction="column"
        component="main"
        sx={{
          justifyContent: 'center',
          minHeight: '100%',
        }}
      >
        <Stack
          direction={{ xs: 'column-reverse', md: 'row' }}
          sx={{
            justifyContent: 'center',
            gap: { xs: 6, sm: 12 },
            p: 2,
            mx: 'auto',
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AuthLayout;
