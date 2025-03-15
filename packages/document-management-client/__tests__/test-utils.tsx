import theme from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';

export function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}
