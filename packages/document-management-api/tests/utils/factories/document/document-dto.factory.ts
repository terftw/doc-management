import { CreateDocumentDto, UpdateDocumentDto } from '@/features/document/document.schema';

type PartialCreateDocumentDto = Partial<CreateDocumentDto>;
type PartialUpdateDocumentDto = Partial<UpdateDocumentDto>;

/**
 * Factory for creating mock document DTOs
 *
 * Provides methods to create mock CreateDocumentDto and UpdateDocumentDto objects
 * with default values or custom overrides.
 */
export class DocumentDtoFactory {
  /**
   * Create a mock document create DTO with default values
   * @param overrides - Properties to override default values
   */
  static createCreateDocumentDto(overrides: PartialCreateDocumentDto = {}): CreateDocumentDto {
    return {
      name: overrides.name ?? `Test Document`,
      fileExtension: overrides.fileExtension ?? 'pdf',
      fileSize: overrides.fileSize ?? 500,
      description: overrides.description ?? `Description for document`,
      ...overrides,
    };
  }

  /**
   * Create a mock document update DTO with default values
   * @param overrides - Properties to override default values
   */
  static createUpdateDocumentDto(overrides: PartialUpdateDocumentDto = {}): UpdateDocumentDto {
    return {
      description: overrides.description ?? `Updated description for document`,
      ...overrides,
    };
  }
}
