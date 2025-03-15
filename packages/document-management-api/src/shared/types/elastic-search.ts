/**
 * Elasticsearch source
 *
 * This is the type of the source object for the Elasticsearch search.
 */
interface ESSource {
  id: number;
  creatorId: number;
  folderId?: number;
  parentId?: number;
}

/**
 * Elasticsearch hit
 *
 * This is the type of the hit object for the Elasticsearch search.
 */
export interface SearchHit<T = ESSource> {
  _index: string;
  _source: T;
}

/**
 * Elasticsearch response
 *
 * This is the type of the response object for the Elasticsearch search.
 */
export interface SearchResponse<T = ESSource> {
  hits: SearchHit<T>[];
  total: number | { value: number };
}

/**
 * Sync context
 *
 * This is the type of the context object for the Elasticsearch sync.
 */
export interface SyncContext<T extends SyncableModel> {
  model: T;
  operation: SyncableOperation;
  args: unknown;
  result?: unknown;
}

/**
 * Syncable model
 *
 * This is the type of the model for the Elasticsearch sync.
 * This should be the same as the searchable model names in the database.
 */
export type SyncableModel = 'Document' | 'Folder';

export type SyncableOperation = 'create' | 'update' | 'updateMany' | 'delete';
