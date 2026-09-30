/**
 * Generic Solution Persistence Abstraction.
 *
 * Provides a vendor-neutral, injectable storage boundary for Solution Packages.
 * Neither Core nor templates know how records are stored.
 *
 * NOTE: This is an architectural persistence boundary and in-memory test store,
 * NOT a production database connection. Real deployments connect their own backend
 * or persistence provider behind this exact interface without modifying Core.
 */

export interface PersistenceRecord {
  id: string;
  createdAt: number;
  updatedAt: number;
  [key: string]: unknown;
}

export type PersistenceResult<T> =
  | {
      success: true;
      id: string;
      record: T & PersistenceRecord;
      message?: string;
      error?: undefined;
      code?: undefined;
    }
  | {
      success: false;
      error: string;
      code: string;
      id?: undefined;
      record?: undefined;
      message?: string;
    };

export interface PersistenceQuery {
  limit?: number;
  offset?: number;
  filter?: Record<string, unknown>;
  sort?: string;
}

export interface PersistenceStore {
  readonly name: string;
  saveRecord<T extends Record<string, unknown>>(
    collection: string,
    data: T,
    id?: string
  ): Promise<PersistenceResult<T>>;
  getRecord<T extends Record<string, unknown>>(
    collection: string,
    id: string
  ): Promise<(T & PersistenceRecord) | null>;
  listRecords<T extends Record<string, unknown>>(
    collection: string,
    query?: PersistenceQuery
  ): Promise<(T & PersistenceRecord)[]>;
  deleteRecord(collection: string, id: string): Promise<boolean>;
  clear(collection?: string): Promise<void>;
}

let counter = 0;

/**
 * Deterministic In-Memory Persistence Store for architectural proofs and tests.
 * Zero external database or vendor dependency.
 */
export class MemoryPersistenceStore implements PersistenceStore {
  readonly name = 'in-memory-store';
  private collections = new Map<string, Map<string, PersistenceRecord>>();

  private getCollection(name: string): Map<string, PersistenceRecord> {
    let col = this.collections.get(name);
    if (!col) {
      col = new Map();
      this.collections.set(name, col);
    }
    return col;
  }

  async saveRecord<T extends Record<string, unknown>>(
    collection: string,
    data: T,
    id?: string
  ): Promise<PersistenceResult<T>> {
    if (!collection || typeof collection !== 'string') {
      return { success: false, error: 'Collection name is required', code: 'INVALID_COLLECTION' };
    }
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'Record data must be an object', code: 'INVALID_DATA' };
    }

    const col = this.getCollection(collection);
    const now = Date.now();
    const recordId = id || (typeof data.id === 'string' && data.id) || `${collection}-${++counter}`;

    const existing = col.get(recordId);
    const fullRecord: T & PersistenceRecord = {
      ...data,
      id: recordId,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    col.set(recordId, fullRecord);
    return {
      success: true,
      id: recordId,
      record: fullRecord,
      message: `Record ${recordId} saved to ${collection}.`,
    };
  }

  async getRecord<T extends Record<string, unknown>>(
    collection: string,
    id: string
  ): Promise<(T & PersistenceRecord) | null> {
    const col = this.getCollection(collection);
    const found = col.get(id);
    return found ? (found as unknown as T & PersistenceRecord) : null;
  }

  async listRecords<T extends Record<string, unknown>>(
    collection: string,
    query?: PersistenceQuery
  ): Promise<(T & PersistenceRecord)[]> {
    const col = this.getCollection(collection);
    let items = Array.from(col.values()) as unknown as (T & PersistenceRecord)[];

    if (query?.filter) {
      const filterEntries = Object.entries(query.filter);
      items = items.filter((item) =>
        filterEntries.every(([k, v]) => (item as Record<string, unknown>)[k] === v)
      );
    }

    if (query?.offset) {
      items = items.slice(query.offset);
    }
    if (query?.limit) {
      items = items.slice(0, query.limit);
    }

    return items;
  }

  async deleteRecord(collection: string, id: string): Promise<boolean> {
    const col = this.getCollection(collection);
    return col.delete(id);
  }

  async clear(collection?: string): Promise<void> {
    if (collection) {
      this.collections.delete(collection);
    } else {
      this.collections.clear();
      counter = 0;
    }
  }
}

/**
 * Singleton Persistence Adapter.
 * Allows solution modules to read/write records without depending on concrete databases.
 */
export class PersistenceAdapter {
  private store: PersistenceStore;

  constructor(store?: PersistenceStore) {
    this.store = store ?? new MemoryPersistenceStore();
  }

  setStore(store: PersistenceStore): void {
    this.store = store;
  }

  getStore(): PersistenceStore {
    return this.store;
  }

  saveRecord<T extends Record<string, unknown>>(
    collection: string,
    data: T,
    id?: string
  ): Promise<PersistenceResult<T>> {
    return this.store.saveRecord(collection, data, id);
  }

  getRecord<T extends Record<string, unknown>>(
    collection: string,
    id: string
  ): Promise<(T & PersistenceRecord) | null> {
    return this.store.getRecord(collection, id);
  }

  listRecords<T extends Record<string, unknown>>(
    collection: string,
    query?: PersistenceQuery
  ): Promise<(T & PersistenceRecord)[]> {
    return this.store.listRecords(collection, query);
  }

  deleteRecord(collection: string, id: string): Promise<boolean> {
    return this.store.deleteRecord(collection, id);
  }

  clear(collection?: string): Promise<void> {
    return this.store.clear(collection);
  }
}

export const persistenceAdapter = new PersistenceAdapter();
