import UploadToolbar from '@/components/shared/upload-toolbar';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { folderFixtures } from '../../fixtures/shared/folder.fixtures';
import { formStoreFixtures } from '../../fixtures/shared/form-store.fixtures';
import { renderWithTheme } from '../../test-utils';

const {
  mockSetIsCreateFolderDialogOpen,
  mockOpenEditFolderDialog,
  mockSetIsUploadFileDialogOpen,
  mockUseSelectedFSEntry,
} = formStoreFixtures;

const { mockFolder } = folderFixtures;

const mockAddNotification = jest.fn();

jest.mock('@/store/form-store', () => ({
  __esModule: true,
  useFormActions: () => ({
    setIsCreateFolderDialogOpen: mockSetIsCreateFolderDialogOpen,
    openEditFolderDialog: mockOpenEditFolderDialog,
    setIsUploadFileDialogOpen: mockSetIsUploadFileDialogOpen,
  }),
  useSelectedFSEntry: () => mockUseSelectedFSEntry(),
}));

jest.mock('@/components/ui/notifications', () => ({
  useNotifications: () => ({
    addNotification: mockAddNotification,
  }),
}));

describe('UploadToolbar', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders with default title', () => {
    renderWithTheme(<UploadToolbar />);
    expect(screen.getByText('Documents')).toBeInTheDocument();
  });

  test('renders with custom title', () => {
    renderWithTheme(<UploadToolbar title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  test('renders upload button', () => {
    renderWithTheme(<UploadToolbar />);
    expect(screen.getByText('Upload files')).toBeInTheDocument();
  });

  test('renders add new folder button when not disabled', () => {
    renderWithTheme(<UploadToolbar />);
    expect(screen.getByText('Add new folder')).toBeInTheDocument();
  });

  test('does not render add new folder button when disabled', () => {
    renderWithTheme(<UploadToolbar disableFolderCreation />);
    expect(screen.queryByText('Add new folder')).not.toBeInTheDocument();
  });

  test('renders edit folder button when in folder', () => {
    renderWithTheme(<UploadToolbar folder={mockFolder} />);
    expect(screen.getByText('Edit folder')).toBeInTheDocument();
  });

  test('does not render edit folder button when not in folder', () => {
    renderWithTheme(<UploadToolbar />);
    expect(screen.queryByText('Edit folder')).not.toBeInTheDocument();
  });

  test('renders help text under buttons when in folder', () => {
    renderWithTheme(<UploadToolbar folder={mockFolder} />);
    expect(screen.getByText('Add files to current folder')).toBeInTheDocument();
    expect(screen.getByText('Create subfolder in current folder')).toBeInTheDocument();
    expect(screen.getByText('Edit current folder')).toBeInTheDocument();
  });

  test('does not render help text when not in folder', () => {
    renderWithTheme(<UploadToolbar />);
    expect(screen.queryByText('Add files to current folder')).not.toBeInTheDocument();
    expect(screen.queryByText('Create subfolder in current folder')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit current folder')).not.toBeInTheDocument();
  });

  test('calls setIsUploadFileDialogOpen when upload button is clicked', () => {
    renderWithTheme(<UploadToolbar />);
    fireEvent.click(screen.getByText('Upload files'));
    expect(mockSetIsUploadFileDialogOpen).toHaveBeenCalledWith(true);
  });

  test('calls setIsCreateFolderDialogOpen when add new folder button is clicked', () => {
    renderWithTheme(<UploadToolbar />);
    fireEvent.click(screen.getByText('Add new folder'));
    expect(mockSetIsCreateFolderDialogOpen).toHaveBeenCalledWith(true);
  });

  test('calls openEditFolderDialog with selectedFSEntry when edit folder button is clicked', () => {
    renderWithTheme(<UploadToolbar folder={mockFolder} />);
    fireEvent.click(screen.getByText('Edit folder'));
    expect(mockOpenEditFolderDialog).toHaveBeenCalledWith(mockFolder);
  });

  test('handles edit folder click when no folder is selected', () => {
    // Mock no selected folder
    mockUseSelectedFSEntry.mockReturnValue(null);

    renderWithTheme(<UploadToolbar />);
    expect(screen.queryByText('Edit folder')).not.toBeInTheDocument();
  });
});
