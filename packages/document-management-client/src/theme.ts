import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d6efd',
      dark: '#0b5ed7',
      light: '#e6f0ff',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
      disabled: '#718096',
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      color: '#1a202c',
    },
    h2: {
      fontWeight: 600,
      color: '#1a202c',
    },
    h3: {
      color: '#1a202c',
    },
    body1: {
      color: '#4a5568',
    },
    body2: {
      color: '#718096',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#0d6efd',
          '&:hover': {
            backgroundColor: '#0b5ed7',
          },
        },
        outlinedPrimary: {
          color: '#0d6efd',
          borderColor: '#0d6efd',
          '&:hover': {
            backgroundColor: '#e6f0ff',
            borderColor: '#0d6efd',
          },
        },
      },
    },
  },
});

export default theme;
