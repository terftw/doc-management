'use client';

import { create } from 'zustand';

interface FSEntriesActions {
  setPaginationModel: (_: number, __: number) => void;
  setSearchQuery: (_: string) => void;
}

interface FSEntriesStore {
  page: number;
  pageSize: number;
  searchQuery: string;
  actions: FSEntriesActions;
  initializeStore: () => void;
}

const useFolderFSEntriesStore = create<FSEntriesStore>()(set => ({
  page: 1, // 1-based for API compatibility
  pageSize: 10,
  searchQuery: '',
  actions: {
    setPaginationModel: (page: number, pageSize: number) => set({ page, pageSize }),
    setSearchQuery: (searchQuery: string) => set({ searchQuery, page: 1 }),
  },
  initializeStore: () =>
    set({
      page: 1,
      pageSize: 10,
      searchQuery: '',
    }),
}));

export const usePageStates = () => {
  const page = useFolderFSEntriesStore(state => state.page);
  const pageSize = useFolderFSEntriesStore(state => state.pageSize);

  return { page, pageSize };
};

export const useSearchQuery = () => useFolderFSEntriesStore(state => state.searchQuery);

export const useActions = () => useFolderFSEntriesStore(state => state.actions);
