import FSEntryActionModals from '@/components/fsentries/fsentry-action-modals';
import { DialogProps } from '@mui/material';
import { screen } from '@testing-library/react';
import React from 'react';

import { mockUseDialogStates } from '../../fixtures/shared/dialog-states.fixtures';
import { renderWithTheme } from '../../test-utils';

// Mock the form components
jest.mock('@/components/documents/delete-document-form', () => ({
  __esModule: true,
  default: () => <div data-testid="delete-document-form">Delete Document Form</div>,
}));

jest.mock('@/components/documents/edit-document-form', () => ({
  __esModule: true,
  default: () => <div data-testid="edit-document-form">Edit Document Form</div>,
}));

jest.mock('@/components/documents/upload-doc-form', () => ({
  __esModule: true,
  default: () => <div data-testid="upload-doc-form">Upload Document Form</div>,
}));

jest.mock('@/components/folders/create-folder-form', () => ({
  __esModule: true,
  default: () => <div data-testid="create-folder-form">Create Folder Form</div>,
}));

jest.mock('@/components/folders/edit-folder-form', () => ({
  __esModule: true,
  default: () => <div data-testid="edit-folder-form">Edit Folder Form</div>,
}));

// Mock Dialog from MUI
jest.mock('@mui/material', () => ({
  Dialog: function MockDialog({ open, children }: DialogProps) {
    return open ? <div data-testid="dialog">{children}</div> : null;
  },
}));

// Mock the dialog states hook
jest.mock('@/store/form-store', () => ({
  __esModule: true,
  useDialogStates: () => mockUseDialogStates(),
}));

describe('FSEntryActionModals', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders no dialogs when all are closed', () => {
    renderWithTheme(<FSEntryActionModals />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('renders upload file dialog when open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: false,
      isEditFolderDialogOpen: false,
      isUploadFileDialogOpen: true,
      isEditDocumentDialogOpen: false,
      isDeleteDocumentDialogOpen: false,
    });

    renderWithTheme(<FSEntryActionModals />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('upload-doc-form')).toBeInTheDocument();
  });

  test('renders create folder dialog when open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: true,
      isEditFolderDialogOpen: false,
      isUploadFileDialogOpen: false,
      isEditDocumentDialogOpen: false,
      isDeleteDocumentDialogOpen: false,
    });

    renderWithTheme(<FSEntryActionModals />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('create-folder-form')).toBeInTheDocument();
  });

  test('renders edit folder dialog when open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: false,
      isEditFolderDialogOpen: true,
      isUploadFileDialogOpen: false,
      isEditDocumentDialogOpen: false,
      isDeleteDocumentDialogOpen: false,
    });

    renderWithTheme(<FSEntryActionModals />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('edit-folder-form')).toBeInTheDocument();
  });

  test('renders edit document dialog when open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: false,
      isEditFolderDialogOpen: false,
      isUploadFileDialogOpen: false,
      isEditDocumentDialogOpen: true,
      isDeleteDocumentDialogOpen: false,
    });

    renderWithTheme(<FSEntryActionModals />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('edit-document-form')).toBeInTheDocument();
  });

  test('renders delete document dialog when open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: false,
      isEditFolderDialogOpen: false,
      isUploadFileDialogOpen: false,
      isEditDocumentDialogOpen: false,
      isDeleteDocumentDialogOpen: true,
    });

    renderWithTheme(<FSEntryActionModals />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('delete-document-form')).toBeInTheDocument();
  });

  test('renders multiple dialogs when multiple are open', () => {
    mockUseDialogStates.mockReturnValue({
      isCreateFolderDialogOpen: true,
      isEditFolderDialogOpen: true,
      isUploadFileDialogOpen: false,
      isEditDocumentDialogOpen: false,
      isDeleteDocumentDialogOpen: false,
    });

    renderWithTheme(<FSEntryActionModals />);
    const dialogs = screen.getAllByTestId('dialog');
    expect(dialogs).toHaveLength(2);
    expect(screen.getByTestId('create-folder-form')).toBeInTheDocument();
    expect(screen.getByTestId('edit-folder-form')).toBeInTheDocument();
  });
});
