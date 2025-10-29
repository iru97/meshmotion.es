/**
 * Enhanced metadata for stored assets
 * Extends the basic file info with user-editable fields
 */
export interface AssetMetadata {
  // Core identification
  id: string
  originalName: string
  customName?: string // User-editable name

  // File info
  type: 'mesh' | 'animations' | 'both'
  size: number
  uploadedAt: number
  lastModified: number

  // User-editable metadata
  tags: string[]
  notes?: string
  version?: string

  // Associated character (for animations)
  characterId?: string

  // 3D metadata (extracted from GLB analysis)
  vertices?: number
  triangles?: number
  bones?: string[]
  animations?: number

  // Optional thumbnail (base64 or blob URL)
  thumbnail?: string
}

/**
 * Filter and sort options for asset list
 */
export interface AssetFilter {
  searchQuery: string
  sortBy: 'name' | 'date' | 'size'
  sortOrder: 'asc' | 'desc'
  tags: string[]
}

/**
 * Default asset filter
 */
export const DEFAULT_ASSET_FILTER: AssetFilter = {
  searchQuery: '',
  sortBy: 'date',
  sortOrder: 'desc',
  tags: [],
}

/**
 * Storage quota information
 */
export interface StorageQuota {
  used: number
  available: number
  percentage: number
}
