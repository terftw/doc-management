import { Folder } from '@prisma/client';

type PartialFolder = Partial<Folder>;

/**
 * Factory for creating Folder test data
 */
export class FolderFactory {
  /**
   * Create a mock folder with default values
   * @param overrides - Properties to override default values
   */
  static create(overrides: PartialFolder = {}): Folder {
    const id = overrides.id ?? 1;

    return {
      id,
      depth: overrides.depth ?? 0,
      name: overrides.name ?? `Test Folder ${id}`,
      description: overrides.description ?? `Description for folder ${id}`,
      parentId: overrides.parentId ?? null,
      creatorId: overrides.creatorId ?? 1,
      createdAt: overrides.createdAt ?? new Date('2023-01-01T00:00:00Z'),
      updatedAt: overrides.updatedAt ?? new Date('2023-01-01T00:00:00Z'),
      isDeleted: overrides.isDeleted ?? false,
      ...overrides,
    };
  }

  /**
   * Create multiple folders
   * @param count - Number of folders to create
   * @param baseOverrides - Base properties to apply to all folders
   */
  static createMany(count: number, baseOverrides: PartialFolder = {}): Folder[] {
    return Array.from({ length: count }, (_, index) => {
      const id = baseOverrides.id ? baseOverrides.id + index : index + 1;
      return FolderFactory.create({
        ...baseOverrides,
        id,
        name: baseOverrides.name ? `${baseOverrides.name} ${index + 1}` : `Test Folder ${id}`,
      });
    });
  }

  /**
   * Create a subfolder with the correct depth
   * @param parentFolder - The parent folder
   * @param overrides - Additional properties to override
   */
  static createSubfolder(parentFolder: Folder, overrides: PartialFolder = {}): Folder {
    return FolderFactory.create({
      parentId: parentFolder.id,
      depth: parentFolder.depth + 1,
      creatorId: parentFolder.creatorId,
      ...overrides,
    });
  }

  /**
   * Create a deleted folder
   * @param overrides - Properties to override default values
   */
  static deleted(overrides: PartialFolder = {}): Folder {
    return FolderFactory.create({
      isDeleted: true,
      ...overrides,
    });
  }

  /**
   * Create a folder hierarchy (parent with children)
   * @param childCount - Number of child folders to create
   * @param parentOverrides - Overrides for the parent folder
   * @param childrenOverrides - Overrides for all children
   */
  static createHierarchy(
    childCount: number,
    parentOverrides: PartialFolder = {},
    childrenOverrides: PartialFolder = {},
  ): { parent: Folder; children: Folder[] } {
    const parent = FolderFactory.create(parentOverrides);

    const children = Array.from({ length: childCount }, (_, index) => {
      return FolderFactory.create({
        id: (childrenOverrides.id ?? 100) + index,
        parentId: parent.id,
        depth: parent.depth + 1,
        creatorId: parent.creatorId,
        ...childrenOverrides,
      });
    });

    return { parent, children };
  }
}
