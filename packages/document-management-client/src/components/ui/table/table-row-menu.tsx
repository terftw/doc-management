import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { TableRowMenuItems } from './types';

export const TableRowMenu = ({
  anchorEl,
  handleClose,
  menuItems,
}: {
  anchorEl: null | HTMLElement;
  handleClose: () => void;
  menuItems: TableRowMenuItems[];
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      slotProps={{
        root: {
          sx: {
            marginTop: '-8px',
            marginLeft: '8px',
          },
        },
        paper: {
          elevation: 3,
          sx: {
            minWidth: 90,
            borderRadius: 1,
            mt: 0.5,
            left: 0,
          },
        },
      }}
    >
      {menuItems.map(item => (
        <MenuItem key={item.text} onClick={item.onClick} sx={{ color: item.color }}>
          <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
          <ListItemText>{item.text}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};
