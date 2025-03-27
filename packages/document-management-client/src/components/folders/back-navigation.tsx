import { ArrowBack, Home } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface BackNavigationProps {
  beforeBackNavigation: () => void;
  beforeHomeNavigation: () => void;
}

const BackNavigation = ({ beforeBackNavigation, beforeHomeNavigation }: BackNavigationProps) => {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    beforeBackNavigation();
    router.back();
  }, [router, beforeBackNavigation]);

  const handleGoHome = useCallback(() => {
    beforeHomeNavigation();
    router.push('/home');
  }, [router, beforeHomeNavigation]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 4 }}>
      <IconButton onClick={handleGoBack} aria-label="back" sx={{ mr: 1, color: 'primary.main' }}>
        <ArrowBack />
      </IconButton>
      <Typography variant="body1" color="text.secondary">
        Go back or
      </Typography>
      <IconButton
        onClick={handleGoHome}
        aria-label="back"
        sx={{ color: 'primary.main', '&:hover': { background: 'none' } }}
      >
        <Home sx={{ mr: 1 }} />
        <Typography variant="body1" color="text.secondary">
          Home
        </Typography>
      </IconButton>
    </Box>
  );
};

export default BackNavigation;
