/**
 * IndexedDB wrapper for storing uploaded GLB files
 * with enhanced metadata support
 */

import type { AssetMetadata } from '@/types/assets'

const DB_NAME = '3d-viewer-storage'
const DB_VERSION = 2 // Incremented for schema migration
const STORE_NAME = 'uploaded-files'

/**
 * Stored file interface - extends AssetMetadata with blob
 */
export interface StoredFile {
  id: string
  name: string // originalName (kept for backward compatibility)
  blob: Blob
  uploadedAt: number
  type: 'mesh' | 'animations' | 'both'
  characterId?: string

  // Enhanced metadata (all optional for backward compatibility)
  customName?: string
  tags?: string[]
  notes?: string
  version?: string
  lastModified?: number
  size?: number
  originalName?: string

  // 3D metadata (all optional)
  vertices?: number
  triangles?: number
  bones?: string[]
  animations?: number

  // Optional thumbnail
  thumbnail?: string
}

class IndexedDBStorage {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const oldVersion = event.oldVersion
        const transaction = (event.target as IDBOpenDBRequest).transaction!

        // Create object store if doesn't exist (v1)
        let objectStore: IDBObjectStore
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
        } else {
          objectStore = transaction.objectStore(STORE_NAME)
        }

        // Migration from v1 to v2: Add indexes for enhanced metadata
        if (oldVersion < 2) {
          // Create index for custom name (for fast search)
          if (!objectStore.indexNames.contains('customName')) {
            objectStore.createIndex('customName', 'customName', { unique: false })
          }

          // Create multi-entry index for tags (allows searching by any tag)
          if (!objectStore.indexNames.contains('tags')) {
            objectStore.createIndex('tags', 'tags', { unique: false, multiEntry: true })
          }

          // Create index for upload date (for sorting)
          if (!objectStore.indexNames.contains('uploadedAt')) {
            objectStore.createIndex('uploadedAt', 'uploadedAt', { unique: false })
          }

          // Create index for last modified (for sorting)
          if (!objectStore.indexNames.contains('lastModified')) {
            objectStore.createIndex('lastModified', 'lastModified', { unique: false })
          }

          // Migrate existing records to have default values for new fields
          const cursorRequest = objectStore.openCursor()
          cursorRequest.onsuccess = (e) => {
            const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result
            if (cursor) {
              const file = cursor.value as StoredFile
              // Add default values for new fields if they don't exist
              if (!file.tags) file.tags = []
              if (!file.lastModified) file.lastModified = file.uploadedAt
              cursor.update(file)
              cursor.continue()
            }
          }
        }
      }
    })
  }

  async saveFile(file: StoredFile): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(file)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getFile(id: string): Promise<StoredFile | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  async getAllFiles(): Promise<StoredFile[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Update metadata of a stored file (without re-uploading blob)
   */
  async updateMetadata(
    id: string,
    metadata: Partial<Omit<StoredFile, 'id' | 'blob'>>
  ): Promise<void> {
    if (!this.db) await this.init()

    const file = await this.getFile(id)
    if (!file) throw new Error(`File with id ${id} not found`)

    const updated: StoredFile = {
      ...file,
      ...metadata,
      lastModified: Date.now(),
    }

    return this.saveFile(updated)
  }

  /**
   * Search files by query (searches in name, customName, and tags)
   */
  async searchFiles(query: string): Promise<StoredFile[]> {
    if (!this.db) await this.init()
    if (!query) return this.getAllFiles()

    const allFiles = await this.getAllFiles()
    const lowerQuery = query.toLowerCase()

    return allFiles.filter((file) => {
      const name = file.name.toLowerCase()
      const customName = file.customName?.toLowerCase() || ''
      const tags = file.tags?.map((t) => t.toLowerCase()).join(' ') || ''

      return (
        name.includes(lowerQuery) ||
        customName.includes(lowerQuery) ||
        tags.includes(lowerQuery)
      )
    })
  }

  /**
   * Get files by tag
   */
  async getFilesByTag(tag: string): Promise<StoredFile[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const index = store.index('tags')
      const request = index.getAll(tag)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get storage quota information
   */
  async getStorageQuota(): Promise<{ used: number; available: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      const used = estimate.usage || 0
      const available = estimate.quota || 0
      const percentage = available > 0 ? (used / available) * 100 : 0

      return { used, available, percentage }
    }

    // Fallback if storage API not available
    return { used: 0, available: 0, percentage: 0 }
  }

  /**
   * Delete multiple files by IDs
   */
  async deleteMultiple(ids: string[]): Promise<void> {
    if (!this.db) await this.init()

    const promises = ids.map((id) => this.deleteFile(id))
    await Promise.all(promises)
  }
}

export const indexedDBStorage = new IndexedDBStorage()
