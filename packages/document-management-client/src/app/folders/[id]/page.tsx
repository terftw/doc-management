'use client';

import { useGetFolderData } from '@/api/folders/get-folder-data';
import FSEntryActionModals from '@/components/fsentries/fsentry-action-modals';
import FSEntryTable from '@/components/fsentries/fsentry-table';
import SearchBar from '@/components/shared/search-bar';
import UploadToolbar from '@/components/shared/upload-toolbar';
import { DEBOUNCE_TIME } from '@/lib/debounce-const';
import { folderDepth, folderMaxChildren } from '@/models/folder';
import { useActions, usePageStates, useSearchQuery } from '@/store/folder-fsentries-store';
import { useFormActions } from '@/store/form-store';
import { Home } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, IconButton, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { notFound, useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const FolderPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Page states
  const { page, pageSize } = usePageStates();
  const searchQuery = useSearchQuery();
  const { setPaginationModel, setSearchQuery } = useActions();

  // Form states
  const { setSelectedFSEntry } = useFormActions();

  // Debounced search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, DEBOUNCE_TIME);

  const {
    data: folderDataResponse,
    isLoading,
    error,
  } = useGetFolderData({
    input: { folderId: Number(id), page, pageSize, searchQuery: debouncedSearchQuery },
  });

  if (error) {
    notFound();
  }

  const fsentries = folderDataResponse?.data || [];
  const totalItems = folderDataResponse?.metadata?.totalCount || 0;
  const folder = folderDataResponse?.metadata?.folder;
  const { name, depth = 0 } = folder ?? {};
  const childrenCount = folderDataResponse?.metadata?.childrenCount || 0;

  /**
   * Folder creation limit, we hide the create folder button
   * if the folder is at the max depth or has the max number of children
   */
  const hasReachedCreationLimit = depth >= folderDepth || childrenCount >= folderMaxChildren;

  const handleGoBack = useCallback(() => {
    setSelectedFSEntry(null);
    router.back();
  }, [router, setSelectedFSEntry]);

  const handleGoHome = useCallback(() => {
    setSelectedFSEntry(null);
    router.push('/home');
  }, [router, setSelectedFSEntry]);

  useEffect(
    function resetPaginationOnSearch() {
      setPaginationModel(1, pageSize);
    },
    [debouncedSearchQuery, setPaginationModel, pageSize],
  );

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 4 }}>
          <IconButton
            onClick={handleGoBack}
            aria-label="back"
            sx={{ mr: 1, color: 'primary.main' }}
          >
            <ArrowBackIcon />
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
        <UploadToolbar
          title={name}
          disableFolderCreation={hasReachedCreationLimit}
          folder={folder}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          py: 2,
          px: isMobile ? 1 : 2,
        }}
      >
        <Paper
          sx={{
            width: '100%',
            mb: 2,
            p: isMobile ? 1 : 2,
            height: 'auto',
          }}
        >
          <Stack spacing={2}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <FSEntryTable
              fsentries={fsentries}
              totalItems={totalItems}
              isLoading={isLoading}
              page={page}
              pageSize={pageSize}
              setPaginationModel={setPaginationModel}
            />
          </Stack>
        </Paper>
      </Box>
      <FSEntryActionModals />
    </Box>
  );
};

export default FolderPage;
