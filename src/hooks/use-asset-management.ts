import { useState, useEffect, useCallback, useMemo } from 'react'
import { useViewerStore } from '@/lib/store/viewer-store'
import { indexedDBStorage, type StoredFile } from '@/lib/storage/indexed-db'
import type { AssetMetadata, AssetFilter } from '@/types/assets'

/**
 * Hook for managing uploaded assets (characters and animations)
 * Provides CRUD operations and filtering
 */
export function useAssetManagement() {
  const [assets, setAssets] = useState<StoredFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filter = useViewerStore((state) => state.assetFilter)
  const updateFilter = useViewerStore((state) => state.updateAssetFilter)
  const clearSelection = useViewerStore((state) => state.clearAssetSelection)

  // Load assets from IndexedDB
  const loadAssets = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const files = await indexedDBStorage.getAllFiles()
      setAssets(files)
    } catch (err) {
      console.error('Failed to load assets:', err)
      setError(err instanceof Error ? err.message : 'Failed to load assets')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load on mount
  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let result = [...assets]

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase()
      result = result.filter((asset) => {
        const name = asset.name.toLowerCase()
        const customName = asset.customName?.toLowerCase() || ''
        const tags = asset.tags?.join(' ').toLowerCase() || ''

        return (
          name.includes(query) ||
          customName.includes(query) ||
          tags.includes(query)
        )
      })
    }

    // Filter by tags
    if (filter.tags.length > 0) {
      result = result.filter((asset) => {
        const assetTags = asset.tags || []
        return filter.tags.some((tag) => assetTags.includes(tag))
      })
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0

      switch (filter.sortBy) {
        case 'name':
          const nameA = (a.customName || a.name).toLowerCase()
          const nameB = (b.customName || b.name).toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case 'date':
          comparison = (b.uploadedAt || 0) - (a.uploadedAt || 0)
          break
        case 'size':
          comparison = (b.size || 0) - (a.size || 0)
          break
      }

      return filter.sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [assets, filter])

  // Get only character assets
  const characters = useMemo(
    () => filteredAssets.filter((a) => a.type === 'mesh' || a.type === 'both'),
    [filteredAssets]
  )

  // Get only animation assets
  const animations = useMemo(
    () => filteredAssets.filter((a) => a.type === 'animations' || a.type === 'both'),
    [filteredAssets]
  )

  // Rename an asset
  const renameAsset = useCallback(
    async (id: string, newName: string) => {
      try {
        await indexedDBStorage.updateMetadata(id, { customName: newName })
        await loadAssets()
        return { success: true }
      } catch (err) {
        console.error('Failed to rename asset:', err)
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to rename asset',
        }
      }
    },
    [loadAssets]
  )

  // Update asset metadata (tags, notes, version)
  const updateAssetMetadata = useCallback(
    async (id: string, metadata: Partial<AssetMetadata>) => {
      try {
        await indexedDBStorage.updateMetadata(id, metadata)
        await loadAssets()
        return { success: true }
      } catch (err) {
        console.error('Failed to update asset metadata:', err)
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to update metadata',
        }
      }
    },
    [loadAssets]
  )

  // Delete an asset
  const deleteAsset = useCallback(
    async (id: string) => {
      try {
        await indexedDBStorage.deleteFile(id)
        await loadAssets()
        clearSelection()

        // Remove from viewer if currently displayed
        const currentCharacter = useViewerStore.getState().currentCharacter
        if (currentCharacter?.id === id) {
          useViewerStore.getState().setCharacter(null)
          useViewerStore.getState().setAnimation(null)
        }

        return { success: true }
      } catch (err) {
        console.error('Failed to delete asset:', err)
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to delete asset',
        }
      }
    },
    [loadAssets, clearSelection]
  )

  // Delete multiple assets
  const deleteMultiple = useCallback(
    async (ids: string[]) => {
      try {
        await indexedDBStorage.deleteMultiple(ids)
        await loadAssets()
        clearSelection()

        // Remove from viewer if any currently displayed
        const currentCharacter = useViewerStore.getState().currentCharacter
        if (currentCharacter && ids.includes(currentCharacter.id)) {
          useViewerStore.getState().setCharacter(null)
          useViewerStore.getState().setAnimation(null)
        }

        return { success: true }
      } catch (err) {
        console.error('Failed to delete assets:', err)
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Failed to delete assets',
        }
      }
    },
    [loadAssets, clearSelection]
  )

  // Get storage quota
  const getQuota = useCallback(async () => {
    try {
      return await indexedDBStorage.getStorageQuota()
    } catch (err) {
      console.error('Failed to get storage quota:', err)
      return { used: 0, available: 0, percentage: 0 }
    }
  }, [])

  return {
    // Data
    assets: filteredAssets,
    characters,
    animations,
    allAssets: assets, // Unfiltered
    loading,
    error,

    // Filter
    filter,
    updateFilter,

    // Actions
    renameAsset,
    updateAssetMetadata,
    deleteAsset,
    deleteMultiple,
    loadAssets,
    getQuota,
  }
}
