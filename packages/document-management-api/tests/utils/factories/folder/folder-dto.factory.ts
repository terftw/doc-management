import { CreateFolderDto, UpdateFolderDto } from '@/features/folder/folder.schema';

type PartialCreateFolderDto = Partial<CreateFolderDto>;
type PartialUpdateFolderDto = Partial<UpdateFolderDto>;

/**
 * Factory for creating mock folder DTOs
 *
 * Provides methods to create mock CreateFolderDto and UpdateFolderDto objects
 * with default values or custom overrides.
 */
export class FolderDtoFactory {
  /**
   * Create a mock folder create DTO with default values
   * @param overrides - Properties to override default values
   */
  static createCreateFolderDto(overrides: PartialCreateFolderDto = {}): CreateFolderDto {
    return {
      name: overrides.name ?? `Test Folder`,
      description: overrides.description ?? `Description for folder`,
      parentId: overrides.parentId ?? undefined,
      ...overrides,
    };
  }

  /**
   * Create a mock folder update DTO with default values
   * @param overrides - Properties to override default values
   */
  static createUpdateFolderDto(overrides: PartialUpdateFolderDto = {}): UpdateFolderDto {
    return {
      name: overrides.name ?? `Updated folder name`,
      description: overrides.description ?? `Updated description for folder`,
      ...overrides,
    };
  }
}
