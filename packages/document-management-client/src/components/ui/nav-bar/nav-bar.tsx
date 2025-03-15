'use client';

import HomeLogo from '@/components/shared/home-logo';
import { useUser } from '@/contexts/user-context';
import { logoutUser } from '@/lib/firebase-auth-service';
import { AppBar as MUIAppBar, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

import { useNotifications } from '../notifications';
import { UserMenu } from './components';
import { useMenu } from './hooks';
import { APPBAR_STYLES } from './styles';

export const NavBar = () => {
  const { user } = useUser();
  const { addNotification } = useNotifications();

  const {
    anchorEl: userAnchorEl,
    handleOpen: handleOpenUserMenu,
    handleClose: handleCloseUserMenu,
  } = useMenu();

  const handleLogout = async () => {
    const { success, message } = await logoutUser();

    addNotification({
      title: success ? 'Success' : 'Error',
      message,
      type: success ? 'success' : 'error',
    });

    if (success) {
      location.reload();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <MUIAppBar position="static" sx={APPBAR_STYLES}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box sx={{ m: 1, ml: 2 }}>
            <HomeLogo />
          </Box>

          <UserMenu
            anchorEl={userAnchorEl}
            userName={user?.displayName ?? ''}
            onOpen={handleOpenUserMenu}
            onClose={handleCloseUserMenu}
            onLogout={handleLogout}
          />
        </Stack>
      </MUIAppBar>
    </Box>
  );
};
