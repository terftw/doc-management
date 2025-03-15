import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useCallback } from 'react';

export type NotificationProps = {
  notification: {
    id: string;
    type: string;
    title: string;
    message?: string;
  };
  onDismiss: (_: string) => void;
};

export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
}: NotificationProps) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = useCallback(
    (_event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
      onDismiss(id);
    },
    [id, onDismiss],
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={type as 'info' | 'warning' | 'success' | 'error'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        <strong>{title}</strong>
        {message && <div>{message}</div>}
      </Alert>
    </Snackbar>
  );
};
