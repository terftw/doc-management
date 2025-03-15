// Mock the form store hooks
const mockSetIsCreateFolderDialogOpen = jest.fn();
const mockOpenEditFolderDialog = jest.fn();
const mockSetIsUploadFileDialogOpen = jest.fn();
const mockSelectedFSEntry = { id: '123', name: 'Test Folder', path: '/test-folder' };

// Create a mock function for useSelectedFSEntry that we can control
const mockUseSelectedFSEntry = jest.fn().mockReturnValue(mockSelectedFSEntry);

export const formStoreFixtures = {
  mockSetIsCreateFolderDialogOpen,
  mockOpenEditFolderDialog,
  mockSetIsUploadFileDialogOpen,
  mockUseSelectedFSEntry,
  mockSelectedFSEntry,
};
