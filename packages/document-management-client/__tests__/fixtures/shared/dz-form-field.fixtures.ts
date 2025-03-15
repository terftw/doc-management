// Mock Theme Provider
export const mockTheme = {
  spacing: (value: number) => `${value * 8}px`,
  palette: {
    primary: {
      main: '#1976d2',
      dark: '#115293',
      light: '#4791db',
    },
    error: {
      main: '#d32f2f',
      dark: '#c62828',
    },
    background: {
      default: '#fafafa',
    },
    text: {
      primary: '#000000',
      secondary: '#00000099',
    },
  },
};

// Mock Files
export const createMockFile = (name: string, type: string, size: number = 102400): File => {
  const file = new File(['mock file content'], name, { type });

  // Override the size property
  Object.defineProperty(file, 'size', {
    get() {
      return size;
    },
  });

  return file;
};

export const mockPdfFile = createMockFile('document.pdf', 'application/pdf', 512000);

export const mockDocxFile = createMockFile(
  'document.docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  345600,
);

export const mockCsvFile = createMockFile('data.csv', 'text/csv', 76800);

export const mockXlsxFile = createMockFile(
  'spreadsheet.xlsx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  245760,
);

export const mockPptxFile = createMockFile(
  'presentation.pptx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  890880,
);

export const mockLargeFile = createMockFile(
  'too_large.pdf',
  'application/pdf',
  1572864, // Larger than the 1MB limit
);

export const mockUnsupportedFile = createMockFile('image.jpg', 'image/jpeg', 102400);

// Mock Dropzone hook responses
export const createDropzoneResponse = (isDragActive = false, file: File | null = null) => ({
  getRootProps: () => ({
    onClick: jest.fn(),
    role: 'presentation',
    onKeyDown: jest.fn(),
  }),
  getInputProps: () => ({
    type: 'file',
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 1048576,
  }),
  isDragActive,
  acceptedFiles: file ? [file] : [],
  fileRejections: [],
});
