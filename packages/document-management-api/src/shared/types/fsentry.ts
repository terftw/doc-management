/**
 * @fileoverview FSEntry Module
 *
 * This module defines a type system for representing file system entries in a hierarchical structure.
 * It provides interfaces, type definitions, type guards, and utility functions for working with
 * folders and documents in a file system.
 *
 * The module supports two primary entry types:
 * - FolderEntry: Represents a directory that can contain other folders and documents
 * - DocumentEntry: Represents a file with associated metadata
 *
 * @module FSEntry
 */
import { Document, FileType, Folder } from '@prisma/client';

/**
 * Possible file system entry types.
 * @typedef {'folder' | 'document'} FSEntryType
 */
export type FSEntryType = 'folder' | 'document';

/**
 * Base interface with properties common to all file system entries.
 *
 * @interface FSEntryBase
 * @property {number} id - Unique identifier for the entry
 * @property {string} name - Display name of the entry
 * @property {string|null} description - Optional description of the entry
 * @property {FSEntryType} entryType - Type discriminator ('folder' or 'document')
 * @property {number} creatorId - ID of the user who created the entry
 * @property {Date} createdAt - Timestamp when the entry was created
 * @property {Date} updatedAt - Timestamp when the entry was last updated
 * @property {boolean} isDeleted - Soft deletion flag
 */
interface FSEntryBase {
  id: number;
  name: string;
  description: string | null;
  entryType: FSEntryType;
  creatorId: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

/**
 * Represents a folder in the file system.
 *
 * @interface FolderEntry
 * @extends {FSEntryBase}
 * @property {string} entryType - Always 'folder' for folder entries
 * @property {number} depth - Nesting level in the folder hierarchy (0 for root)
 * @property {FolderEntry|null} [parent] - Parent folder, if any
 * @property {number|null} parentId - ID of the parent folder, null for root folders
 * @property {FSEntry[]} [children] - Child entries (both folders and documents)
 * @property {DocumentEntry[]} [documents] - Documents directly contained in this folder
 * @property {{name: string}} [creator] - Information about the user who created the folder
 */
export interface FolderEntry extends FSEntryBase {
  entryType: 'folder';
  depth: number;
  parent?: FolderEntry | null;
  parentId: number | null;
  children?: FSEntry[];
  documents?: DocumentEntry[];
  creator?: { name: string };
}

/**
 * Represents a document in the file system.
 *
 * @interface DocumentEntry
 * @extends {FSEntryBase}
 * @property {string} entryType - Always 'document' for document entries
 * @property {number} fileTypeId - Reference to the type of file (e.g., PDF, csv)
 * @property {number} fileSize - Size of the file in bytes
 * @property {FolderEntry|null} [folder] - Parent folder containing this document
 * @property {number|null} folderId - ID of the parent folder, null if not in a folder
 * @property {FileType} [fileType] - File type information
 * @property {{name: string}} [creator] - Information about the user who created the document
 */
export interface DocumentEntry extends FSEntryBase {
  entryType: 'document';
  fileTypeId: number;
  fileSize: number;
  folder?: FolderEntry | null;
  folderId: number | null;
  fileType?: FileType;
  creator?: { name: string };
}

/**
 * Union type representing either a folder or a document entry.
 *
 * @typedef {FolderEntry | DocumentEntry} FSEntry
 */
export type FSEntry = FolderEntry | DocumentEntry;

/**
 * Structure for paginated results of file system entries.
 *
 * @typedef {Object} PaginatedFSEntriesResult
 * @property {FSEntry[]} data - Array of file system entries for the current page
 * @property {Object} metadata - Pagination metadata
 * @property {number} metadata.currentPage - Current page number
 * @property {number} metadata.pageSize - Number of items per page
 * @property {number} metadata.totalCount - Total number of items across all pages
 * @property {number} metadata.totalPages - Total number of pages
 * @property {Folder} [metadata.folder] - Current folder information if applicable
 * @property {number} [metadata.childrenCount] - Number of direct children in the current folder
 */
export type PaginatedFSEntriesResult = {
  data: FSEntry[];
  metadata: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    folder?: Folder;
    childrenCount?: number;
  };
};

/**
 * Type guard to check if an entry is a folder.
 *
 * @function isFolder
 * @param {FSEntry} entry - The entry to check
 * @returns {boolean} True if the entry is a folder, false otherwise
 */
export function isFolder(entry: FSEntry): entry is FolderEntry {
  return entry.entryType === 'folder';
}

/**
 * Type guard to check if an entry is a document.
 *
 * @function isDocument
 * @param {FSEntry} entry - The entry to check
 * @returns {boolean} True if the entry is a document, false otherwise
 */
export function isDocument(entry: FSEntry): entry is DocumentEntry {
  return entry.entryType === 'document';
}

/**
 * Converts a Prisma Folder model to a FolderEntry.
 *
 * @function folderToFSEntry
 * @param {Folder & {creator?: {name: string}}} folder - Prisma folder model with optional creator info
 * @param {FSEntry[]} [children] - Optional array of child entries
 * @param {Document[]} [documents] - Optional array of documents in this folder
 * @returns {FolderEntry} A folder entry with all properties populated
 */
export function folderToFSEntry(
  folder: Folder & { creator?: { name: string } },
  children?: FSEntry[],
  documents?: Document[],
): FolderEntry {
  return {
    ...folder,
    entryType: 'folder',
    children: children || [],
    documents: documents ? documents.map(documentToFSEntry) : [],
  };
}

/**
 * Converts a Prisma Document model to a DocumentEntry.
 *
 * @function documentToFSEntry
 * @param {Document & {creator?: {name: string}}} document - Prisma document model with optional creator info
 * @returns {DocumentEntry} A document entry with all properties populated
 */
export function documentToFSEntry(
  document: Document & { creator?: { name: string } },
): DocumentEntry {
  return {
    ...document,
    entryType: 'document',
  };
}
