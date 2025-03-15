'use client';

import { create } from 'zustand';

interface HomeFSEntriesActions {
  setPaginationModel: (_: number, __: number) => void;
  setSearchQuery: (_: string) => void;
}

interface HomeFSEntriesStore {
  page: number;
  pageSize: number;
  searchQuery: string;
  actions: HomeFSEntriesActions;
  initializeStore: () => void;
}

const useHomeFSEntriesStore = create<HomeFSEntriesStore>()(set => ({
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
  const page = useHomeFSEntriesStore(state => state.page);
  const pageSize = useHomeFSEntriesStore(state => state.pageSize);

  return { page, pageSize };
};

export const useSearchQuery = () => useHomeFSEntriesStore(state => state.searchQuery);
export const useActions = () => useHomeFSEntriesStore(state => state.actions);
