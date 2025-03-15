import { Dialog as MuiDialog, styled } from '@mui/material';

export const Dialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiPaper-root': { width: '500px' },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));
