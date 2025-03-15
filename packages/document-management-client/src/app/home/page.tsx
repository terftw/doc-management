'use client';

import { useFSEntries } from '@/api/fsentries/get-fsentries';
import FSEntryActionModals from '@/components/fsentries/fsentry-action-modals';
import FSEntryTable from '@/components/fsentries/fsentry-table';
import SearchBar from '@/components/shared/search-bar';
import UploadToolbar from '@/components/shared/upload-toolbar';
import { DEBOUNCE_TIME } from '@/lib/debounce-const';
import { useActions, usePageStates, useSearchQuery } from '@/store/home-fsentries-store';
import { Container, Paper, Stack } from '@mui/material';
import React, { useEffect } from 'react';
import { useDebounce } from 'use-debounce';

const HomePage = () => {
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
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Stack spacing={2}>
        <UploadToolbar title="Documents" />
        <Paper sx={{ width: '100%', mb: 2 }}>
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
      </Stack>
      <FSEntryActionModals />
    </Container>
  );
};

export default HomePage;
