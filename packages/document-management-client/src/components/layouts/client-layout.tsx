'use client';

import { Notifications } from '@/components/ui/notifications';
import { UserProvider } from '@/contexts/user-context';
import { FirebaseInitializer } from '@/lib/firebase';
import { getQueryClient } from '@/lib/react-query';
import theme from '@/theme';
import { Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { usePathname } from 'next/navigation';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      <FirebaseInitializer />
      <UserProvider>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Notifications />
            <Box
              sx={{
                position: 'relative',
                height: '100vh',
                width: '100%',
                overflow: 'hidden',
                ...(isAuthPage
                  ? {
                      backgroundImage: 'url("/landing-bg.svg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }
                  : {}),
              }}
            >
              {children}
            </Box>
          </ThemeProvider>
        </HelmetProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
