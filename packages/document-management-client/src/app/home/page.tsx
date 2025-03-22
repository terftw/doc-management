'use client';

import { useFSEntries } from '@/api/fsentries/get-fsentries';
import FSEntryActionModals from '@/components/fsentries/fsentry-action-modals';
import FSEntryTable from '@/components/fsentries/fsentry-table';
import SearchBar from '@/components/shared/search-bar';
import UploadToolbar from '@/components/shared/upload-toolbar';
import { DEBOUNCE_TIME } from '@/lib/debounce-const';
import { useActions, usePageStates, useSearchQuery } from '@/store/home-fsentries-store';
import { Box, Paper, Stack, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Page states
  const { page, pageSize } = usePageStates();
  const searchQuery = useSearchQuery();
  const { setPaginationModel, setSearchQuery } = useActions();

  const [debouncedSearchQuery] = useDebounce(searchQuery, DEBOUNCE_TIME);

  useEffect(
    function resetPaginationOnSearch() {
      setPaginationModel(1, pageSize);
    },
    [debouncedSearchQuery, setPaginationModel, pageSize],
  );

  const { data: fsentriesResponse, isLoading } = useFSEntries({
    input: {
      page,
      pageSize,
      searchQuery: debouncedSearchQuery,
    },
  });

  const fsentries = fsentriesResponse?.data || [];
  const totalItems = fsentriesResponse?.metadata?.totalCount || 0;

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
        <UploadToolbar title="Documents" />
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
            <Box sx={{ overflowX: 'auto' }}>
              <FSEntryTable
                fsentries={fsentries}
                totalItems={totalItems}
                isLoading={isLoading}
                page={page}
                pageSize={pageSize}
                setPaginationModel={setPaginationModel}
              />
            </Box>
          </Stack>
        </Paper>
      </Box>
      <FSEntryActionModals />
    </Box>
  );
};

export default HomePage;
