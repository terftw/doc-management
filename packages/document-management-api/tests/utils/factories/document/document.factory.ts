import { Document } from '@prisma/client';

type PartialDocument = Partial<Document>;

const defaultDocument: Document = {
  id: 1,
  name: `Test Document 1`,
  fileTypeId: 1, // Default to PDF (id: 1)
  fileSize: 500, // 500KB default
  creatorId: 1,
  folderId: null,
  description: `Description for document 1`,
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z'),
  isDeleted: false,
};

/**
 * Factory for creating Document test data
 */
export class DocumentFactory {
  /**
   * Create a mock document with default values
   * @param overrides - Properties to override default values
   */
  static create(overrides: PartialDocument = {}): Document {
    return {
      ...defaultDocument,
      ...overrides,
    };
  }

  /**
   * Create multiple documents
   * @param count - Number of documents to create
   * @param baseOverrides - Base properties to apply to all documents
   */
  static createMany(count: number, baseOverrides: PartialDocument = {}): Document[] {
    return Array.from({ length: count }, (_, index) => {
      const id = baseOverrides.id ? baseOverrides.id + index : index + 1;

      return DocumentFactory.create({
        ...defaultDocument,
        id,
        name: baseOverrides.name ? `${baseOverrides.name} ${index + 1}` : `Test Document ${id}`,
      });
    });
  }

  /**
   * Create a document in a specific folder
   * @param folderId - The folder ID
   * @param overrides - Additional properties to override
   */
  static inFolder(folderId: number, overrides: PartialDocument = {}): Document {
    return DocumentFactory.create({
      ...defaultDocument,
      ...overrides,
      folderId,
    });
  }

  /**
   * Create a PDF document
   * @param overrides - Properties to override default values
   */
  static pdf(overrides: PartialDocument = {}): Document {
    return DocumentFactory.create({
      ...defaultDocument,
      ...overrides,
      fileTypeId: 1, // PDF has id 1, refer to prisma/seed.js
    });
  }

  /**
   * Create a Word document
   * @param overrides - Properties to override default values
   */
  static docx(overrides: PartialDocument = {}): Document {
    return DocumentFactory.create({
      ...defaultDocument,
      ...overrides,
      fileTypeId: 2, // DOCX has id 2, refer to prisma/seed.js
    });
  }

  /**
   * Create a deleted document
   * @param overrides - Properties to override default values
   */
  static deleted(overrides: PartialDocument = {}): Document {
    return DocumentFactory.create({
      ...defaultDocument,
      ...overrides,
      isDeleted: true,
    });
  }

  /**
   * Create documents with varying sizes
   * @param count - Number of documents to create
   * @param minSize - Minimum file size in KB
   * @param maxSize - Maximum file size in KB
   * @param baseOverrides - Base properties to apply to all documents
   */
  static withVaryingSizes(
    count: number,
    minSize: number = 100,
    maxSize: number = 1000,
    baseOverrides: PartialDocument = {},
  ): Document[] {
    return Array.from({ length: count }, (_, index) => {
      const id = baseOverrides.id ? baseOverrides.id + index : index + 1;
      const fileSize = minSize + Math.random() * (maxSize - minSize);

      return DocumentFactory.create({
        ...defaultDocument,
        ...baseOverrides,
        id,
        fileSize,
      });
    });
  }
}
