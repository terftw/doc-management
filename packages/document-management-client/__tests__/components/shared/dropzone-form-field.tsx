import DropzoneFormField from '@/components/shared/dropzone-form-field';
import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useDropzone } from 'react-dropzone';

import { renderWithTheme } from '../../test-utils';

// Mock the modules
jest.mock('react-dropzone', () => ({
  useDropzone: jest.fn(),
}));

jest.mock('@/lib/file-data-processing', () => ({
  getFileExtension: jest.fn().mockImplementation(filename => {
    const parts = filename.split('.');
    return parts[parts.length - 1].toUpperCase();
  }),
  getPrettyFileSize: jest.fn().mockImplementation(size => {
    return `${(size / 1024).toFixed(2)} KB`;
  }),
}));

// Mock MUI icons
jest.mock('@mui/icons-material/CloudUpload', () => {
  return function DummyCloudUploadIcon() {
    return <div data-testid="cloud-upload-icon" />;
  };
});

jest.mock('@mui/icons-material/Delete', () => {
  return function DummyDeleteIcon() {
    return <div data-testid="delete-icon" />;
  };
});

jest.mock('@mui/icons-material/InsertDriveFile', () => {
  return function DummyInsertDriveFileIcon() {
    return <div data-testid="file-icon" />;
  };
});

describe('DropzoneFormField', () => {
  // Setup mock implementation for useDropzone
  beforeEach(() => {
    (useDropzone as jest.Mock).mockReturnValue({
      getRootProps: () => ({
        onClick: jest.fn(),
        role: 'presentation',
        onKeyDown: jest.fn(),
      }),
      getInputProps: () => ({ type: 'file', multiple: false }),
      isDragActive: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders dropzone with correct placeholder text', () => {
    renderWithTheme(<DropzoneFormField />);

    expect(screen.getByText(/Drag 'n' drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to select files/i)).toBeInTheDocument();
    expect(screen.getByText(/Supported formats:/i)).toBeInTheDocument();
  });

  test('shows drag active state when dragging', () => {
    (useDropzone as jest.Mock).mockReturnValue({
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: true,
    });

    renderWithTheme(<DropzoneFormField />);

    expect(screen.getByText(/Drop files here.../i)).toBeInTheDocument();
  });

  test('displays file information when file is selected', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    renderWithTheme(<DropzoneFormField value={mockFile} />);

    expect(screen.getByText('File selected')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByTestId('file-icon')).toBeInTheDocument();
    expect(screen.getByTestId('delete-icon')).toBeInTheDocument();
  });

  test('calls onChange when a file is dropped', () => {
    const mockOnChange = jest.fn();
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    let onDropCallback: (_files: File[]) => void = () => {};

    (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
      onDropCallback = onDrop;
      return {
        getRootProps: () => ({}),
        getInputProps: () => ({}),
        isDragActive: false,
      };
    });

    renderWithTheme(<DropzoneFormField onChange={mockOnChange} />);

    // Simulate file drop
    onDropCallback([mockFile]);

    expect(mockOnChange).toHaveBeenCalledWith(mockFile);
  });

  test('removes file when delete button is clicked', () => {
    const mockOnChange = jest.fn();
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    renderWithTheme(<DropzoneFormField value={mockFile} onChange={mockOnChange} />);

    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-icon').closest('button');
    fireEvent.click(deleteButton!);

    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  test('displays error state when error prop is true', () => {
    const errorMessage = 'File is too large';

    renderWithTheme(<DropzoneFormField error={true} helperText={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
