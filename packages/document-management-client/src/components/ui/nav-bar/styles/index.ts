export const APPBAR_STYLES = {
  bgcolor: '#FCFCFC',
  borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
} as const;

export const NAV_BUTTON_STYLES = {
  my: 2,
  color: '#1E88E5',
  display: 'block',
  fontWeight: 600,
} as const;

export const ICON_BUTTON_STYLES = {
  '&.MuiButtonBase-root:hover': {
    bgcolor: 'transparent',
  },
} as const;
