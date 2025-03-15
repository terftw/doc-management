import { Box, Typography, useTheme } from '@mui/material';
import { Card } from '@mui/material';
import React from 'react';

import AppLogo from '../shared/app-logo';

const FormCard = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        boxShadow:
          'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        [theme.breakpoints.up('sm')]: {
          width: '450px',
        },
        ...theme.applyStyles('dark', {
          boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        }),
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <AppLogo width={120} height={40} />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        {title}
      </Typography>
      {children}
    </Card>
  );
};

export default FormCard;
