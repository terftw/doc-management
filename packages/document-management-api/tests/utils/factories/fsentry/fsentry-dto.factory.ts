import { FSEntryQueryDTO } from '@/features/fsentry/fsentry.schema';

type PartialFSEntryQueryDTO = Partial<FSEntryQueryDTO>;

/**
 * Factory for creating mock FSEntry query DTOs
 *
 * Provides methods to create mock FSEntryQueryDTO objects
 * with default values or custom overrides.
 */
export class FSEntryDtoFactory {
  /**
   * Create a mock fsentry query DTO with default values
   * @param overrides - Properties to override default values
   */
  static createFSEntryQueryDTO(overrides: PartialFSEntryQueryDTO = {}): FSEntryQueryDTO {
    return {
      page: overrides.page ?? 1,
      pageSize: overrides.pageSize ?? 10,
      searchQuery: overrides.searchQuery ?? '',
      ...overrides,
    };
  }
}
