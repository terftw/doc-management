import { FileType } from '@prisma/client';

type PartialFileType = Partial<FileType>;

/**
 * Factory for creating FileType test data
 */
export class FileTypeFactory {
  /**
   * Create a mock file type with default values
   * @param overrides - Properties to override default values
   */
  static create(overrides: PartialFileType = {}): FileType {
    const id = overrides.id ?? 1;
    const extension = overrides.extension ?? 'pdf';

    return {
      id,
      extension,
      mimeType: overrides.mimeType ?? `application/${extension}`,
      ...overrides,
    };
  }

  /**
   * Create common file types used in the application
   */
  static createCommonTypes(): FileType[] {
    return [
      // PDF
      FileTypeFactory.create({
        id: 1,
        extension: 'pdf',
        mimeType: 'application/pdf',
      }),

      // Word documents
      FileTypeFactory.create({
        id: 2,
        extension: 'docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      }),

      // Powerpoint slides
      FileTypeFactory.create({
        id: 3,
        extension: 'pptx',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      }),

      // Excel spreadsheets
      FileTypeFactory.create({
        id: 4,
        extension: 'xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }),

      // CSV files
      FileTypeFactory.create({
        id: 5,
        extension: 'csv',
        mimeType: 'text/csv',
      }),
    ];
  }

  /**
   * Create a PDF file type
   * @param overrides - Properties to override default values
   */
  static pdf(overrides: PartialFileType = {}): FileType {
    return FileTypeFactory.create({
      extension: 'pdf',
      mimeType: 'application/pdf',
      ...overrides,
    });
  }

  /**
   * Create a Word document file type
   * @param overrides - Properties to override default values
   */
  static docx(overrides: PartialFileType = {}): FileType {
    return FileTypeFactory.create({
      extension: 'docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ...overrides,
    });
  }

  /**
   * Create an Excel spreadsheet file type
   * @param overrides - Properties to override default values
   */
  static xlsx(overrides: PartialFileType = {}): FileType {
    return FileTypeFactory.create({
      extension: 'xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ...overrides,
    });
  }
}
