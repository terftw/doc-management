import { AccountCircle } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { memo } from 'react';

export interface UserMenuProps {
  anchorEl: HTMLElement | null;
  userName: string;
  onOpen: (_event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const UserMenu = memo(({ anchorEl, userName, onOpen, onClose, onLogout }: UserMenuProps) => (
  <div>
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={onOpen}
    >
      <AccountCircle sx={{ width: 32, height: 32 }} />
    </IconButton>
    <Menu
      id="user-menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={onClose}
      sx={{ mt: 4 }}
    >
      <MenuItem>{userName}</MenuItem>
      <MenuItem onClick={onLogout}>Logout</MenuItem>
    </Menu>
  </div>
));
