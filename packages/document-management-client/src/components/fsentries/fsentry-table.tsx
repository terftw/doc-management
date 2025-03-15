import { Table, TableRowMenuItems } from '@/components/ui/table';
import { FSEntry } from '@/models/fsentry';
import { useFormActions } from '@/store/form-store';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useState } from 'react';

import { useGetFSEntryTableColumns } from './fsentry-table-columns';

interface MenuState {
  anchorEl: HTMLElement | null;
  selectedId: string | null;
  selectedEntry: FSEntry | null;
}

const FSEntryTable = ({
  fsentries,
  totalItems,
  isLoading,
  page,
  pageSize,
  setPaginationModel,
}: {
  fsentries: FSEntry[];
  totalItems: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  setPaginationModel: (_: number, __: number) => void;
}) => {
  const router = useRouter();

  const {
    openEditFolderDialog,
    openEditDocumentDialog,
    openDeleteDocumentDialog,
    setSelectedFSEntry,
  } = useFormActions();

  const [menuState, setMenuState] = useState<MenuState>({
    anchorEl: null,
    selectedId: null,
    selectedEntry: null,
  });

  const handlePageChange = useCallback(
    (_: unknown, newPage: number): void => {
      setPaginationModel(newPage + 1, pageSize);
    },
    [setPaginationModel, pageSize],
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setPaginationModel(1, parseInt(event.target.value, 10));
    },
    [setPaginationModel],
  );

  const handleRowClick = (entry: FSEntry) => {
    if (entry.entryType === 'folder') {
      setSelectedFSEntry(entry);
      router.push(`/folders/${entry.id}`);
    }
  };

  const handleMenuClose = useCallback(() => {
    setMenuState({
      anchorEl: null,
      selectedId: null,
      selectedEntry: null,
    });
  }, [setMenuState]);

  const handleEditFolderClick = useCallback(
    (entry: FSEntry) => {
      if (entry.entryType === 'folder') {
        openEditFolderDialog(entry);
        handleMenuClose();
      }
    },
    [openEditFolderDialog, handleMenuClose],
  );

  const handleEditDocumentClick = useCallback(
    (entry: FSEntry) => {
      openEditDocumentDialog(entry);
      handleMenuClose();
    },
    [openEditDocumentDialog, handleMenuClose],
  );

  const handleDeleteDocumentClick = useCallback(
    (entry: FSEntry) => {
      openDeleteDocumentDialog(entry);
      handleMenuClose();
    },
    [openDeleteDocumentDialog, handleMenuClose],
  );

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, entry: FSEntry) => {
      event.stopPropagation();
      setMenuState({
        anchorEl: event.currentTarget,
        selectedId: String(entry.id),
        selectedEntry: entry,
      });
    },
    [],
  );

  const menuItems = useMemo<TableRowMenuItems[]>(() => {
    const entry = menuState.selectedEntry;
    if (!entry) return [];

    const menuOptions: Record<string, TableRowMenuItems[]> = {
      folder: [
        {
          onClick: () => handleEditFolderClick(entry),
          color: 'primary',
          icon: <EditIcon fontSize="small" />,
          text: 'Edit',
        },
      ],
      document: [
        {
          onClick: () => handleEditDocumentClick(entry),
          color: 'primary',
          icon: <EditIcon fontSize="small" />,
          text: 'Edit',
        },
        {
          onClick: () => handleDeleteDocumentClick(entry),
          color: 'error',
          icon: <DeleteOutlineIcon fontSize="small" />,
          text: 'Delete',
        },
      ],
    };

    return menuOptions[entry.entryType] || [];
  }, [
    menuState.selectedEntry,
    handleEditFolderClick,
    handleEditDocumentClick,
    handleDeleteDocumentClick,
  ]);

  const columns = useMemo<ColumnDef<FSEntry>[]>(
    () => useGetFSEntryTableColumns(handleMenuClick),
    [handleMenuClick],
  );

  return (
    <Table
      data={fsentries}
      columns={columns}
      totalItems={totalItems}
      pageSize={pageSize}
      page={page}
      isLoading={isLoading}
      emptyMessage="No files or folders available"
      handleRowClick={handleRowClick}
      handlePageChange={handlePageChange}
      handleRowsPerPageChange={handleRowsPerPageChange}
      rowsPerPageOptions={[5, 10]}
      anchorEl={menuState.anchorEl}
      handleMenuClose={handleMenuClose}
      menuItems={menuItems}
    />
  );
};

export default FSEntryTable;
